import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면14 — 홍삼 설명 (레팬7, 20초) */
export const Scene14: React.FC = () => (
  <SlideLayout avatarImage="레팬7.png">
    <FadeText delay={0} duration={18}>
      <div style={{ fontSize: 36, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800 }}>
        📊 홍삼이란?
      </div>
    </FadeText>

    <FadeText delay={16} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderRadius: 14,
          padding: '20px 26px',
          border: `1.5px solid ${COLORS.topBar}`,
        }}
      >
        <div style={{ fontSize: 28, fontFamily: FONT, color: COLORS.text, lineHeight: 1.7 }}>
          홍삼 = 인삼을 <span style={{ color: COLORS.topBar, fontWeight: 700 }}>찌고 말린</span> 가공품, 본질적으로 인삼과 동일
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {['약성 ↓', '부작용 ↓', '약효 ↓'].map((t) => (
            <div
              key={t}
              style={{
                backgroundColor: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 8,
                padding: '8px 20px',
                fontSize: 26,
                fontFamily: FONT,
                color: COLORS.blue,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </FadeText>

    <FadeText delay={40} duration={22}>
      <div
        style={{
          backgroundColor: '#FFF0F0',
          border: `1.5px solid ${COLORS.red}`,
          borderRadius: 14,
          padding: '18px 26px',
        }}
      >
        <div style={{ fontSize: 26, fontFamily: FONT, color: COLORS.red, fontWeight: 600, lineHeight: 1.7 }}>
          ⚠️ 인삼이 안 맞는 5개 체질엔 홍삼도 부적합
        </div>
        <div style={{ fontSize: 26, fontFamily: FONT, color: COLORS.topBar, fontWeight: 600, lineHeight: 1.7 }}>
          ⚠️ 인삼이 맞는 3개 체질(수양, 수음, 목양)에는 홍삼도 적합
        </div>
        <div style={{ fontSize: 26, fontFamily: FONT, color: COLORS.red, fontWeight: 600, lineHeight: 1.7 }}>
          ⚠️ 하지만 홍삼이 맞는 체질도 치료엔 인삼이 더 적합
        </div>
      </div>
    </FadeText>
  </SlideLayout>
);
