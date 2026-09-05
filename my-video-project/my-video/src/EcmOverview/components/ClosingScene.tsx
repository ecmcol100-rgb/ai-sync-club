import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';
import { ConstitutionName } from './ConstitutionName';

export interface ClosingSceneProps {
  /**
   * 3화면 시작 시각(초): [마무리, 예고, CTA] — 클로징 표준 구조
   * (8ch_series_standard.md). 길이는 상위 Sequence가 제어한다
   */
  stageStartsSec?: [number, number, number];
  /** 마무리 화면의 두 체질 칩 (v9 연출 메모 — 사이를 벌려 배치) */
  closurePair?: [string, string];
  /** 마무리 문안 두 줄 — 본문에서 쓴 표현을 그대로 가져온다 (제작표준) */
  closureLine1?: string;
  closureLine2?: string;
  /** 다음 편 예고 라벨 */
  nextLabel?: string;
  /** 다음 편 제목 — 체질명은 확정 색 '글자색'으로 (칩은 제목·도입·클로징 마무리 한정) */
  nextTitleParts?: { text: string; color?: string }[];
  /** 예고 문안 — 학술 용어 대신 일상어 (제작표준: "반대 체질" 화면 사용 금지) */
  teaserMain?: string;
  teaserSub?: string;
  /** 구독 유도 문구 */
  ctaMain?: string;
  ctaSub?: string;
  /** CTA 화면의 마무리 인사 (대본 마지막 문장) */
  farewell?: string;
}

/**
 * ClosingScene — 클로징 (섹션 6, 약 28초)
 *
 * v8 69항·v9 71~72항 클로징 표준 구조 — 화면 셋으로 나눈다:
 * ① 마무리 — 편의 핵심 메시지를 원인 → 결과로 회수. 목양·목음 두 칩을
 *   사이를 벌려 나란히("이름은 닮았지만 다른 둘"이 화면으로 읽히게).
 *   회수 구간이므로 새 시각 요소 금지(v9 72항) — 타이포만
 * ② 예고 — 다음 편을 이번 편에서 배운 것의 대비("정반대")로 소개
 * ③ CTA — 구독 필 (문구는 v6 53항 원장님 승인분 유지)
 *
 * 화면 전환 시각은 stageStartsSec(외부 제어), 각 화면은 0.4초 크로스페이드.
 * CTA는 개괄편 Section06과 같은 자막 안전 영역 위(bottom 180)에 배치.
 */
export const ClosingScene: React.FC<ClosingSceneProps> = ({
  stageStartsSec = [0, 11.8, 21.3],
  closurePair = ['목양체질', '목음체질'],
  closureLine1 = '이름은 닮았지만 서로 다른 두 체질이었습니다',
  closureLine2 = '가운데 장기의 배열이 다르고,\n그에 따라 섭생법과 치료법의 차이가 발생합니다',
  nextLabel = '다음 편',
  nextTitleParts = [
    { text: '금양체질', color: CONSTITUTION_ACCENTS.금양 },
    { text: '과 ' },
    { text: '금음체질', color: CONSTITUTION_ACCENTS.금음 },
  ],
  teaserMain = '오늘 보신 목체질과는 정반대입니다',
  teaserSub = '육식을 끊어야 하고, 냉수욕이 건강법인 체질입니다',
  ctaMain = '▶ 구독',
  ctaSub = '+ 알림 설정으로 다음 편을 놓치지 마세요',
  farewell = '다음 편에서 뵙겠습니다',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3] = stageStartsSec;
  const FADE = 12; // 0.4초 크로스페이드

  /** 화면 노출 구간 [fromSec, toSec?) → 0~1 (끝 미지정 시 유지) */
  const stageOpacity = (fromSec: number, toSec?: number): number => {
    const on = interpolate(frame, [fromSec * fps, fromSec * fps + FADE], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const off =
      toSec === undefined
        ? 1
        : interpolate(frame, [toSec * fps - FADE, toSec * fps], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
    return Math.min(on, off);
  };

  const closureOp = stageOpacity(s1, s2);
  const teaserOp = stageOpacity(s2, s3);
  const ctaOp = stageOpacity(s3);
  const teaserScale = spring({ frame: frame - Math.round(s2 * fps), fps, config: { damping: 17, stiffness: 80 }, from: 0.94, to: 1 });
  const ctaSpring = spring({ frame: frame - Math.round(s3 * fps), fps, config: { damping: 15, stiffness: 90 }, from: 0, to: 1 });

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(45,106,79,0.3) 0%, rgba(14,26,22,0) 55%)',
        }}
      />

      {/* ① 마무리 — 칩 2개(사이 벌림) + 원인 → 결과 문안. 타이포만 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: closureOp }}>
        <div
          style={{
            position: 'absolute',
            top: 290,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // "이름은 닮았지만 다른 둘"이 화면으로 읽히게 — 사이를 벌린다
            gap: 200,
          }}
        >
          <ConstitutionName name={closurePair[0]} fontSize={64} />
          <ConstitutionName name={closurePair[1]} fontSize={64} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 445,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 50,
            fontWeight: 800,
          }}
        >
          {closureLine1}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 540,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 600,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}
        >
          {closureLine2}
        </div>
      </div>

      {/* ② 예고 — 다음 편을 오늘 배운 것의 대비로 */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: teaserOp,
          transform: `scale(${teaserScale})`,
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
        <div
          style={{
            marginTop: 44,
            color: COLORS.gold,
            fontFamily: FONT,
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          {teaserMain}
        </div>
        <div
          style={{
            marginTop: 20,
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          {teaserSub}
        </div>
      </div>

      {/* ③ CTA — 인사 타이포 + 구독 필 (필은 자막 안전 영역 위, 개괄편과 동일 형식) */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ctaOp,
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 800,
          textShadow: '0 4px 24px rgba(0,0,0,0.6)',
        }}
      >
        {farewell}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(ctaOp, ctaSpring),
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

/** 클로징 3화면 프리뷰 — 28초 (S6_STAGES_SEC 기본값과 동일) */
export const CLOSING_PREVIEW_FRAMES = 28 * 30;

/** 검수용 프리뷰 (목양·목음편 기본값 — 다음 편: 금양·금음) */
export const ClosingScenePreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <ClosingScene />
  </AbsoluteFill>
);
