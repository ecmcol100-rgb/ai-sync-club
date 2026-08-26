import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';
import { SafetyCaption } from './SafetyCaption';

export interface ItemLabelProps {
  /** '외형' | '성격' | '직업' | '운동' | '질병·건강법' | '유명인' */
  label: string;
  /** 미지정 시 중립 강조색 — 편에서는 해당 섹션 체질색(CONSTITUTION_ACCENTS)을 넘긴다 */
  accentColor?: string;
}

/**
 * ItemLabel — 항목 라벨 자막 (섹션 3·4 공통)
 *
 * 9항목 구조를 시청자가 인지하게 하는 장치. 노출 구간은 상위 Sequence가
 * 제어하고(내부 타임코드 없음), 라벨은 자기 Sequence의 시작·끝에서
 * 0.3초 페이드 + 미세 슬라이드로 등장·퇴장한다. 항목 전환은 상위에서
 * 이전 라벨 Sequence가 끝난 뒤 다음 라벨을 시작하면 되고, 겹치지 않는 한
 * 두 라벨이 동시에 뜨지 않는다.
 *
 * 위치·크기·등장 방식이 컴포넌트에 고정돼 있어 섹션 3과 4에서
 * 완전히 동일하게 나온다 (사양서 A-4 — 대칭이 이 편의 설계).
 * 좌상단 소형 — 본문 그래픽(CONTENT_MAX_Y 안)과 SafetyCaption 슬롯을
 * 가리지 않는다.
 */
export const ItemLabel: React.FC<ItemLabelProps> = ({
  label,
  accentColor = COLORS.greenBright,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 0.3초(9프레임) 등장, 퇴장은 8프레임
  const fadeIn = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const x = interpolate(frame, [0, 9], [-22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 84,
        left: 120,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 40,
      }}
    >
      <div style={{ width: 8, height: 42, borderRadius: 4, backgroundColor: accentColor }} />
      <div
        style={{
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 2,
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** 목양·목음편 라벨 순서 (사양서 A-4 — 섹션 3·4 동일) */
export const MOK_ITEM_LABELS = ['외형', '성격', '직업', '운동', '질병·건강법', '유명인'] as const;

/**
 * 검수용 단독 프리뷰 — [성격]→[직업] 전환(동시 노출 없음 확인)과
 * career 캡션 동시 노출 시 시선 분산 여부(사양서 A-3)를 함께 검수한다.
 */
export const ItemLabelPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Sequence durationInFrames={75}>
      <ItemLabel label="성격" accentColor={CONSTITUTION_ACCENTS.목양} />
    </Sequence>
    <Sequence from={75} durationInFrames={75}>
      <ItemLabel label="직업" accentColor={CONSTITUTION_ACCENTS.목양} />
    </Sequence>
    <Sequence from={75} durationInFrames={75}>
      <SafetyCaption kind="career" text="직업 적성은 경향이며, 진로 판단의 근거가 아닙니다." />
    </Sequence>
  </AbsoluteFill>
);

export const ITEM_LABEL_PREVIEW_FRAMES = 150;
