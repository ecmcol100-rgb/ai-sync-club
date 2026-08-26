import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';

/**
 * 섹션0 — 타이틀 (v3 신설, 약 5초)
 * "8체질의학이란 무엇인가?" 타이포그래피. 배경 톤은 섹션1과 연결.
 */
export const Section00: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 타이틀 등장
  const titleScale = spring({ frame, fps, config: { damping: 18, stiffness: 70 }, from: 0.9, to: 1 });
  const titleOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 밑줄 확장
  const lineWidth = interpolate(frame, [20, 44], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subOpacity = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 끝부분 페이드아웃(섹션1로 전환)
  const outOpacity = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: outOpacity,
      }}
    >
      {/* 배경 은은한 방사형 광 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 42%, rgba(45,106,79,0.35) 0%, rgba(14,26,22,0) 55%)',
        }}
      />

      <div style={{ textAlign: 'center', transform: `scale(${titleScale})` }}>
        <div
          style={{
            color: COLORS.greenPale,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 8,
            opacity: titleOpacity,
            marginBottom: 24,
          }}
        >
          8체질의학회
        </div>
        <div
          style={{
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: titleOpacity,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          8체질의학이란 <span style={{ color: COLORS.gold }}>무엇인가?</span>
        </div>

        {/* 밑줄 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <div style={{ width: `${lineWidth}%`, maxWidth: 620, height: 5, backgroundColor: COLORS.gold, borderRadius: 3 }} />
        </div>

        <div
          style={{
            marginTop: 28,
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 500,
            opacity: subOpacity,
          }}
        >
          5분 만에 이해하는 핵심 원리
        </div>
      </div>
    </AbsoluteFill>
  );
};
