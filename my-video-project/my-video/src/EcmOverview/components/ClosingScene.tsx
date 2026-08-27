import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';

export interface ClosingSceneProps {
  /** 마무리 한 줄 */
  outroLine?: string;
  /** 다음 편 예고 라벨 */
  nextLabel?: string;
  /** 다음 편 제목 — 체질명은 확정 색 '글자색'으로. 칩은 제목급 4곳 한정 */
  nextTitleParts?: { text: string; color?: string }[];
  /** 구독 유도 문구 */
  ctaMain?: string;
  ctaSub?: string;
  /** CTA 등장 시각(초) */
  ctaStartSec?: number;
}

/**
 * ClosingScene — 클로징 (섹션 6)
 *
 * 자가진단 경계(섹션 5)가 톤을 낮춰 끝난 뒤를 받아, 다음 편 예고와
 * 구독 유도로 마무리한다. 개괄편 Section06의 연출 요소(방사광 배경,
 * 후반 CTA 스프링 등장, 붉은 구독 필)를 편 데이터만 갈아끼울 수 있게
 * 컴포넌트화 — 실사 없이 타이포만.
 * CTA는 개괄편과 같은 자막 안전 영역 위(bottom 180)에 배치.
 */
export const ClosingScene: React.FC<ClosingSceneProps> = ({
  outroLine = '오늘은 목양체질과 목음체질을 살펴봤습니다',
  nextLabel = '다음 편',
  // 체질명은 확정 색 글자 (금양 초록 / 금음 노랑) — 칩은 제목급 4곳 한정
  nextTitleParts = [
    { text: '금양체질', color: CONSTITUTION_ACCENTS.금양 },
    { text: '과 ' },
    { text: '금음체질', color: CONSTITUTION_ACCENTS.금음 },
  ],
  ctaMain = '▶ 구독',
  ctaSub = '+ 알림 설정으로 다음 편을 놓치지 마세요',
  ctaStartSec = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outroIn = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nextIn = interpolate(frame, [46, 66], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nextScale = spring({ frame: frame - 46, fps, config: { damping: 17, stiffness: 80 }, from: 0.94, to: 1 });
  const ctaSpring = spring({
    frame: frame - Math.round(ctaStartSec * fps),
    fps,
    config: { damping: 15, stiffness: 90 },
    from: 0,
    to: 1,
  });

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(45,106,79,0.3) 0%, rgba(14,26,22,0) 55%)',
        }}
      />

      {/* 마무리 한 줄 */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: outroIn,
          color: COLORS.textDim,
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 600,
        }}
      >
        {outroLine}
      </div>

      {/* 다음 편 예고 */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: nextIn,
          transform: `scale(${nextScale})`,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: COLORS.green,
            color: COLORS.white,
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
            padding: '10px 26px',
            borderRadius: 10,
          }}
        >
          {nextLabel}
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 2,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {nextTitleParts.map((p, i) => (
            <span key={i} style={{ color: p.color ?? COLORS.text }}>
              {p.text}
            </span>
          ))}
        </div>
      </div>

      {/* 구독 유도 — 자막 안전 영역 위 (개괄편 Section06과 동일 형식) */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: ctaSpring,
          transform: `translateY(${(1 - ctaSpring) * 30}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            backgroundColor: 'rgba(230,57,70,0.95)',
            padding: '20px 44px',
            borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: COLORS.white, fontFamily: FONT, fontSize: 44, fontWeight: 900 }}>{ctaMain}</span>
          <span style={{ color: COLORS.white, fontFamily: FONT, fontSize: 36, fontWeight: 700 }}>{ctaSub}</span>
        </div>
      </div>
    </>
  );
};

export const CLOSING_PREVIEW_FRAMES = 10 * 30;

/** 검수용 프리뷰 (목양·목음편 기본값 — 다음 편: 금양·금음) */
export const ClosingScenePreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <ClosingScene />
  </AbsoluteFill>
);
