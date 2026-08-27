import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, CONTENT_MAX_Y, FONT } from '../constants';
import { ItemLabel } from './ItemLabel';
import { SafetyCaption } from './SafetyCaption';
import { SourceCaptions } from './SourceCaptions';

export interface PanelPoint {
  /** 설명 한 줄 */
  text: string;
  /** 강조 어구 — 화면당 하나 이하 (사양서 2절) */
  emphasis?: boolean;
  /** 부기 — 유보·조건 문장 전용. 본문보다 작고 낮은 대비 */
  note?: string;
  /**
   * 근거 등급 태그 (예: '추정') — 4-e 운동선수처럼 본문 자막 서식에
   * 태그를 병기해야 할 때. 사양서 5절 "별도 처리 수단" 요구의 구현.
   * 중립 칩으로 그린다 — 부정 기호 아님
   */
  tag?: string;
}

export interface ItemPanelProps {
  /** 화면 식별용 — 라벨 자체는 상위에서 ItemLabel로 그린다 (사양서 3절) */
  itemLabel: string;
  /** 이 항목의 한 줄 요약. 없으면 생략 */
  headline?: string;
  /** 2~4개 권장 (최대 6개까지 수용) */
  points: PanelPoint[];
  /** 체질색 (CONSTITUTION_ACCENTS) */
  accentColor: string;
  /** 각 point 등장 시각(초). 미지정 시 intervalSec 간격 균등 분배 */
  stageStartsSec?: number[];
  /** stageStartsSec 미지정 시 포인트 간 간격(초) */
  intervalSec?: number;
  /** 화면 출처 자막 — 편 조립 시 컷별 출처 문구 주입 */
  source?: string;
  /**
   * 글자 크기 단계(1~3, 1이 가장 큼). 생략 시 내용량에 맞춰 자동 선택.
   * ★ 섹션 3·4의 같은 항목 쌍은 반드시 같은 단계를 명시할 것 — 쌍의
   * 내용량이 달라 자동 선택이 갈리면 대칭(같은 글자 크기)이 깨진다.
   */
  sizeTier?: 1 | 2 | 3;
}

/**
 * 글자 크기 단계 — 본문 영역(y 150~686)을 채우는 것이 목표.
 * note는 point의 약 0.75배, 행 간격은 발자국 한계 안에서 최대로 잡은 값.
 * 하한 검증: 최소 단계(50px)도 ComparisonTable 셀(24px)·Section2b 칩(32px)보다 크다.
 * 단계가 내려가는 건 포인트가 많은 화면(4-f 6개 등)이 y<686에 들어가기 위함.
 */
const SIZE_TIERS = [
  { point: 58, emphasis: 66, gap: 30, note: 44 },
  { point: 54, emphasis: 60, gap: 17, note: 40 },
  { point: 50, emphasis: 56, gap: 16, note: 38 },
] as const;

type SizeTier = (typeof SIZE_TIERS)[number];

/** 단일 행 가정(데이터가 한 줄 문장 위주) 아래 포인트 블록 높이 추정 */
const estimateHeight = (points: PanelPoint[], t: SizeTier): number =>
  points.reduce(
    (acc, p) => acc + (p.emphasis ? t.emphasis : t.point) * 1.35 + (p.note ? t.note * 1.4 + 8 : 0),
    0,
  ) +
  (points.length - 1) * t.gap;

/**
 * ItemPanel — 항목별 설명 화면 공통 템플릿 (섹션 3·4 × 5화면 = 10화면)
 *
 * 시리즈 전체의 항목 화면을 이 하나로 처리한다 (사양서 1절).
 * 섹션 3·4의 대칭이 이 편의 뼈대이므로 레이아웃·글자 크기·등장 방식은
 * 컴포넌트에 고정돼 있고, 화면마다 달라지는 것은 색(accentColor)과
 * 내용(points)뿐이다.
 *
 * - 항목 라벨은 그리지 않는다 — 상위에서 ItemLabel을 함께 배치 (사양서 3절)
 * - 포인트는 순차 등장 후 사라지지 않는다. 등장은 짧은 페이드+미세 상승 —
 *   10번 반복되는 화면이므로 화려한 연출 금지
 * - 강조는 크기·체질색으로만 한다. X·경고 아이콘 등 부정 기호 없음 —
 *   안전 경고는 SafetyCaption 담당 (사양서 4절)
 * - 발자국 y < CONTENT_MAX_Y(686) — 안전 자막 슬롯과 겹치지 않는다
 * - 길이는 stageStartsSec/intervalSec로 외부 제어. 내부 타임코드 없음
 */
