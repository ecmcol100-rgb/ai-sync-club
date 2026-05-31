import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { FullLayout } from '../components/FullLayout';
import { FadeText } from '../components/FadeText';

/** 장면6 — 약초 경고 (레팬5, 15초) */
export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();

  const herbs = [
    { emoji: '🌿', name: '인삼' },
    { emoji: '🔴', name: '대추' },
    { emoji: '🫚', name: '생강' },
    { emoji: '🍯', name: '꿀' },
  ];

  // 강조 텍스트 흔들기
  const shakeX = frame > 40
    ? interpolate(Math.sin(frame * 0.7), [-1, 1], [-4, 4])
    : 0;

  return (
    <FullLayout avatarImage="레팬5.png">
      <FadeText delay={0} duration={20}>
        <div
          style={{
            fontSize: 44,
            color: COLORS.red,
            fontFamily: FONT,
            fontWeight: 800,
            textAlign: 'center',
            transform: `translateX(${shakeX}px)`,
          }}
        >
          이것들은 모두 '약'입니다
        </div>
      </FadeText>

      {/* 이모지 나열 — 순차 등장 */}
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
        {herbs.map((herb, idx) => {
          const itemOpacity = interpolate(frame, [20 + idx * 15, 40 + idx * 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const itemY = interpolate(frame, [20 + idx * 15, 40 + idx * 15], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={herb.name}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: 14,
                padding: '16px 28px',
                border: `1.5px solid ${COLORS.cardBorder}`,
              }}
            >
              <span style={{ fontSize: 42 }}>{herb.emoji}</span>
              <span style={{ fontSize: 22, fontFamily: FONT, fontWeight: 700, color: COLORS.text }}>{herb.name}</span>
            </div>
          );
        })}
      </div>

      {/* 경고 문구 */}
      <FadeText delay={85} duration={20}>
        <div
          style={{
            backgroundColor: 'rgba(230,57,70,0.12)',
            border: `2px solid ${COLORS.red}`,
            borderRadius: 12,
            padding: '14px 36px',
            fontSize: 24,
            color: COLORS.red,
            fontFamily: FONT,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          장기 복용 시 약물 의존 주의
        </div>
      </FadeText>
    </FullLayout>
  );
};
