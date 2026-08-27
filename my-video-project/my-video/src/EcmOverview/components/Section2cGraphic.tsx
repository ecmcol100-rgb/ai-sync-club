import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONTENT_MAX_Y, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';

export interface Section2cProps {
  /** 단계 1~3의 시작 시각(초). 오디오 확보 후 이 값만 조정 */
  stageStartsSec?: [number, number, number];
  /**
   * 속 체온이 겉보다 높은 체질(목양·목음)이면 true — 온수가 맞는 방법.
   * 수편 재활용 시 false로 뒤집으면 온·냉 색과 도식 방향이 교체된다
   * (사양서 C-3 — 재활용 계획 등재).
   */
  coreIsWarm?: boolean;
  /** 상단 헤드라인 */
  headline?: string;
  /** 권장 흐름 3단계 문구 */
  flowSteps?: [string, string, string];
  /** 맞지 않는 방법 표기 */
  avoidTitle?: string;
  source?: string;
}

const useStageIn = (frame: number, fps: number, startSec: number): number =>
  interpolate(frame, [startSec * fps, startSec * fps + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * Section2c — 온수욕·부교감신경 그래픽 (목양·목음편 섹션 2)
 *
 * 1) 속·겉 체온 차이: 단순 흉상 실루엣(개괄편 Section03 CSS 흉상 선례 —
 *    원 + 패스, 해부 도해 아님) 안에 동심원 — 안쪽이 더 따뜻함
 * 2) 따뜻한 물 → 땀 → 몸이 가벼워짐 흐름
 * 3) 냉수욕·수영 — "이 체질에는 맞지 않음" 대비 패널.
 *    부정 낙인 금지: X 표시 없이 중립 표현 + "다른 체질에는 맞는 방법일
 *    수 있습니다" 부기 (사양서 C-3)
 *
 * 온·냉 색은 공통 팔레트의 gold(온)·blue(냉)만 쓰고, coreIsWarm 하나로
 * 좋은 쪽/맞지 않는 쪽의 색·문구가 함께 뒤집힌다 — 수편 재활용 구조.
 * 발자국은 CONTENT_MAX_Y(686) 안 (흉상 하단 640, 패널 하단 560).
 */
export const Section2cGraphic: React.FC<Section2cProps> = ({
  stageStartsSec = [0, 3, 6],
  coreIsWarm = true,
  headline = '부교감신경 긴장체질 — 속이 겉보다 따뜻합니다',
  flowSteps = ['따뜻한 물', '땀', '몸이 가벼워짐'],
  avoidTitle = '냉수욕 · 수영',
  source = '출처: 빛과소금 94-10월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3] = stageStartsSec;

  const in1 = useStageIn(frame, fps, s1);
  const in2 = useStageIn(frame, fps, s2);
  const in3 = useStageIn(frame, fps, s3);

  // 온=gold, 냉=blue (공통 팔레트). coreIsWarm이 뒤집히면 함께 뒤집힌다
  const warm = COLORS.gold;
  const cool = COLORS.blue;
  const coreColor = coreIsWarm ? warm : cool;
  const skinColor = coreIsWarm ? cool : warm;
  const goodColor = coreColor;
  const avoidColor = skinColor;

  return (
    <>
      {/* 헤드라인 */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: in1,
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 800,
        }}
      >
        {headline}
      </div>

      {/* 단계1 — 흉상 실루엣 + 동심원 (속이 더 따뜻함).
          흉상(top 200 + svg 440 + 라벨 ≈ 하단 686 직전)이 이 화면의 최하단 요소 —
          CONTENT_MAX_Y 안에서 끝나는지 아래 top/높이로 관리한다 */}
      <div style={{ position: 'absolute', left: 250, top: CONTENT_MAX_Y - 496, opacity: in1 }}>
        <svg width="360" height="440" viewBox="0 0 360 440">
          {/* 흉상 — 원 + 패스 (Section03 선례와 같은 단순화 수준) */}
          <circle cx="180" cy="80" r="54" fill={COLORS.textDim} opacity="0.35" />
          <path
            d="M40 440 C40 260 110 230 180 230 C250 230 320 260 320 440 Z"
            fill={COLORS.textDim}
            opacity="0.35"
          />
          {/* 몸통 동심원 — 안쪽일수록 속 색 */}
          <ellipse cx="180" cy="360" rx="110" ry="88" fill={skinColor} opacity="0.3" />
          <ellipse cx="180" cy="360" rx="74" ry="58" fill={coreColor} opacity="0.45" />
          <ellipse cx="180" cy="360" rx="40" ry="30" fill={coreColor} opacity="0.85" />
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 26,
            marginTop: 10,
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <span style={{ color: coreColor }}>● 속 — 더 {coreIsWarm ? '따뜻함' : '서늘함'}</span>
          <span style={{ color: skinColor, opacity: 0.85 }}>● 겉</span>
        </div>
      </div>

      {/* 단계2 — 권장 흐름 */}
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 250,
          width: 420,
          opacity: in2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {flowSteps.map((step, i) => (
          <div
            key={i}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            {i > 0 ? (
              <div style={{ color: goodColor, fontFamily: FONT, fontSize: 34, fontWeight: 800 }}>↓</div>
            ) : null}
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `2px solid ${goodColor}`,
                borderRadius: 12,
                padding: '16px 20px',
                color: COLORS.text,
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 700,
                boxSizing: 'border-box',
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* 단계3 — 맞지 않는 방법 (중립 표현, X 없음) */}
      <div
        style={{
          position: 'absolute',
          left: 1330,
          top: 290,
          width: 420,
          opacity: in3,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: `3px solid ${avoidColor}`,
          borderRadius: 20,
          padding: '34px 36px',
        }}
      >
        <div style={{ color: avoidColor, fontFamily: FONT, fontSize: 40, fontWeight: 900 }}>
          {avoidTitle}
        </div>
        <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 30, fontWeight: 700, marginTop: 14 }}>
          이 체질에는 맞지 않습니다
        </div>
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 24, fontWeight: 500, marginTop: 10 }}>
          다른 체질에는 맞는 방법일 수 있습니다
        </div>
      </div>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

export const SECTION2C_PREVIEW_FRAMES = 10 * 30;

/** 검수용 단독 프리뷰 (목양·목음편 기본값) */
export const Section2cPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Section2cGraphic />
  </AbsoluteFill>
);
