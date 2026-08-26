import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';

export interface OrganCell {
  /** 이동 추적 키 */
  id: string;
  /** 체질 A에서의 표기 (주도 장부를 앞에) */
  labelA: string;
  /** 체질 B에서의 표기 */
  labelB: string;
}

export interface OrganArrayTransitionProps {
  constitutionA: string;
  constitutionB: string;
  /** 체질 A 기준 1→5 순서 */
  cells: OrganCell[];
  /** 체질 B의 순서를 id 배열로 */
  orderB: string[];
  /** 이동하지 않는 칸의 id (보통 1번·5번) */
  fixedCells: string[];
  /** 아래로 움직일 칸의 id */
  liftDown: string[];
  /** 첫 칸 아래 소형 캡션 */
  caption?: string;
  /** 화면 하단 출처 자막 */
  source?: string;
}

/**
 * 사양서 3절 타임라인(초).
 *
 * 총 길이 = present + cue + (이동 칸 수 × move) + settle.
 * 목양·목음편은 이동 칸이 3개이므로 1.0 + 0.5 + 2.85 + 0.95 = 5.30초.
 * 4절 "5.3초를 줄이지 마십시오" 규칙에 따라 이 값들은 축소하지 않는다.
 */
const T = {
  /** 단계0 — 체질 A 배열 제시 */
  present: 1.0,
  /** 단계1 — 이동 칸 강조색 점등 */
  cue: 0.5,
  /** 이동 1회 */
  move: 0.95,
  /** 마지막 단계 — 표기·체질명 전환 후 정지 */
  settle: 0.95,
  /** 이동 내부: 들어올림 완료 시점 */
  liftIn: 0.2,
  /** 이동 내부: 수평 이동 완료 시점 */
  slideEnd: 0.67,
  /** 표기 전환 크로스페이드 */
  swap: 0.3,
} as const;

/**
 * 사양서 5절 프로토타입 기준값(px)을 1920×1080에 맞춰 비례 확대한 배율.
 * 5칸 총 너비 1474px — 좌우 여백 223px.
 */
const SCALE = 2.6;
const CARD_W = Math.round(104 * SCALE);
const CARD_H = Math.round(56 * SCALE);
const GAP = Math.round(12 * SCALE);
/** 수직 이동 폭 — 카드 높이의 약 93% (사양서: 90% 안팎) */
const LIFT = Math.round(52 * SCALE);
const RADIUS = Math.round(8 * SCALE);

/**
 * 세로 배치.
 *
 * 위로 들린 카드가 체질명을 침범하지 않도록 행 위쪽에 LIFT만큼을 비워 둔다.
 *
 * 아래쪽은 비우지 않는다. 순위 숫자를 아래로 들린 카드의 이동 범위 밖까지
 * 밀어내면 카드와 150px 넘게 떨어져 어느 칸의 숫자인지 묶이지 않는다.
 * 아래로 가는 칸이 지나는 0.5초 동안 숫자가 잠시 가려지는 편이 낫다 —
 * 가리는 대상이 다른 카드가 아니라 정적인 참조 숫자이고, 사양서가 검증했다고
 * 밝힌 프로토타입 값(카드 높이 56 / 이동 폭 52)에서도 같은 겹침이 생긴다.
 */
const TITLE_TOP = 250;
const TITLE_H = 88;
/** 행 위쪽에 LIFT + 여백을 확보한 위치 */
const ROW_TOP = TITLE_TOP + TITLE_H + 24 + LIFT;
const RANK_TOP = ROW_TOP + CARD_H + 26;
const CAPTION_TOP = RANK_TOP + 52;

/** 슬롯 인덱스 → 행 내부 x 좌표 */
const slotX = (slot: number): number => slot * (CARD_W + GAP);

interface Move {
  id: string;
  from: number;
  to: number;
  /** true면 아래로, false면 위로 들어올린다 */
  down: boolean;
  /** 이동 시작 시각(초) */
  start: number;
}

/**
 * 체질 A·B 배열을 비교해 이동 계획을 세운다.
 *
 * 4절 규칙을 코드로 옮긴 부분:
 * - 자리가 바뀌는 칸만 움직인다
 * - 가장 멀리 가는 칸을 먼저 (거리 내림차순 정렬, 동률은 원래 순서 유지)
 * - 한 번에 한 칸씩 순차 진행 (start를 move 간격으로 배치)
 */
