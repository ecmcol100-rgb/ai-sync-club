import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';
import { TopBar } from '../components/TopBar';
import { FadeText } from '../components/FadeText';

/** 장면16 — 엔딩 (레팬1, 10초) */
export const Scene16: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 아바타 스프링 등장
  const avatarScale = spring({ frame, fps, config: { damping: 11, stiffness: 55, mass: 1 }, from: 0.8, to: 1 });
  const avatarOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 페이드아웃 (마지막 30프레임)
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.ease,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      <TopBar />

      {/* 아바타 전체 화면 */}
      <AbsoluteFill
        style={{
          top: 60,
          transform: `scale(${avatarScale})`,
          transformOrigin: 'bottom center',
          opacity: avatarOpacity,
        }}
      >
        <Img
          src={staticFile('레팬1.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
        />
      </AbsoluteFill>

      {/* 하단 그라디언트 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(250,250,245,0.97) 22%, rgba(250,250,245,0.4) 50%, transparent)',
        }}
      />

      {/* 엔딩 텍스트 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          zIndex: 10,
        }}
      >
        <FadeText delay={14} duration={18}>
          <div
            style={{
              fontSize: 36,
              color: COLORS.darkGreen,
              fontFamily: FONT,
              fontWeight: 900,
              letterSpacing: 4,
            }}
          >
            8체질의학회
          </div>
        </FadeText>

        <FadeText delay={28} duration={18}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: COLORS.topBar,
                borderRadius: 50,
                padding: '12px 28px',
                color: COLORS.white,
                fontSize: 22,
                fontFamily: FONT,
                fontWeight: 700,
              }}
            >
              구독 🔔
            </div>
            <div
              style={{
                backgroundColor: COLORS.red,
                borderRadius: 50,
                padding: '12px 28px',
                color: COLORS.white,
                fontSize: 22,
                fontFamily: FONT,
                fontWeight: 700,
              }}
            >
              좋아요 👍
            </div>
          </div>
        </FadeText>
      </div>
    </AbsoluteFill>
  );
};
