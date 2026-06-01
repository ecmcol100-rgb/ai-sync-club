import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';
import { TopBar } from '../components/TopBar';
import { FadeText } from '../components/FadeText';

/** 장면1 — 오프닝 (레팬2, 10초) */
export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 아바타 스프링 등장
  const avatarScale = spring({ frame, fps, config: { damping: 11, stiffness: 55, mass: 1 }, from: 0.7, to: 1 });
  const avatarOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 타이틀 카드 배경 expand
  const cardWidth = interpolate(frame, [18, 48], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
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
          src={staticFile('레팬2.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
        />
      </AbsoluteFill>

      {/* 하단 타이틀 */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: `${cardWidth}%`,
            backgroundColor: 'rgba(27, 67, 50, 0.92)',
            borderRadius: 18,
            padding: '26px 0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <FadeText delay={24} duration={18}>
            <div style={{ color: COLORS.white, fontSize: 46, fontFamily: FONT, fontWeight: 700, textAlign: 'center', lineHeight: 1.45 }}>
              수체질에게 좋다는 인삼·홍삼,
            </div>
          </FadeText>
          <FadeText delay={34} duration={18}>
            <div style={{ color: '#A8DFCA', fontSize: 46, fontFamily: FONT, fontWeight: 700, textAlign: 'center', lineHeight: 1.45 }}>
              매일 먹어도 괜찮을까요?
            </div>
          </FadeText>
        </div>

        <FadeText delay={50} duration={16}>
          <div
            style={{
              backgroundColor: 'rgba(250,250,245,0.88)',
              borderRadius: 8,
              padding: '8px 32px',
              color: COLORS.darkGreen,
              fontSize: 26,
              fontFamily: FONT,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            8체질의학회
          </div>
        </FadeText>
      </div>
    </AbsoluteFill>
  );
};
