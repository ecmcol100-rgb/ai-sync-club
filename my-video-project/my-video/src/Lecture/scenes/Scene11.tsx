import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면11 — Chapter 3 도입 (레팬9, 20초) */
export const Scene11: React.FC = () => (
  <SlideLayout avatarImage="레팬9.png">
    <FadeText delay={0} duration={18}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>📌</span>
        <span
          style={{
            fontSize: 28,
            color: COLORS.topBar,
            fontFamily: FONT,
            fontWeight: 700,
            letterSpacing: 2,
            borderBottom: `3px solid ${COLORS.topBar}`,
            paddingBottom: 2,
            whiteSpace: 'nowrap',
          }}
        >
          Chapter 3
        </span>
      </div>
    </FadeText>

    <FadeText delay={15} duration={22}>
      <div style={{ fontSize: 52, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
        수체질과 인삼
      </div>
    </FadeText>

    <FadeText delay={45} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          border: `2px solid ${COLORS.topBar}`,
          borderRadius: 12,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span style={{ fontSize: 32 }}>✅</span>
        <div style={{ fontSize: 32, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700, lineHeight: 1.5 }}>
          수양·수음체질 → 인삼이 긍정적으로 작용
        </div>
      </div>
    </FadeText>
  </SlideLayout>
);
