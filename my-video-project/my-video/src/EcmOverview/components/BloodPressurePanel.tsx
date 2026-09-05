import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';
import { ItemLabel } from './ItemLabel';
import { SafetyCaption } from './SafetyCaption';
import { SourceCaptions } from './SourceCaptions';
import { Subtitles } from './Subtitles';

export interface BloodPressurePanelProps {
  /** ① 8체질의학의 관점 — 시각적으로 강조하지 않는다 */
  claim: string;
  /** ② 근거의 성격 — ①에 부기로 붙어 성격을 규정한다 */
  evidenceNote: string;
  /** ③ 현대 의학의 지견 — 독립 블록으로 ①과 대등하게 선다 */
  modernView: string;
  /** 단계 1~3 시작 시각(초). 이 구간은 내레이션이 감속되므로 여유 있게 */
  stageStartsSec?: [number, number, number];
  /** 화면 출처 자막 */
  source?: string;
}

/**
 * BloodPressurePanel — 혈압 문단 화면 (섹션 3-f 내부)
 *
 * 이 영상에서 규제 위험이 가장 큰 구간 — 목표는 정보 전달이 아니라
 * 오해 방지다 (사양서 1절). 층위 구분이 화면의 전부:
 *
 * - ①(관점)은 강조하지 않는다 — 보통 굵기·중립색. 이 구간에서 강조될 것은
 *   ④(행동 지침)뿐이고, ④는 이 컴포넌트가 아니라 SafetyCaption medical이
 *   그린다 (상위에서 구간 전체에 배치)
 * - ②(근거의 성격)는 ① 카드 안에 부기로 붙어 주장의 성격을 규정한다.
 *   ①보다 굵게 — 층위 표의 무게(② 강함 > ① 보통)를 그대로 시각화
 * - ③(현대 의학)은 같은 크기·같은 테두리의 독립 카드로 대등하게 병치.
 *   어느 쪽이 옳다는 판정 표현·색 차이를 두지 않는다 — 대결이 아니라 병치
 * - 수치·혈압계·심장·혈관 이미지 없음 (사양서 4절)
 * - 전환은 다른 구간보다 느리게 — 페이드 0.8초 (급히 지나가는 인상 방지)
 * - 발자국 y < MEDICAL_CONTENT_MAX_Y(580) — 이 화면만 한계가 낮다. medical
 *   띠(596~676)가 본문 바로 아래에 서기 때문 (bottomLayout.ts). 카드 높이는
 *   문안에 따라 정해지므로 CARD_TOP은 실측(BottomLayoutSheet)으로 검증한다
 *
 * 문안은 학회 공식 채널 표현으로 확정된 것 (사양서 7절) —
 * MOK_BLOOD_PRESSURE 데이터를 임의로 바꾸지 말 것.
 */
/**
 * 카드 위 모서리. 항목 라벨(top 84, 높이 42) 아래 14px. 좌측 카드(문안이 더
 * 길다)가 MEDICAL_CONTENT_MAX_Y(580) 위에서 끝나도록 잡은 값 — 실측 ~566
 */
const CARD_TOP = 140;

export const BloodPressurePanel: React.FC<BloodPressurePanelProps> = ({
  claim,
  evidenceNote,
  modernView,
  stageStartsSec = [0, 3.5, 7],
  source = '출처: 빛과소금 94-8월호 / 미래한국 2009',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3] = stageStartsSec;

  // 느린 전환 — 0.8초(24프레임) 페이드 (사양서 4절 리듬 규칙)
  const slowIn = (startSec: number): number =>
    interpolate(frame, [startSec * fps, startSec * fps + 24], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const in1 = slowIn(s1);
  const in2 = slowIn(s2);
  const in3 = slowIn(s3);

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    top: CARD_TOP,
    width: 780,
    minHeight: 380,
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '2px solid rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: '32px 44px',
  };

  const headerStyle: React.CSSProperties = {
    color: COLORS.textDim,
    fontFamily: FONT,
    fontSize: 27,
    fontWeight: 700,
    letterSpacing: 3,
  };

  return (
    <>
      {/* 좌 — ① 관점 + ② 근거의 성격 (부기) */}
      <div data-probe="card-left" style={{ ...cardStyle, left: 140, opacity: in1 }}>
        <div style={headerStyle}>8체질의학의 관점</div>
        {/* ① — 보통 무게. 강조 없음 */}
        <div
          style={{
            marginTop: 26,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 500,
            lineHeight: 1.55,
            whiteSpace: 'pre-line',
          }}
        >
          {claim}
        </div>
        {/* ② — ①에 붙는 꼬리표. ①보다 강한 무게 */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 22,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            opacity: in2,
          }}
        >
          <div style={{ ...headerStyle, fontSize: 24 }}>근거의 성격</div>
          <div
            style={{
              marginTop: 12,
              color: COLORS.text,
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {evidenceNote}
          </div>
        </div>
      </div>

      {/* 우 — ③ 현대 의학. 같은 크기·테두리의 독립 카드 (대등 병치) */}
      <div data-probe="card-right" style={{ ...cardStyle, left: 1000, opacity: in3 }}>
        <div style={headerStyle}>현대 의학</div>
        <div
          style={{
            marginTop: 26,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1.55,
            whiteSpace: 'pre-line',
          }}
        >
          {modernView}
        </div>
      </div>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

/** 목양·목음편 확정 문안 (사양서 5절·7절 — 임의 수정 금지) */
export const MOK_BLOOD_PRESSURE = {
  claim: '혈압이 일반 평균보다 약간 높게 나오더라도\n그 자체를 크게 문제 삼을 일은 아니다',
  evidenceNote:
    '현대 의학의 임상 연구로 검증된 내용이 아니라\n권도원 박사님의 임상 관찰과 저술에 근거한 관점',
  // 줄바꿈 위치만 카드 폭에 맞춘 조판 조정 — 문구 자체는 확정 문안 그대로
  modernView: '고혈압은 현대 의학에서\n뇌졸중과 심근경색의 위험 요인으로\n확립되어 있습니다',
} as const;

export const BP_PREVIEW_FRAMES = 12 * 30;

/**
 * 검수용 프리뷰 — 실제 배치 그대로: 본문 + medical(1초~) + disclaimer(상시) +
 * 출처 + 내레이션 자막(60px 2줄). 하단 스택이 전부 서는 유일한 화면이라
 * 하단 레이아웃 검수는 이 컴포지션으로 한다.
 *
 * 내레이션 문구는 [측정용 임시] — TTS 대본이 저장소에 없어 실제 문안이 아니다.
 * 두 줄이 꽉 차는 길이(줄당 한글 약 22자)로 상자 최대 크기를 확인한다.
 */
export const BP_NARRATION_PROBE = [
  {
    fromSec: 0,
    text: ['내레이션 자막 측정용 임시 문장입니다 — 60픽셀 두 줄', '실제 문안은 TTS 대본 확정 후 이 자리에 교체합니다'].join('\n'),
  },
];

export const BloodPressurePanelPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <ItemLabel label="질병·건강법" accentColor={CONSTITUTION_ACCENTS.목양} />
    <BloodPressurePanel {...MOK_BLOOD_PRESSURE} />
    <Sequence from={30}>
      <SafetyCaption
        kind="medical"
        text="복용 중인 혈압약을 임의로 중단하지 마시고 반드시 담당 의사와 상의하십시오."
      />
    </Sequence>
    <SafetyCaption
      kind="disclaimer"
      text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
    />
    <Subtitles cues={BP_NARRATION_PROBE} />
  </AbsoluteFill>
);
