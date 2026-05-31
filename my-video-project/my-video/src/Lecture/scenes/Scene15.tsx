import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

const principles = [
  '체질에 맞는 음식을 골고루, 적절한 양으로',
  '약성 식재료는 8체질 한의사 진단 후 사용',
];

/** 장면15 — 결론 (레팬8, 20초) */
export const Scene15: React.FC = () => (
  <SlideLayout avatarImage="레팬8.png">
    <FadeText delay={0} duration={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 30 }}>💡</span>
        <span style={{ fontSize: 30, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800 }}>
          진정한 건강이란
        </span>
      </div>
    </FadeText>

    <FadeText delay={18} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderRadius: 14,
          padding: '20px 26px',
          borderLeft: `5px solid ${COLORS.topBar}`,
        }}
      >
        <div style={{ fontSize: 24, fontFamily: FONT, color: COLORS.text, lineHeight: 1.7 }}>
          약물이나 보조제 없이도 몸이 스스로
        </div>
        <div style={{ fontSize: 24, fontFamily: FONT, color: COLORS.text, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.topBar, fontWeight: 700 }}>균형을 유지하는 상태</span>
        </div>
      </div>
    </FadeText>

    <FadeText delay={40} duration={18}>
      <div style={{ fontSize: 22, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>
        실천 원칙
      </div>
    </FadeText>

    {principles.map((p, idx) => (
      <FadeText key={p} delay={52 + idx * 20} duration={18}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 20px',
            backgroundColor: COLORS.cardBg,
            border: `1.5px solid ${COLORS.cardBorder}`,
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 22, color: COLORS.topBar, marginTop: 1 }}>✅</span>
          <span style={{ fontSize: 22, fontFamily: FONT, color: COLORS.text, lineHeight: 1.6 }}>{p}</span>
        </div>
      </FadeText>
    ))}
  </SlideLayout>
);
