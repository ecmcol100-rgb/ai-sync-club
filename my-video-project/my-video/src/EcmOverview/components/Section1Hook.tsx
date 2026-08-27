import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, CONTENT_MAX_Y, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';

export interface Section1HookProps {
  /**
   * 단계 시작 시각(초) — 길이 하드코딩 금지, 오디오 확보 후 조정.
   * [0] 통념 제시 / [1] 사례① / [2] 사례②(카운트업) / [3] 두 사례 모임+체질명
   * / [4] 1-b 항목 예고 시작
   */
  stageStartsSec?: [number, number, number, number, number];
  /** 1-b 항목별 등장 시각(초). 생략 시 1-b 시작부터 itemIntervalSec 간격 */
  itemStartsSec?: number[];
  /** itemStartsSec 생략 시 항목 간 간격(초) — 내레이션 쉼표 간격에 맞춰 조정 */
  itemIntervalSec?: number;
  /** 카운트업 세부 타이밍(초) — 사례② 단계 시작 기준 */
  countup?: { leadSec: number; riseSec: number; holdSec: number; fallSec: number };
  /** 통념 문구 */
  notion?: string;
  /** 사례① 진행 문구 3줄 */
  case1Lines?: [string, string, string];
  /** 카운트업 수치 (시작 표기 / 시작값 / 정점값) */
  countFrom?: { display: string; value: number };
  countPeak?: number;
  /** 카운트업 화살표 구간 라벨 */
  riseLabel?: string;
  fallLabel?: string;
  /** 두 사례가 모이는 체질명 */
  constitution?: string;
  /** 1-b 예고 항목 (유명인 제외 8개 — 명칭은 챕터·항목 라벨과 통일) */
  items?: string[];
  source?: string;
}

