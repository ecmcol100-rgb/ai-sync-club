import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Greeting: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const fadeOutStart = Math.round(4 * fps);

  // 컨테이너: 스케일 + 후반 페이드아웃
  const containerOpacity = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, Math.round(0.6 * fps), fadeOutStart, durationInFrames],
    [0.96, 1.0, 1.04, 1.06],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  // 1. "Ai싱크클럽": 페이드인 (0s → 0.4s)
  const titleOpacity = interpolate(
    frame,
    [0, Math.round(0.4 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  // 2. "구독자 여러분 안녕하세요": 아래서 위로 슬라이드 + 페이드인 (0.2s → 0.8s)
  const subtitleStart = Math.round(0.2 * fps);
  const subtitleEnd = Math.round(0.8 * fps);

  const subtitleOpacity = interpolate(
    frame,
    [subtitleStart, subtitleEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const subtitleY = interpolate(
    frame,
    [subtitleStart, subtitleEnd],
    [40, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  // 3. 👋 이모지: 살짝 늦게 페이드인 (0.5s → 1.0s)
  const emojiOpacity = interpolate(
    frame,
    [Math.round(0.5 * fps), Math.round(1.0 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 토스 스타일: 작은 서브레이블 — 페이드인 */}
        <span
          style={{
            fontFamily:
              "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
            fontSize: 44,
            fontWeight: 500,
            color: "#8b95a1",
            letterSpacing: "0.04em",
            opacity: titleOpacity,
          }}
        >
          Ai싱크클럽
        </span>

        {/* 메인 텍스트 — 아래서 위로 슬라이드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          <span
            style={{
              fontFamily:
                "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#191f28",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            구독자 여러분
          </span>
          <span
            style={{
              fontFamily:
                "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#191f28",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              paddingLeft: 96,
            }}
          >
            안녕하세요{" "}
            {/* 👋 이모지 — 살짝 늦게 등장 */}
            <span style={{ display: "inline-block", opacity: emojiOpacity }}>
              👋
            </span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
