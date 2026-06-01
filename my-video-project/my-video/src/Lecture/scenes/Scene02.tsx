import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면2 — 주제 제시 (레팬7, 15초) */
export const Scene02: React.FC = () => (
  <SlideLayout avatarImage="레팬7.png">
    {/* 오늘의 질문 박스 */}
    <FadeText delay={0} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderLeft: `6px solid ${COLORS.topBar}`,
          borderRadius: '0 14px 14px 0',
          padding: '28px 32px',
        }}
      >
        <div style={{ fontSize: 26, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700, marginBottom: 12 }}>
          💬 오늘의 질문
        </div>
        <div style={{ fontSize: 40, color: COLORS.text, fontFamily: FONT, fontWeight: 600, lineHeight: 1.6 }}>
          "수체질에게 인삼이 좋으니까
        </div>
        <div style={{ fontSize: 40, color: COLORS.text, fontFamily: FONT, fontWeight: 600, lineHeight: 1.6 }}>
          인삼을 매일 꾸준히 먹어도 되지 않나요?"
        </div>
      </div>
    </FadeText>

    {/* 오해 안내 */}
    <FadeText delay={35} duration={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '20px 28px',
          backgroundColor: COLORS.cardBg,
          borderRadius: 12,
          border: `1.5px solid ${COLORS.cardBorder}`,
        }}
      >
        <span style={{ fontSize: 32 }}>→</span>
        <span style={{ fontSize: 36, color: COLORS.red, fontFamily: FONT, fontWeight: 700 }}>
          체질의학의 흔한 오해 중 하나입니다
        </span>
      </div>
    </FadeText>
  </SlideLayout>
);
