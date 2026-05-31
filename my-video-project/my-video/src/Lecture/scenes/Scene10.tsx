import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면10 — 과식·즙 주의 (레팬5, 20초) */
export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();

  const cases = [
    {
      emoji: '🥩',
      title: '목양체질 + 고기 과식',
      result: '콜레스테롤 ↑',
      delay: 0,
    },
    {
      emoji: '🧅',
      title: '수음체질 + 매일 양파즙',
      result: '위장 부담 ↑',
      delay: 28,
    },
  ];

  return (
    <SlideLayout avatarImage="레팬5.png">
      <FadeText delay={0} duration={18}>
        <div style={{ fontSize: 34, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800, marginBottom: 4 }}>
          과잉 섭취 사례
        </div>
      </FadeText>

      {cases.map((c) => {
        const op = interpolate(frame, [c.delay, c.delay + 22], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const ty = interpolate(frame, [c.delay, c.delay + 22], [20, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div
            key={c.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              backgroundColor: COLORS.cardBg,
              border: `1.5px solid ${COLORS.cardBorder}`,
              borderRadius: 14,
              padding: '22px 28px',
              opacity: op,
              transform: `translateY(${ty}px)`,
            }}
          >
            <span style={{ fontSize: 44 }}>{c.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 32, fontFamily: FONT, fontWeight: 700, color: COLORS.text }}>
                {c.title}
              </div>
              <div style={{ fontSize: 28, fontFamily: FONT, color: COLORS.red, fontWeight: 600, marginTop: 8 }}>
                → {c.result}
              </div>
            </div>
          </div>
        );
      })}

      <FadeText delay={65} duration={22}>
        <div
          style={{
            backgroundColor: 'rgba(230,57,70,0.08)',
            border: `2px solid ${COLORS.red}`,
            borderRadius: 12,
            padding: '16px 28px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 30, color: COLORS.red, fontFamily: FONT, fontWeight: 700 }}>
            즙으로 농축하면 약처럼 작용합니다
          </span>
        </div>
      </FadeText>
    </SlideLayout>
  );
};
