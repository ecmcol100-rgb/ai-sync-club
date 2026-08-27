import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CREDIT, FONT, IMAGES } from '../constants';
import { SourceCaptions } from './SourceCaptions';

export interface SelfDiagnosisWarningProps {
  /** 단계1 — 경고 리드. 이 구간에서 가장 큰 텍스트 */
  lead: string;
  /** 단계2 — 가변 요소 4개. 항목 라벨과 같은 명칭·형식으로 표시 */
  variables: string[];
  /** 단계3 — 강조 자막. 이 구간의 정점 */
  keyLine: string;
  /** 단계4 — 맥진 문안 (방법 설명 금지 — 위치 언급까지가 한계) */
  onlyWay: string;
  /** 단계5 — 대안. 부드럽게 끝난다 */
  fallback: string;
  /** 단계 1~5 시작 시각(초). 읽을 시간이 필요한 구간 — 여유 있게 */
  stageStartsSec?: [number, number, number, number, number];
  /** 맥진 실사 이미지 경로 (staticFile 기준). 없으면 텍스트만으로 렌더 */
  pulseImage?: string;
  /** 사진 출처 자막 (이미지 노출 구간에만 표시) */
  photoCredit?: string;
  /** 화면 출처 자막 */
  source?: string;
}

/**
 * SelfDiagnosisWarning — 자가진단 경계 화면 (섹션 5, 전 편 필수 구간)
 *
 * 두 방향의 실패를 피하는 균형이 목표 (사양서 1절): 겁을 주지도,
 * 흘려듣게 하지도 않는다. "9항목은 틀렸다"가 아니라 "9항목으로는
 * 확정할 수 없다" — 2-b 도식의 '부정이 아니라 확장'과 같은 원리.
 *
 * 톤 규칙 (사양서 4절 — 이 구간은 공포를 주면 실패):
 * - 붉은 경고색·위험 아이콘·느낌표 없음. 경고 리드도 흰색 타이포만
 * - 가변 요소 4개는 끝까지 온전하게 남는다 — X·지우기·회색 처리 없음.
 *   정점 문장(gold 강조)이 그 위에 서는 구도이지 요소를 훼손하지 않는다
 * - 금지문 반복 대신 사실 제시 — 화면 텍스트는 문안 그대로만
 * - 단계4부터 경고 톤 → 정보 톤 전환(장면 교체), 단계5는 조언 톤으로
 *   부드럽게 끝나 클로징(다음 편 예고)으로 넘어간다
 *
 * 맥진 (사양서 4절 표현 규칙):
 * - 방법·판별법을 그리지 않는다. 실사 이미지는 손 클로즈업(얼굴 없음)만
 * - "간단한 방법" 인상 금지 — 이미지도 시술 장면이 아닌 정적 컷
 *
 * 가변 요소는 ItemLabel과 같은 시각 언어(색 세로 바 + 텍스트)로 그려
 * "방금 본 항목들"로 즉시 인식되게 한다 (사양서 3절 2단계).
 * 발자국 y < 686. 섹션 5에는 disclaimer가 뜨지 않는다.
 */
