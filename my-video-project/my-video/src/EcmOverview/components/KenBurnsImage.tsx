import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

interface KenBurnsImageProps {
  /** public 기준 경로 (constants.IMAGES / ecm() 사용) */
  src: string;
  /** 켄번스 줌 시작/끝 배율 */
  from?: number;
  to?: number;
  /** 애니메이션 길이(프레임). 섹션 길이에 맞춰 넉넉히. */
  durationInFrames?: number;
  objectPosition?: string;
  /** 하단 가독성용 그라디언트 오버레이 표시 여부 */
  gradient?: boolean;
  style?: React.CSSProperties;
}

/**
 * 사진에 은은한 켄번스(느린 줌) 효과를 주는 배경 이미지.
 * 자막 가독성을 위해 하단 그라디언트 오버레이를 선택적으로 얹는다.
 */
export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
  src,
  from = 1.06,
  to = 1.14,
  durationInFrames = 900,
  objectPosition = 'center',
  gradient = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={style}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          transform: `scale(${scale})`,
        }}
      />
      {gradient && (
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,16,13,0.35) 0%, rgba(8,16,13,0) 30%, rgba(8,16,13,0) 55%, rgba(8,16,13,0.85) 100%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
