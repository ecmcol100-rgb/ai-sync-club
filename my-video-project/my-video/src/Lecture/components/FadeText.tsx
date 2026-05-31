import { Easing, interpolate, useCurrentFrame } from 'remotion';

interface FadeTextProps {
  delay?: number;
  duration?: number;
  fromY?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * 페이드인 + 위로 올라오는 텍스트 애니메이션 컴포넌트
 * @param delay   - 애니메이션 시작 프레임 (기본 0)
 * @param duration - 애니메이션 지속 프레임 (기본 20)
 * @param fromY   - 시작 Y 오프셋 px (기본 24)
 */
export const FadeText: React.FC<FadeTextProps> = ({
  delay = 0,
  duration = 20,
  fromY = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.16, 1, 0.3, 1);

  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const translateY = interpolate(frame, [delay, delay + duration], [fromY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};
