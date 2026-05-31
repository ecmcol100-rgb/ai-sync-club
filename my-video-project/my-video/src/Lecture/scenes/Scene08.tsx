import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면8 — 휘발유 비유 (레팬3, 15초) */
export const Scene08: React.FC = () => (
  <SlideLayout avatarImage="레팬3.png">
    <FadeText delay={0} duration={20}>
      <div style={{ fontSize: 26, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700, marginBottom: 6 }}>
        ⛽ 비유: 자동차와 연료
      </div>
    </FadeText>

    {/* 항목들 */}
    <FadeText delay={12} duration={20}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderRadius: 12,
          padding: '18px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 30 }}>⛽</span>
        <div>
          <div style={{ fontSize: 24, fontFamily: FONT, fontWeight: 700, color: COLORS.text }}>
            휘발유 차 + 휘발유
          </div>
          <div style={{ fontSize: 20, fontFamily: FONT, color: COLORS.topBar, marginTop: 4 }}>
            연료는 맞습니다 ✅
          </div>
        </div>
      </div>
    </FadeText>

    <FadeText delay={30} duration={20}>
      <div
        style={{
          backgroundColor: '#FFF0F0',
          borderRadius: 12,
          padding: '18px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 30 }}>🔧</span>
        <div>
          <div style={{ fontSize: 24, fontFamily: FONT, fontWeight: 700, color: COLORS.text }}>
            엔진 고장은 안 고쳐짐 ❌
          </div>
          <div style={{ fontSize: 20, fontFamily: FONT, color: COLORS.textLight, marginTop: 4 }}>
            연료 ≠ 수리
          </div>
        </div>
      </div>
    </FadeText>

    <FadeText delay={50} duration={20}>
      <div
        style={{
          borderRadius: 12,
          padding: '16px 26px',
          backgroundColor: COLORS.cardBg,
          border: `1.5px solid ${COLORS.cardBorder}`,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 26, color: COLORS.blue, fontFamily: FONT, fontWeight: 800 }}>
          유익한 음식 ≠ 치료제
        </span>
      </div>
    </FadeText>
  </SlideLayout>
);
