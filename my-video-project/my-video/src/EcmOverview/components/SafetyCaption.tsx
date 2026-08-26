import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONTENT_MAX_Y, FONT } from '../constants';

export type CaptionKind = 'disclaimer' | 'medical' | 'career' | 'addiction';

export interface SafetyCaptionProps {
  kind: CaptionKind;
  /** 문구는 편별로 주입 — 컴포넌트에 하드코딩하지 않는다 (사양서 4절) */
  text: string;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

/**
 * SafetyCaption — 안전·고지 자막 4종 (시리즈 공통)
 *
 * 노출 구간은 상위 <Sequence>가 제어한다 — 이 컴포넌트에는 타임코드가 없고,
 * 자기 Sequence의 시작·끝에서 페이드 인/아웃만 한다 (useVideoConfig의
 * durationInFrames는 Sequence 안에서 그 Sequence의 길이를 돌려준다).
 *
 * 시인성 순서 (사양서 1절 — 바꾸지 말 것): medical > addiction > career > disclaimer
 * - medical    : 경고색(COLORS.warning) 아이콘·테두리 + 큰 글자. z-index 최상위 —
 *                어떤 경우에도 가려지지 않는다
 * - addiction  : career와 같은 자리, gold 강조로 한 단계 높은 시인성
 * - career     : 소형, 옅은 테두리
 * - disclaimer : 반투명 바 + 소형 흰색 텍스트, 상시 노출용
 *
 * 배치는 사양서 5절 "처음부터 두 자리를 비워두는 방식" — 아래 SLOT 참조.
 * 어떤 조합으로 나타나고 사라져도 각 자막의 세로 위치는 변하지 않는다.
 *
 * 색·폰트는 시리즈 공통 스타일(COLORS·FONT)만 사용한다. 경고색은 사양서
 * 4절에 따라 공통 팔레트에 COLORS.warning으로 추가돼 있다.
 */

/**
 * 고정 슬롯(px) — 사양서 5절 "처음부터 두 자리를 비워두는 방식".
 *
 * 네 종류 모두 bottom·height가 고정된 예약 띠 안에서만 그려진다.
 * 자막이 없는 동안에도 띠는 비워 두므로 무엇이 뜨고 지든 세로 위치가
 * 절대 변하지 않는다. career와 addiction은 교체 관계라 같은 띠(item)를
 * 공유하고, 박스 높이를 띠 높이로 통일해 교체 순간에도 기하가 그대로다 —
 * 시인성 차이는 글자 크기·테두리 색·아이콘으로만 낸다.
 *
 * 띠 배치(1080p, 위→아래): career/addiction(y 686~742) → medical(762~842)
 * → disclaimer(862~910) → 자막 안전 영역(하단 160px). 띠 사이 20px.
 * 띠 높이는 한 줄 기준 — 문구는 한 줄에 들어와야 한다(사양서 6절 검수 항목).
 *
 * 최상단 띠(item)의 위 모서리가 곧 본문 발자국 한계 CONTENT_MAX_Y(686)다 —
 * 본문 컴포넌트는 그 선 위에서 끝나야 자막과 겹치지 않는다 (constants.ts 참조).
 */
const ITEM_H = 56;
const SLOT = {
  disclaimer: { bottom: 170, height: 48 },
  medical: { bottom: 238, height: 80 },
  /** career / addiction 공용 — 위 모서리 = CONTENT_MAX_Y */
  item: { bottom: 1080 - CONTENT_MAX_Y - ITEM_H, height: ITEM_H },
} as const;
export const SafetyCaption: React.FC<SafetyCaptionProps> = ({
  kind,
  text,
  fadeInFrames = 8,
  fadeOutFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  if (kind === 'medical') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: SLOT.medical.bottom,
          height: SLOT.medical.height,
          display: 'flex',
          justifyContent: 'center',
          opacity,
          // 사양서 4절: medical은 어떤 경우에도 가려지지 않는다
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            maxWidth: 1720,
            height: '100%',
            backgroundColor: COLORS.overlay,
            border: `3px solid ${COLORS.warning}`,
            borderRadius: 14,
            padding: '0 32px',
          }}
        >
          <span style={{ color: COLORS.warning, fontSize: 42, lineHeight: 1 }}>⚠</span>
          <span
            style={{
              color: COLORS.white,
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (kind === 'disclaimer') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          // 자막 안전 영역(하단 160px) 바로 위
          bottom: SLOT.disclaimer.bottom,
          height: SLOT.disclaimer.height,
          display: 'flex',
          justifyContent: 'center',
          opacity,
          zIndex: 55,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: 1720,
            height: '100%',
            backgroundColor: COLORS.overlay,
            borderRadius: 10,
            padding: '0 26px',
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.35,
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // career / addiction — 좌측 항목 라벨 옆 공용 띠. 박스 높이 = 띠 높이로
  // 통일돼 있어 교체 순간에도 세로 기하가 변하지 않는다
  const isAddiction = kind === 'addiction';
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        bottom: SLOT.item.bottom,
        height: SLOT.item.height,
        opacity,
        zIndex: 56,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 1400,
          height: '100%',
          backgroundColor: COLORS.overlay,
          border: `2px solid ${isAddiction ? COLORS.gold : COLORS.textDim}`,
          borderRadius: 10,
          padding: isAddiction ? '0 22px' : '0 18px',
        }}
      >
        {isAddiction ? (
          <span style={{ color: COLORS.gold, fontSize: 28, lineHeight: 1 }}>⚠</span>
        ) : null}
        <span
          style={{
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: isAddiction ? 27 : 24,
            fontWeight: isAddiction ? 700 : 600,
            lineHeight: 1.35,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/** 프리뷰 전체 길이 (10초) */
export const SAFETY_PREVIEW_FRAMES = 300;

/**
 * 검수용 단독 프리뷰 (스튜디오 사이드바 확인용).
 *
 * 사양서 7절의 목양·목음편 문구를 임시 구간에 얹어 네 종류를 한 화면에서
 * 검수한다. 실제 편에서는 TTS 실측 후 상위 Sequence 값을 확정한다.
 * - disclaimer: 상시 / medical: 2.5~7.5초 구간
 * - career → addiction → career 두 번 교체: 페이드(8프레임)를 서로 겹쳐
 *   깜빡임 없는 크로스페이드 (사양서 3절 교체 처리)
 */
export const SafetyCaptionPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Sequence durationInFrames={SAFETY_PREVIEW_FRAMES}>
      <SafetyCaption
        kind="disclaimer"
        text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
      />
    </Sequence>
    <Sequence from={75} durationInFrames={150}>
      <SafetyCaption
        kind="medical"
        text="복용 중인 혈압약을 임의로 중단하지 마시고 반드시 담당 의사와 상의하십시오."
      />
    </Sequence>
    <Sequence durationInFrames={128}>
      <SafetyCaption kind="career" text="직업 적성은 경향이며, 진로 판단의 근거가 아닙니다." />
    </Sequence>
    <Sequence from={120} durationInFrames={88}>
      <SafetyCaption kind="addiction" text="알코올 의존은 전문적인 치료가 필요한 문제입니다." />
    </Sequence>
    <Sequence from={200} durationInFrames={SAFETY_PREVIEW_FRAMES - 200}>
      <SafetyCaption kind="career" text="직업 적성은 경향이며, 진로 판단의 근거가 아닙니다." />
    </Sequence>
  </AbsoluteFill>
);