export const ItemPanel: React.FC<ItemPanelProps> = ({
  headline,
  points,
  accentColor,
  stageStartsSec,
  intervalSec = 1.2,
  source,
  sizeTier,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // headline(96px)이 y 150~285를 쓰므로 포인트는 300부터. 없으면 170부터
  const pointsTop = headline ? 300 : 170;
  const avail = CONTENT_MAX_Y - 8 - pointsTop;
  const tier =
    (sizeTier ? SIZE_TIERS[sizeTier - 1] : undefined) ??
    SIZE_TIERS.find((t) => estimateHeight(points, t) <= avail) ??
    SIZE_TIERS[SIZE_TIERS.length - 1];

  return (
    <>
      {headline ? (
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 150,
            opacity: headIn,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 800,
          }}
        >
          {headline}
          <div
            style={{
              width: 130,
              height: 6,
              marginTop: 14,
              borderRadius: 3,
              backgroundColor: accentColor,
              transform: `scaleX(${headIn})`,
              transformOrigin: 'left',
            }}
          />
        </div>
      ) : null}

      {/* 포인트 블록 — 띠(top ~ CONTENT_MAX_Y) 안에서 세로 중앙 정렬.
          포인트가 적은 화면(외형 등)은 여백이 위아래로 나뉘어 안정감이 생기고,
          꽉 찬 화면(3-d 등)은 사실상 상단 정렬과 같다.
          항목 라벨(top 84)과 headline(top 150)은 고정 — 움직이는 것은 이 블록뿐 */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: pointsTop,
          width: 1600,
          // 발자국 한계 — 포인트 6개 + note까지 이 띠 안에서 끝난다
          height: avail,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: tier.gap,
        }}
      >
        {points.map((p, i) => {
          const start = stageStartsSec?.[i] ?? 0.4 + i * intervalSec;
          const startFrame = start * fps;
          const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const rise = (1 - opacity) * 14;

          return (
            <div key={i} style={{ opacity, transform: `translateY(${rise}px)` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    // 강조는 시리즈 강조 관례색(gold) — 확정 체질색 중 하양(목양)은
                    // 본문 텍스트와 구분되지 않아 강조색으로 쓸 수 없다
                    backgroundColor: p.emphasis ? COLORS.gold : COLORS.textDim,
                    flexShrink: 0,
                    alignSelf: 'center',
                  }}
                />
                <span
                  style={{
                    color: p.emphasis ? COLORS.gold : COLORS.text,
                    fontFamily: FONT,
                    fontSize: p.emphasis ? tier.emphasis : tier.point,
                    fontWeight: p.emphasis ? 800 : 600,
                    lineHeight: 1.35,
                  }}
                >
                  {p.text}
                </span>
                {p.tag ? (
                  <span
                    style={{
                      alignSelf: 'center',
                      border: `2px solid ${COLORS.textDim}`,
                      borderRadius: 8,
                      padding: '4px 16px',
                      color: COLORS.textDim,
                      fontFamily: FONT,
                      fontSize: 30,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {p.tag}
                  </span>
                ) : null}
              </div>
              {p.note ? (
                <div
                  style={{
                    marginLeft: 40,
                    marginTop: 8,
                    color: COLORS.textDim,
                    fontFamily: FONT,
                    fontSize: tier.note,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {p.note}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {source ? <SourceCaptions cues={[{ fromSec: 0, text: source }]} /> : null}
    </>
  );
};

/**
 * 목양·목음편 10화면 데이터 (사양서 5절).
 *
 * emphasis는 화면당 하나 이하 — 4-f는 사양서 표에 강조 후보가 둘
 * (근제통 / 하복부 보온)이라 규칙에 따라 결론인 건강법(하복부 보온)에만
 * 강조를 두고, 근제통은 한자 병기 텍스트로 처리했다.
 * 3-f 혈압 문단·4-d 알코올 문단은 별도 처리 대상이라 넣지 않는다 (사양서 7절).
 */
export const MOK_PANELS: Record<string, ItemPanelProps> = {
  '3b': {
    itemLabel: '외형',
    sizeTier: 1,
    accentColor: CONSTITUTION_ACCENTS.목양,
    points: [
      { text: '풍채가 좋고 체구가 큰 편' },
      { text: '어깨는 좁고 아래로 내려가면서 굵어짐' },
      { text: '눈사람처럼 허리가 넓어지는 체형', emphasis: true },
    ],
  },
  '3c': {
    itemLabel: '성격',
    sizeTier: 2,
    headline: '말수가 적습니다',
    accentColor: CONSTITUTION_ACCENTS.목양,
    points: [
      { text: '열 마디에 한두 마디로 답함' },
      { text: '말하는 것이 에너지를 소모하고 피로를 유발' },
      { text: '숨이 짧아 노래 한 소절을 넘기기 어려움' },
      { text: '인자하고 쉽게 용서함, 따지기 싫어함' },
    ],
  },
  '3d': {
    itemLabel: '직업',
    sizeTier: 2,
    accentColor: CONSTITUTION_ACCENTS.목양,
    points: [
      { text: '툭 터진 넓은 곳, 투기적, 적응적' },
      { text: '독자 사업이 많고 크게 벌여 성공' },
      { text: '투자 사업 · 기계공학 · 선린주의 정치가' },
      { text: '세밀한 계산 · 말 많은 일 · 예술적인 일은 재고' },
      {
        text: '과묵함이 덕으로 보여 선거 당선율이 높음',
        note: '보편적 경향일 뿐 개인의 환경·학문·여건에 따라 예외가 있음',
      },
    ],
  },
  '3e': {
    itemLabel: '운동',
    sizeTier: 2,
    headline: '땀을 내는 운동이 맞습니다',
    accentColor: CONSTITUTION_ACCENTS.목양,
    points: [{ text: '등산' }, { text: '사우나' }],
  },
  '3f': {
    itemLabel: '질병·건강법',
    sizeTier: 3,
    accentColor: CONSTITUTION_ACCENTS.목양,
    points: [
      { text: '건강할 때 땀이 많고, 땀을 흘리면 몸이 가벼워짐' },
      { text: '과해진 간의 열이 땀으로 풀림' },
      { text: '계절과 상관없이 따뜻한 물로 목욕', emphasis: true },
      { text: '채소·생선 과다, 육식 부족 시 피로 · 눈 통증 · 발 답답함' },
    ],
  },
  '4b': {
    itemLabel: '외형',
    sizeTier: 1,
    accentColor: CONSTITUTION_ACCENTS.목음,
    points: [{ text: '팔다리가 길고 손발이 큼' }, { text: '근육이 잘 발달' }],
  },
  '4c': {
    itemLabel: '성격',
    sizeTier: 2,
    headline: '감성적입니다',
    accentColor: CONSTITUTION_ACCENTS.목음,
    points: [
      { text: '조그마한 말에도 쉽게 상처받고 잘 잊히지 않음' },
      { text: '성질은 급하나 독하지 못함' },
      { text: '활동적이고 봉사적' },
    ],
  },
  '4d': {
    itemLabel: '직업',
    sizeTier: 2,
    accentColor: CONSTITUTION_ACCENTS.목음,
    points: [
      { text: '감수성을 함께 고려' },
      { text: '감정 대립 · 질투 · 비판이 잦은 일은 부담' },
      { text: '술과 거리가 있는 일' },
      { text: '교육계 · 기계공학' },
      {
        text: '나무와 불을 다루는 일만 빼면 무엇이든',
        emphasis: true,
        note: '경향성일 뿐 같은 체질 안에서도 예외가 있음',
      },
    ],
  },
  '4e': {
    itemLabel: '운동',
    sizeTier: 2,
    headline: '이 체질의 특징이 가장 선명하게 드러납니다',
    accentColor: CONSTITUTION_ACCENTS.목음,
    points: [
      { text: '손으로 던지고 발로 차는 운동에 능함' },
      { text: '오 년 늦게 시작해도 앞지름', emphasis: true },
      { text: '공이 생각한 지점에 그대로 감' },
      { text: '박세리 · 박찬호 · 이승엽', tag: '추정' },
    ],
  },
  '4f': {
    itemLabel: '질병·건강법',
    sizeTier: 3,
    accentColor: CONSTITUTION_ACCENTS.목음,
    points: [
      { text: '대변이 잦은 것 자체는 건강과 무관' },
      { text: '배꼽 주위 통증이 함께 오면 근제통(近臍痛)' },
      { text: '소화에 지장 없이 하루 몇 번 배변, 항상 배꼽 주위 통증' },
      { text: '허약해지면 몸이 냉하고 다리가 무겁고 불면' },
      { text: '원인은 대장의 무력함' },
      { text: '하복부 보온, 그리고 절주', emphasis: true },
    ],
  },
};

export const ITEM_PANEL_PREVIEW_FRAMES = 8 * 30;

/** 프리뷰 반쪽 — 실제 1920×1080 화면(라벨+패널+disclaimer)을 0.5배로 축소 */
const Half: React.FC<{ x: number; panelKey: string }> = ({ x, panelKey }) => {
  const panel = MOK_PANELS[panelKey];
  return (
    <div style={{ position: 'absolute', left: x, top: 270, width: 960, height: 540, overflow: 'hidden' }}>
      <div
        style={{
          position: 'relative',
          width: 1920,
          height: 1080,
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
          backgroundColor: COLORS.bg,
          outline: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <ItemLabel label={panel.itemLabel} accentColor={panel.accentColor} />
        <ItemPanel {...panel} />
        <SafetyCaption
          kind="disclaimer"
          text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
        />
      </div>
    </div>
  );
};

/**
 * 검수용 프리뷰 — 3-c(목양 성격)와 4-c(목음 성격)를 나란히 놓아
 * 레이아웃·글자 크기·등장 방식의 대칭(색·내용만 다름)을 한눈에 확인한다.
 */
export const ItemPanelPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Half x={0} panelKey="3c" />
    <Half x={960} panelKey="4c" />
  </AbsoluteFill>
);
