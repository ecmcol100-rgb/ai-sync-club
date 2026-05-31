import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면7 — Chapter 2 도입 (레팬9, 20초) */
export const Scene07: React.FC = () => (
  <SlideLayout avatarImage="레팬9.png">
    <FadeText delay={0} duration={18}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>📌</span>
        <span
          style={{
            fontSize: 22,
            color: COLORS.topBar,
            fontFamily: FONT,
            fontWeight: 700,
            letterSpacing: 2,
            borderBottom: `3px solid ${COLORS.topBar}`,
            paddingBottom: 2,
          }}
        >
          Chapter 2
        </span>
      </div>
    </FadeText>

    <FadeText delay={15} duration={22}>
      <div style={{ fontSize: 40, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800, lineHeight: 1.4 }}>
        유익한 음식의
      </div>
      <div style={{ fontSize: 40, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800, lineHeight: 1.4 }}>
        진짜 의미
      </div>
    </FadeText>

    <FadeText delay={45} duration={22}>
      <div
        style={{
          backgroundColor: '#FFF0F0',
          border: `2px solid ${COLORS.red}`,
          borderRadius: 12,
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 30 }}>❌</span>
        <span style={{ fontSize: 26, color: COLORS.red, fontFamily: FONT, fontWeight: 700 }}>
          유익한 음식 = 마법의 약?
        </span>
      </div>
    </FadeText>
  </SlideLayout>
);