export const SelfDiagnosisWarning: React.FC<SelfDiagnosisWarningProps> = ({
  lead,
  variables,
  keyLine,
  onlyWay,
  fallback,
  stageStartsSec = [0, 3, 6.5, 10.5, 15],
  pulseImage = IMAGES.pulseDiagnosis,
  photoCredit = CREDIT.ecmed,
  source = '출처: 빛과소금 94-5월호 · 95-5월호 / 월간조선 2011-5월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3, s4, s5] = stageStartsSec;

  // 읽을 시간이 필요한 구간 — 느린 페이드(0.8초)
  const slowIn = (startSec: number): number =>
    interpolate(frame, [startSec * fps, startSec * fps + 24], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const in1 = slowIn(s1);
  const in2 = slowIn(s2);
  const in3 = slowIn(s3);
  const in4 = slowIn(s4);
  const in5 = slowIn(s5);

  // 단계4에서 경고 톤 장면(1~3)이 물러나고 정보 톤 장면(4~5)이 들어온다
  const phaseAOut = 1 - in4;

  return (
    <>
      {/* ── 경고 톤 (단계 1~3) ───────────────────────────────────── */}
      <div style={{ opacity: phaseAOut }}>
        {/* 단계1 — 리드. 가장 큰 텍스트, 흰색 (경고색 없음) */}
        <div
          style={{
            position: 'absolute',
            top: 160,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: in1,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.35,
            whiteSpace: 'pre-line',
          }}
        >
          {lead}
        </div>

        {/* 단계2 — 가변 요소. ItemLabel과 같은 형식 → "방금 본 것"으로 인식 */}
        <div
          style={{
            position: 'absolute',
            top: 372,
            left: 0,
            right: 0,
            opacity: in2,
            display: 'flex',
            justifyContent: 'center',
            gap: 64,
          }}
        >
          {variables.map((v) => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 8, height: 42, borderRadius: 4, backgroundColor: COLORS.greenBright }} />
              <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 36, fontWeight: 800, letterSpacing: 2 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
        {/* 가변성 표시 — 나열만으로는 '왜 부족한지'가 전달되지 않는다 (사양서 5절) */}
        <div
          style={{
            position: 'absolute',
            top: 442,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: in2,
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          네 가지 모두 사람마다 가변적입니다
        </div>

        {/* 단계3 — 정점. gold 강조 (경고색 아님, 시리즈 강조 관례) */}
        <div
          style={{
            position: 'absolute',
            top: 512,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: in3,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              color: COLORS.gold,
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.35,
              whiteSpace: 'pre-line',
            }}
          >
            {keyLine}
            <div
              style={{
                height: 5,
                marginTop: 10,
                borderRadius: 3,
                backgroundColor: COLORS.gold,
                transform: `scaleX(${in3})`,
                opacity: 0.8,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── 정보·조언 톤 (단계 4~5) ──────────────────────────────── */}
      <div style={{ opacity: in4 }}>
        {/* 단계4 — 유일한 방법 (방법 설명 없음) */}
        <div style={{ position: 'absolute', left: 160, top: 170 }}>
          <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: 3 }}>
            맥진
          </div>
          <div
            style={{
              marginTop: 22,
              width: 980,
              color: COLORS.text,
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.45,
              whiteSpace: 'pre-line',
            }}
          >
            {onlyWay}
          </div>
        </div>

        {/* 맥진 실사 — 얼굴 없는 손 클로즈업. 시리즈에서 실사를 쓰는 드문 자리 */}
        {pulseImage ? (
          <div
            style={{
              position: 'absolute',
              left: 1250,
              top: 170,
              width: 470,
              height: 320,
              borderRadius: 20,
              overflow: 'hidden',
              border: `3px solid ${COLORS.green}`,
              boxShadow: '0 16px 44px rgba(0,0,0,0.45)',
            }}
          >
            <Img
              src={staticFile(pulseImage)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : null}

        {/* 단계5 — 대안. 조언 톤, 부드럽게 (경고 형식 없음) */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 420,
            width: 1180,
            opacity: in5,
            borderLeft: `5px solid ${COLORS.greenPale}`,
            paddingLeft: 34,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}
        >
          {fallback}
        </div>
      </div>

      <SourceCaptions
        cues={[
          { fromSec: 0, text: source },
          // 사진 출처는 실사 노출 구간(단계4~)에만
          ...(pulseImage ? [{ fromSec: s4, text: photoCredit }] : []),
        ]}
      />
    </>
  );
};

/** 목양·목음편 문안 (사양서 5절) */
export const MOK_SELF_DIAGNOSIS: Pick<
  SelfDiagnosisWarningProps,
  'lead' | 'variables' | 'keyLine' | 'onlyWay' | 'fallback'
> = {
  lead: '이 영상만 보고\n스스로 체질을 판단하지 마십시오',
  variables: ['성격', '체형', '직업 적성', '음식 기호'],
  keyLine: '이것들을 다 모아도\n체질을 확정할 수는 없습니다',
  onlyWay: '체질을 아는 방법은\n양쪽 손목의 요골동맥을 짚는 팔체질 맥진뿐입니다',
  fallback:
    '체질을 모르는 상태에서 섣불리 체질식을 하면\n오히려 건강을 해칠 수 있습니다\n\n권도원 박사님은 그런 경우라면\n차라리 골고루 드시는 편이 낫다고 하셨습니다',
};

export const SELF_DIAGNOSIS_PREVIEW_FRAMES = 20 * 30;

/** 검수용 단독 프리뷰 — 섹션 5에는 disclaimer가 뜨지 않는다 */
export const SelfDiagnosisWarningPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <SelfDiagnosisWarning {...MOK_SELF_DIAGNOSIS} />
  </AbsoluteFill>
);
