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
      {/* 두 박스 가로 배치 */}
      <div style={{ display: 'flex', gap: 20 }}>
        {/* 음식 박스 */}
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.greenLight,
            borderRadius: 16,
            padding: '22px 22px',
            border: `2px solid ${COLORS.topBar}`,
            transform: `translateX(${box1X}px)`,
            opacity: box1Opacity,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📚 음식</div>
          <div style={{ fontSize: 22, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            "필요하면 도와줄게,
          </div>
          <div style={{ fontSize: 22, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            연필이나 지우개 필요해?"
          </div>
          <div style={{ marginTop: 14, fontSize: 20, color: COLORS.topBar, fontFamily: FONT, fontWeight: 700 }}>
            → 보조 역할
          </div>
        </div>

        {/* 약물 박스 */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFF0F0',
            borderRadius: 16,
            padding: '22px 22px',
            border: `2px solid ${COLORS.red}`,
            transform: `translateX(${box2X}px)`,
            opacity: box2Opacity,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>⚡ 약물</div>
          <div style={{ fontSize: 22, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            "잠깐 비켜봐,
          </div>
          <div style={{ fontSize: 22, color: COLORS.text, fontFamily: FONT, fontWeight: 500, lineHeight: 1.6 }}>
            내가 대신 숙제를 해줄게"
          </div>
          <div style={{ marginTop: 14, fontSize: 20, color: COLORS.red, fontFamily: FONT, fontWeight: 700 }}>
            → 대리 역할
          </div>
        </div>
      </div>

      {/* 결론 */}
      <FadeText delay={65} duration={22}>
        <div
          style={{
            textAlign: 'center',
            fontSize: 26,
            color: COLORS.blue,
            fontFamily: FONT,
            fontWeight: 700,
            padding: '14px 0',
          }}
        >
          몸의 자생력 차이
        </div>
      </FadeText>
    </SlideLayout>
  );
};
