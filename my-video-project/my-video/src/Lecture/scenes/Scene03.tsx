import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면3 — Chapter 1 도입 (레팬9, 20초) */
export const Scene03: React.FC = () => (
  <SlideLayout avatarImage="레팬9.png">
    {/* 챕터 번호 */}
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
          Chapter 1
        </span>
      </div>
    </FadeText>

    {/* 챕터 제목 */}
    <FadeText delay={15} duration={22}>
      <div
        style={{
          fontSize: 52,
          color: COLORS.darkGreen,
          fontFamily: FONT,
          fontWeight: 800,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
        }}
      >
        음식과 약물은 역할이 다릅니다
      </div>
    </FadeText>

    {/* 핵심 문구 */}
    <FadeText delay={45} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderRadius: 12,
          padding: '20px 32px',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 30, color: COLORS.text, fontFamily: FONT, lineHeight: 1.6 }}>
          <span style={{ color: COLORS.textLight, fontWeight: 500 }}>우리가 흔히 하는 실수: </span>
          <span style={{ color: COLORS.red, fontWeight: 700 }}>약을 음식처럼 먹거나</span>
          <span style={{ color: COLORS.textLight }}> / </span>
          <span style={{ color: COLORS.blue, fontWeight: 700 }}>음식을 약처럼 먹거나</span>
        </div>
      </div>
    </FadeText>
  </SlideLayout>
);