const stageIn = (frame: number, fps: number, startSec: number, len = 12): number =>
  interpolate(frame, [startSec * fps, startSec * fps + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * Section1Hook — 섹션 1 후킹: 채식의 역설 (1-a) + 항목 예고 (1-b)
 *
 * 첫 10초 이탈 방어 구간. 1-a는 극적으로(숫자가 주인공), 1-b는 정돈되게 —
 * 두 구간의 연출 톤을 다르게 간다 (사양서 1절).
 *
 * 사양서 6절 판단 — 채식 이미지 표현:
 * 타이포그래피만으로 간다. 통념 제시(단계1)는 유지하되 큰 타이포 한 문장으로
 * 처리하고, 아이콘 에셋은 만들지 않는다. 근거: 시리즈가 사진·인물 금지 아래
 * 타이포 언어(PersonTypoCard 등)를 이미 확립했고, 이 구간의 주인공은 어차피
 * 수치 카운트업이다. 채소·고기 도형 아이콘은 채식·육식을 대상화해 선악
 * 구도로 읽힐 위험도 있다. 밋밋함은 단계1 문장을 크게 세웠다가 사례 등장과
 * 함께 어둡게 물러나게 하는 명암 대비로 보완한다.
 *
 * 1-a 주의(사양서 2절): 채식을 부정적으로 그리지 않는다 — 상승 구간
 * 라벨·화살표는 중립색이고, 경보는 수치(gold)가 담당한다. 회복된 400은
 * greenBright. 직업·신분 표기 없음("환자분"), 효과 단정 표현 없음.
 *
 * 1-b: 등장한 항목은 사라지지 않고 마지막에 8개 전체가 남는다.
 * 아이콘 없이 ItemLabel과 같은 시각 언어(색 세로 바 + 텍스트)라
 * 이후 아이콘이 생기면 양쪽에서 함께 쓰면 된다.
 *
 * 발자국 y < CONTENT_MAX_Y(686). disclaimer는 이 구간에 아직 없다.
 */
export const Section1Hook: React.FC<Section1HookProps> = ({
  stageStartsSec = [0, 3, 7, 13, 17],
  itemStartsSec,
  itemIntervalSec = 0.9,
  countup = { leadSec: 0.6, riseSec: 1.3, holdSec: 1.0, fallSec: 1.8 },
  notion = '채식은 몸에 좋다 —',
  case1Lines = ['일 년의 채식', '극심한 피로', '육식 복귀 후 회복'],
  countFrom = { display: '400+', value: 400 },
  countPeak = 1700,
  riseLabel = '한 달 채식',
  fallLabel = '한 달 육식',
  constitution = '목양체질',
  items = ['장기 배열', '외형', '성격', '직업', '운동', '질병', '음식', '건강법'],
  source = '출처: 빛과소금 94-5월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3, s4, s5] = stageStartsSec;
  const sec = frame / fps;

  const accent =
    CONSTITUTION_ACCENTS[constitution.slice(0, 2) as keyof typeof CONSTITUTION_ACCENTS] ??
    COLORS.greenBright;

  const in1 = stageIn(frame, fps, s1);
  const in2 = stageIn(frame, fps, s2);
  const in3 = stageIn(frame, fps, s3);
  const in4 = stageIn(frame, fps, s4);

  // 1-b 진입 시 1-a 전체가 0.5초에 걸쳐 물러난다 (톤 전환: 극적 → 정돈)
  const aOut = interpolate(frame, [s5 * fps, s5 * fps + 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── 카운트업 (사례② 내부) ─────────────────────────────────────────
  const riseStart = s3 + countup.leadSec;
  const riseEnd = riseStart + countup.riseSec;
  const fallStart = riseEnd + countup.holdSec; // 정점 유지 ≥0.8초 (기본 1.0)
  const fallEnd = fallStart + countup.fallSec;

  // 상승: 감속 곡선(목표 근처에서 느려짐) — 놀라움. 하강은 더 길고 완만 — 회복
  const riseValue = interpolate(sec, [riseStart, riseEnd], [countFrom.value, countPeak], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const fallValue = interpolate(sec, [fallStart, fallEnd], [countPeak, countFrom.value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // 정점 도달 순간 펄스
  const peakPulse = interpolate(sec, [riseEnd, riseEnd + 0.25, riseEnd + 0.5], [1, 1.12, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fmt = (v: number): string => Math.round(v).toLocaleString('en-US');

  const NumSlot: React.FC<{
    text: string;
    color: string;
    opacity: number;
    scale?: number;
    dim?: boolean;
  }> = ({ text, color, opacity, scale = 1, dim }) => (
    <div
      style={{
        opacity: opacity * (dim ? 0.55 : 1),
        transform: `scale(${scale})`,
        color,
        fontFamily: FONT,
        fontSize: 76,
        fontWeight: 900,
        fontVariantNumeric: 'tabular-nums',
        minWidth: 210,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );

  const FlowArrow: React.FC<{ label: string; opacity: number }> = ({ label, opacity }) => (
    <div style={{ opacity, textAlign: 'center', width: 170 }}>
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 24, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 40, fontWeight: 700 }}>→</div>
    </div>
  );

  const riseArrowIn = stageIn(frame, fps, riseStart, 8);
  const fallArrowIn = stageIn(frame, fps, fallStart, 8);
  const risen = sec >= riseStart;
  const fallen = sec >= fallStart;

  return (
    <>
      {/* ── 1-a ─────────────────────────────────────────────────────── */}
      <div style={{ opacity: aOut }}>
        {/* 단계1 — 통념 제시. 사례 등장 후에도 남되 어둡게 물러난다 */}
        <div
          style={{
            position: 'absolute',
            top: 128,
            left: 0,
            right: 0,
            textAlign: 'center',
            // 사례 등장 후 어둡게 물러나고, 단계4에서 체질명에게 자리를 내준다
            opacity: in1 * (in2 > 0 ? 0.45 : 1) * (1 - in4),
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 62,
            fontWeight: 800,
          }}
        >
          {notion}
        </div>

        {/* 단계2 — 사례① (전폭 카드 — 진행 문구가 한 줄로 흐른다).
            단계4(체질명 등장)부터 저채도·저투명으로 후퇴 — 위치·크기는 유지,
            내용은 읽히는 수준(투명 60%·채도 45%)까지만 낮춘다 */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 280,
            width: 1600,
            opacity: in2 * (1 - 0.4 * in4),
            filter: `saturate(${1 - 0.55 * in4})`,
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '3px solid rgba(255,255,255,0.16)',
            borderRadius: 20,
            padding: '30px 40px',
          }}
        >
          <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700 }}>
            어느 환자분 ①
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {case1Lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {i > 0 ? (
                  <span style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 34, fontWeight: 700 }}>
                    →
                  </span>
                ) : null}
                <span style={{ color: COLORS.text, fontFamily: FONT, fontSize: 34, fontWeight: 700 }}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 단계3 — 사례② 수치 카운트업 (이 구간의 핵심).
            사례①과 같은 방식으로 단계4부터 후퇴한다 */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 470,
            width: 1600,
            opacity: in3 * (1 - 0.4 * in4),
            filter: `saturate(${1 - 0.55 * in4})`,
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '3px solid rgba(255,255,255,0.16)',
            borderRadius: 20,
            padding: '24px 40px 20px',
          }}
        >
          <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700 }}>
            어느 환자분 ② — 콜레스테롤 수치
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 30,
              marginTop: 6,
            }}
          >
            <NumSlot text={countFrom.display} color={COLORS.text} opacity={1} dim={risen} />
            <FlowArrow label={riseLabel} opacity={riseArrowIn} />
            <NumSlot
              text={risen ? fmt(riseValue) : ''}
              color={COLORS.gold}
              opacity={riseArrowIn}
              scale={peakPulse}
              dim={fallen}
            />
            <FlowArrow label={fallLabel} opacity={fallArrowIn} />
            <NumSlot text={fallen ? fmt(fallValue) : ''} color={COLORS.greenBright} opacity={fallArrowIn} />
          </div>
        </div>

        {/* 단계4 — 두 사례가 같은 체질로 모인다.
            통념 문구가 물러난 상단 자리에 결론(체질명)이 선다 */}
        <div
          style={{
            position: 'absolute',
            top: 88,
            left: 0,
            right: 0,
            opacity: in4,
            textAlign: 'center',
          }}
        >
          <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 32, fontWeight: 600 }}>
            두 사람은 같은 체질
          </div>
          {/* 본문 연출 내 언급 — 칩은 제목급 4곳 한정. 확정 색 글자(목양=하양) */}
          <div
            style={{
              marginTop: 10,
              display: 'inline-block',
              color: accent,
              fontFamily: FONT,
              fontSize: 84,
              fontWeight: 900,
              transform: `scale(${0.8 + spring({ frame: frame - Math.round(s4 * fps), fps, config: { damping: 13, stiffness: 110 }, from: 0, to: 0.2 })})`,
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {constitution}
          </div>
        </div>
      </div>

      {/* ── 1-b 항목 예고 — 정돈된 톤, 등장한 항목은 남는다 ───────────── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 250,
          height: CONTENT_MAX_Y - 250 - 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 360px)',
            gap: 26,
          }}
        >
          {items.map((item, i) => {
            const start = itemStartsSec?.[i] ?? s5 + 0.4 + i * itemIntervalSec;
            const itemIn = stageIn(frame, fps, start, 10);
            const rise = (1 - itemIn) * 18;
            return (
              <div
                key={item}
                style={{
                  opacity: itemIn,
                  transform: `translateY(${rise}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(255,255,255,0.14)',
                  borderRadius: 12,
                  padding: '20px 24px',
                }}
              >
                {/* ItemLabel과 같은 시각 언어 — 색 세로 바 + 텍스트 */}
                <div style={{ width: 7, height: 36, borderRadius: 4, backgroundColor: accent }} />
                <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 32, fontWeight: 700 }}>
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

export const SECTION1_HOOK_PREVIEW_FRAMES = 26 * 30;

/** 검수용 단독 프리뷰 (목양·목음편 기본값) */
export const Section1HookPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Section1Hook />
  </AbsoluteFill>
);
