import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면4 — 숙제 비유 (레팬3, 25초) */
export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.16, 1, 0.3, 1);

  // 좌 박스: 왼쪽에서 슬라이드
  const box1X = interpolate(frame, [0, 25], [-60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const box1Opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

  // 우 박스: 오른쪽에서 슬라이드
  const box2X = interpolate(frame, [30, 55], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const box2Opacity = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

  return (
    <SlideLayout avatarImage="레팬3.png">
      {/* 두 박스 세로 배치 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 음식 박스 */}
        <div
          style={{
            backgroundColor: COLORS.greenLight,
            borderRadius: 16,
            padding: '20px 28px',
            border: `2px solid ${COLORS.topBar}`,
            transform: `translateX(${box1X}px)`,
            opacity: box1Opacity,
          }}
        >
          <div style={{ fontSize: 38, marginBottom: 10 }}>📚 음식</div>
          <div style={{ fontSize: 34, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            "숙제할 때 도움이 필요하면 말해줘. 연필이나 지우개 갖다줄까?"
          </div>
          <div style={{ marginTop: 12, fontSize: 32, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>
            → 보조 역할
          </div>
        </div>

        {/* 약물 박스 */}
        <div
          style={{
            backgroundColor: '#FFF0F0',
            borderRadius: 16,
            padding: '20px 28px',
            border: `2px solid ${COLORS.red}`,
            transform: `translateX(${box2X}px)`,
            opacity: box2Opacity,
          }}
        >
          <div style={{ fontSize: 38, marginBottom: 10 }}>⚡ 약물</div>
          <div style={{ fontSize: 34, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            "잠깐 비켜봐, 내가 대신 숙제를 해줄게"
          </div>
          <div style={{ marginTop: 12, fontSize: 32, color: COLORS.red, fontFamily: FONT, fontWeight: 700 }}>
            → 대리 역할
          </div>
        </div>
      </div>

      {/* 결론 */}
      <FadeText delay={65} duration={22}>
        <div
          style={{
            textAlign: 'center',
            fontSize: 40,
            color: COLORS.blue,
            fontFamily: FONT,
            fontWeight: 700,
            padding: '16px 0',
          }}
        >
          몸의 자생력 차이
        </div>
      </FadeText>
    </SlideLayout>
  );
};
