import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { FullLayout } from '../components/FullLayout';
import { FadeText } from '../components/FadeText';

/** 장면9 — 진짜 핵심 (레팬4, 15초) */
export const Scene09: React.FC = () => {
  const frame = useCurrentFrame();

  // 강조 텍스트 흔들기
  const shakeX = frame > 35
    ? interpolate(Math.sin(frame * 0.65), [-1, 1], [-5, 5])
    : 0;

  return (
    <FullLayout avatarImage="레팬4.png">
      <FadeText delay={0} duration={20}>
        <div style={{ fontSize: 46, color: COLORS.text, fontFamily: FONT, fontWeight: 600, textAlign: 'center' }}>
          진짜 핵심은
        </div>
      </FadeText>

      <FadeText delay={20} duration={22}>
        <div
          style={{
            backgroundColor: 'rgba(230,57,70,0.1)',
            border: `3px solid ${COLORS.red}`,
            borderRadius: 18,
            padding: '26px 60px',
            transform: `translateX(${shakeX}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <span style={{ fontSize: 48 }}>🚫</span>
            <span
              style={{
                fontSize: 54,
                color: COLORS.red,
                fontFamily: FONT,
                fontWeight: 900,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              해로운 음식 멀리하기
            </span>
          </div>
        </div>
      </FadeText>

      <FadeText delay={50} duration={20}>
        <div style={{ fontSize: 30, color: COLORS.textLight, fontFamily: FONT, textAlign: 'center' }}>
          유익한 음식을 먹는 것보다 훨씬 중요합니다
        </div>
      </FadeText>
    </FullLayout>
  );
};
