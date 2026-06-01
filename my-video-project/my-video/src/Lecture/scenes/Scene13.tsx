import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면13 — 부모아이 비유 (레팬3, 15초) */
export const Scene13: React.FC = () => (
  <SlideLayout avatarImage="레팬3.png">
    <FadeText delay={0} duration={18}>
      <div style={{ fontSize: 40, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>
        👨‍👦 비유: 부모와 아이
      </div>
    </FadeText>

    <FadeText delay={15} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.blueLight,
          borderRadius: 14,
          padding: '22px 28px',
          borderLeft: `5px solid ${COLORS.blue}`,
        }}
      >
        <div style={{ fontSize: 38, fontFamily: FONT, color: COLORS.blue, fontWeight: 700, marginBottom: 10 }}>
          부모가 모든 일을 대신해주면
        </div>
        <div style={{ fontSize: 34, fontFamily: FONT, color: COLORS.text, lineHeight: 1.6 }}>
          → 아이가 스스로 해낼 기회를 잃습니다
        </div>
      </div>
    </FadeText>

    <FadeText delay={38} duration={22}>
      <div
        style={{
          backgroundColor: COLORS.greenLight,
          borderRadius: 14,
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 44 }}>🔄</span>
        <div style={{ fontSize: 38, fontFamily: FONT, fontWeight: 700, color: COLORS.topBar }}>
          몸도 똑같은 원리
        </div>
      </div>
    </FadeText>

    <FadeText delay={62} duration={20}>
      <div style={{ fontSize: 34, color: COLORS.textLight, fontFamily: FONT, lineHeight: 1.6 }}>
        인삼이 계속 위장을 도와주면, 위장 스스로의 힘이 약해집니다
      </div>
    </FadeText>
  </SlideLayout>
);
