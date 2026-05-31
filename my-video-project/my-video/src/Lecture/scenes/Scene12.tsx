import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면12 — 평상시 주의 (레팬6, 20초) */
export const Scene12: React.FC = () => (
  <SlideLayout avatarImage="레팬6.png">
    <FadeText delay={0} duration={18}>
      <div style={{ fontSize: 28, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800 }}>
        인삼 복용, 언제 맞고 언제 주의할까?
      </div>
    </FadeText>

    {/* 상황 1 */}
    <FadeText delay={18} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          border: `2px solid ${COLORS.topBar}`,
          borderRadius: 14,
          padding: '20px 26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 26 }}>🏥</span>
          <span style={{ fontSize: 22, fontFamily: FONT, fontWeight: 700, color: COLORS.topBar }}>
            위장 기능 저하 시
          </span>
        </div>
        <div style={{ fontSize: 22, fontFamily: FONT, color: COLORS.text, lineHeight: 1.6 }}>
          인삼을 약으로 단기 사용 ✅
        </div>
      </div>
    </FadeText>

    {/* 상황 2 */}
    <FadeText delay={42} duration={22}>
      <div
        style={{
          backgroundColor: '#FFFBF0',
          border: `2px solid #E6A817`,
          borderRadius: 14,
          padding: '20px 26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 26 }}>☀️</span>
          <span style={{ fontSize: 22, fontFamily: FONT, fontWeight: 700, color: '#B07A10' }}>
            평상시
          </span>
        </div>
        <div style={{ fontSize: 22, fontFamily: FONT, color: COLORS.text, lineHeight: 1.6 }}>
          매일 장복 ⚠️ 권장하지 않음
        </div>
      </div>
    </FadeText>

    <FadeText delay={68} duration={20}>
      <div style={{ fontSize: 22, color: COLORS.textLight, fontFamily: FONT, lineHeight: 1.6 }}>
        💡 이유: 위장 기능이 점차 약해질 수 있음
      </div>
    </FadeText>
  </SlideLayout>
);