const planMoves = (
  cells: OrganCell[],
  orderB: string[],
  liftDown: string[],
): Move[] => {
  const slotB = new Map(orderB.map((id, i) => [id, i]));
  return cells
    .map((c, from) => ({ id: c.id, from, to: slotB.get(c.id) ?? from }))
    .filter((m) => m.from !== m.to)
    .sort((a, b) => Math.abs(b.to - b.from) - Math.abs(a.to - a.from))
    .map((m, i) => ({
      ...m,
      down: liftDown.includes(m.id),
      start: T.present + T.cue + i * T.move,
    }));
};

/** 이동 칸 수로 전체 길이(초)를 계산 */
export const organArraySeconds = (moverCount: number): number =>
  T.present + T.cue + moverCount * T.move + T.settle;

/** props 데이터로부터 필요한 프레임 수를 계산 (Sequence durationInFrames용) */
export const organArrayFrames = (
  props: Pick<OrganArrayTransitionProps, 'cells' | 'orderB'>,
  fps = 30,
): number => {
  const slotB = new Map(props.orderB.map((id, i) => [id, i]));
  const movers = props.cells.filter((c, i) => (slotB.get(c.id) ?? i) !== i).length;
  return Math.round(organArraySeconds(movers) * fps);
};

/**
 * OrganArrayTransition — 장기 강약 배열 전환 (섹션 2-a)
 *
 * 한 줄로 늘어선 5칸이 체질 A 배열에서 체질 B 배열로 변형되는 과정을 보여준다.
 * 전달 목표는 "양 끝은 같고 가운데 세 칸이 자리를 바꾼다" 하나뿐이므로,
 * 이동은 순차로만 일어나고 단계별 자막·오행 표기·최강/최약 문구는 넣지 않는다.
 *
 * 색은 EcmOverview 공통 팔레트를 그대로 쓴다 (사양서 5절 — 여기서 색을 새로 정의하지 않음).
 * - 고정 칸(1·5번): COLORS.gold — 양 끝이 같다는 것을 먼저 보여준다
 * - 이동 칸: COLORS.greenBright — 단계1에서 점등되어 끝까지 유지
 * - 기본: COLORS.textDim
 *
 * 다른 편(금·토·수)은 props 데이터만 교체하면 되고 이 파일은 수정하지 않는다.
 */
