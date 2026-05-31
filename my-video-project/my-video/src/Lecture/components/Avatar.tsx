import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

interface AvatarProps {
  /** public 폴더 기준 파일명 (예: '레팬2.png') */
  image: string;
  /** 스프링 애니메이션 시작을 늦출 프레임 수 (기본 0) */
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * 스프링 등장 애니메이션이 적용된 아바타 이미지
 */
export const Avatar: React.FC<AvatarProps> = ({ image, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.9 },
    from: 0.75,
    to: 1,
  });

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Img
      src={staticFile(image)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'bottom center',
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    />
  );
};
