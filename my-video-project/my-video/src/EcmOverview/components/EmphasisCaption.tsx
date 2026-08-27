import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';

export interface EmphasisCaptionProps {
  /** 강조 문장. '\n' 줄바꿈 지원 */
  text: string;
  /** 강조색 — 시리즈 강조 관례는 gold */
  accentColor?: string;
  /** 화면 세로 위치(중앙 기준 y). 본문 위에 얹을 때 조정 */
  top?: number;
}

/**
 * EmphasisCaption — 강조 자막 (시리즈 공통)
 *
 * 첫 용도는 체형 반례 문장(섹션 3 외형 구간 — "육영수 여사처럼 그렇지 않은
 * 경우도 있습니다"). 섹션 5 자가진단 경계와 수미상관인 문장이라
 * SelfDiagnosisWarning의 정점 자막과 같은 형식(gold + 밑줄 드로잉)을 쓴다 —
 * 두 화면이 시각적으로 연결된다.
 *
 * 노출 구간은 상위 Sequence가 제어하고, 자기 구간의 시작·끝에서
 * 페이드 인/아웃만 한다. 발자국은 top 조정으로 CONTENT_MAX_Y 안에 둘 것.
 */
export const EmphasisCaption: React.FC<EmphasisCaptionProps> = ({
  text,
  accentColor = COLORS.gold,
  top = 460,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', opacity }}>
      <div
        style={{
          display: 'inline-block',
          color: accentColor,
          fontFamily: FONT,
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}
      >
        {text}
        <div
          style={{
            height: 5,
            marginTop: 10,
            borderRadius: 3,
            backgroundColor: accentColor,
            transform: `scaleX(${fadeIn})`,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

/** 체형 반례 문장 (ItemPanel 사양서 7절 — 섹션 5와 수미상관) */
export const MOK_BODY_EXCEPTION = '다만, 육영수 여사처럼\n그렇지 않은 경우도 있습니다';

export const EMPHASIS_PREVIEW_FRAMES = 120;

export const EmphasisCaptionPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <EmphasisCaption text={MOK_BODY_EXCEPTION} />
  </AbsoluteFill>
);