export const OrganArrayTransition: React.FC<OrganArrayTransitionProps> = ({
  constitutionA,
  constitutionB,
  cells,
  orderB,
  fixedCells,
  liftDown,
  caption,
  source = '출처: 생기능의학 교재(2008) / 「8체질의학론 개요」(2003)',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const moves = planMoves(cells, orderB, liftDown);
  const rowW = CARD_W * cells.length + GAP * (cells.length - 1);
  const rowLeft = (1920 - rowW) / 2;

  /** 마지막 단계 — 표기·체질명이 B로 넘어가는 시점 */
  const finalStart = T.present + T.cue + moves.length * T.move;
  const swap = interpolate(sec, [finalStart, finalStart + T.swap], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* [상단] 체질명 — A에서 B로 크로스페이드 */}
      <div style={{ position: 'absolute', top: TITLE_TOP, left: 0, right: 0, height: TITLE_H }}>
        {[
          { name: constitutionA, opacity: 1 - swap },
          { name: constitutionB, opacity: swap },
        ].map((n) => (
          <div
            key={n.name}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: n.opacity,
              color: COLORS.text,
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 800,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            {n.name}
          </div>
        ))}
      </div>

      {/* [중앙] 5칸 가로 배열 */}
      <div
        style={{
          position: 'absolute',
          left: rowLeft,
          top: ROW_TOP,
          width: rowW,
          height: CARD_H,
        }}
      >
        {cells.map((c, i) => {
          const move = moves.find((m) => m.id === c.id);
          const isFixed = fixedCells.includes(c.id);

          // 위치 — 이동 중인 칸만 x가 움직이고, 그 사이 수직으로 들어올려진다
          let x = slotX(i);
          let y = 0;
          let lifted = 0;
          if (move) {
            if (sec >= move.start + T.move) {
              x = slotX(move.to);
            } else if (sec >= move.start) {
              const r = sec - move.start;
              x = interpolate(r, [T.liftIn, T.slideEnd], [slotX(move.from), slotX(move.to)], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              });
              lifted = interpolate(r, [0, T.liftIn, T.slideEnd, T.move], [0, 1, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              y = (move.down ? 1 : -1) * lifted * LIFT;
            }
          }

          // 테두리 색 — 고정 칸은 처음부터, 이동 칸은 단계1에서 점등
          const litSec = Math.min(Math.max(sec, T.present), T.present + T.cue);
          const border = isFixed
            ? COLORS.gold
            : move
              ? interpolateColors(
                  litSec,
                  [T.present, T.present + T.cue],
                  [COLORS.textDim, COLORS.greenBright],
                )
              : COLORS.textDim;

          // 단계0 등장 — 스태거 페이드 (1.0초 안에서 끝난다)
          const appear = interpolate(sec, [i * 0.06, i * 0.06 + 0.35], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                transform: `translate(${x}px, ${y}px) scale(${0.9 + appear * 0.1})`,
                opacity: appear,
                // 이동 중인 칸을 다른 칸 위에 그린다
                zIndex: lifted > 0 ? 10 : 1,
                backgroundColor: COLORS.bgSoft,
                border: `3px solid ${border}`,
                borderRadius: RADIUS,
                boxShadow:
                  lifted > 0 ? `0 ${12 * lifted}px ${34 * lifted}px rgba(0,0,0,0.55)` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* 표기 전환 — 이동과 별개로 마지막 단계에서만 일어난다 */}
              {[
                { label: c.labelA, opacity: 1 - swap },
                { label: c.labelB, opacity: swap },
              ].map((l, k) => (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    opacity: l.opacity,
                    color: COLORS.text,
                    fontFamily: FONT,
                    fontSize: 40,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {l.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* [하단] 순위 숫자 — 1~5 숫자로만 (최강/최약 문구 없음) */}
      <div
        style={{
          position: 'absolute',
          left: rowLeft,
          top: RANK_TOP,
          width: rowW,
          display: 'flex',
        }}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            style={{
              width: CARD_W,
              marginRight: i === cells.length - 1 ? 0 : GAP,
              textAlign: 'center',
              color: COLORS.textDim,
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* [캡션] 1번 칸 아래 소형 */}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: rowLeft,
            top: CAPTION_TOP,
            width: CARD_W,
            textAlign: 'center',
            // 카드 폭보다 길어도 줄바꿈하지 않고 1번 칸 중심에 걸쳐 놓는다
            whiteSpace: 'nowrap',
            color: COLORS.gold,
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          {caption}
        </div>
      ) : null}

      {/* [출처] 시리즈 공통 출처 자막 컴포넌트 재사용 */}
      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

/**
 * 목양·목음편 데이터 (사양서 2절).
 *
 * 표기 규칙: 체질 A(목양)는 장(臟)이 주도하므로 다섯 칸 모두 장이 앞에,
 * 체질 B(목음)는 부(腑)가 주도하므로 다섯 칸 모두 부가 앞에 온다.
 * 1번·5번 칸은 자리가 고정이어도 표기는 바뀐다 — 이동과 표기 전환은 별개 처리.
 */
export const MOK_ARRAY: OrganArrayTransitionProps = {
  constitutionA: '목양체질',
  constitutionB: '목음체질',
  cells: [
    { id: 'liver', labelA: '간·담낭', labelB: '담낭·간' },
    { id: 'kidney', labelA: '신장·방광', labelB: '방광·신장' },
    { id: 'heart', labelA: '심장·소장', labelB: '소장·심장' },
    { id: 'pancreas', labelA: '췌장·위장', labelB: '위장·췌장' },
    { id: 'lung', labelA: '폐·대장', labelB: '대장·폐' },
  ],
  orderB: ['liver', 'heart', 'pancreas', 'kidney', 'lung'],
  fixedCells: ['liver', 'lung'],
  liftDown: ['kidney'],
  caption: '간·담낭 = 木 → 목(木)체질',
};

/**
 * 검수용 단독 프리뷰 (스튜디오 사이드바 확인용).
 *
 * 본 컴포넌트는 배경을 칠하지 않으므로 — 섹션 화면 안에 얹히는 요소이기 때문 —
 * 여기서만 공통 배경색을 깔아준다.
 */
export const OrganArrayPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <OrganArrayTransition {...MOK_ARRAY} />
  </AbsoluteFill>
);
