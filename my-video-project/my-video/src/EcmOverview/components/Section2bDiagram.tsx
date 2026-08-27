import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONTENT_MAX_Y, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';

export interface Section2bProps {
  /**
   * 단계 1~4의 시작 시각(초). 길이 하드코딩 금지 — 오디오 확보 후
   * 내레이션에 맞춰 이 값만 조정한다. 전체 길이는 상위 Sequence가 결정.
   */
  stageStartsSec?: [number, number, number, number];
  source?: string;
}

/** 단계 페이드 공통 (0.4초) */
const useStageIn = (frame: number, fps: number, startSec: number): number =>
  interpolate(frame, [startSec * fps, startSec * fps + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 칩 — 개괄편 Section02 OrganChip과 동일 톤 (흰 6% 바탕 + 2px 색 테두리) */
const Chip: React.FC<{
  label: string;
  color: string;
  opacity: number;
  style?: React.CSSProperties;
}> = ({ label, color, opacity, style }) => (
  <div
    style={{
      opacity,
      backgroundColor: 'rgba(255,255,255,0.06)',
      border: `2px solid ${color}`,
      borderRadius: 12,
      padding: '18px 30px',
      textAlign: 'center',
      color: COLORS.text,
      fontFamily: FONT,
      fontSize: 32,
      fontWeight: 700,
      whiteSpace: 'pre-line',
      ...style,
    }}
  >
    {label}
  </div>
);

/** 시작→끝 화살표 (SVG 선 + 회전 삼각촉) */
const ArrowLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  opacity: number;
  label?: string;
  labelDx?: number;
  labelDy?: number;
}> = ({ x1, y1, x2, y2, color, opacity, label, labelDx = 0, labelDy = 0 }) => {
  const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={6} />
      <g transform={`rotate(${deg} ${x2} ${y2})`}>
        <polygon points={`${x2 + 14},${y2} ${x2 - 8},${y2 - 10} ${x2 - 8},${y2 + 10}`} fill={color} />
      </g>
      {label ? (
        <text
          x={(x1 + x2) / 2 + labelDx}
          y={(y1 + y2) / 2 + labelDy}
          fill={color}
          fontFamily={FONT}
          fontSize={30}
          fontWeight={800}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

/**
 * Section2b — 담즙·길항 도식 (목양·목음편 섹션 2)
 *
 * "그런데"의 전환을 부정이 아니라 확장으로 보여준다 (사양서 B-1):
 * 1단계(간→담즙→육식 소화)는 끝까지 화면에 남고, 2단계에서 그 아래로
 * 길항 구도가 열린다. 앞 내용에 X를 치거나 지우는 연출은 없다.
 *
 * 색 규칙 (사양서 B-3):
 * - 화살표 방향이 논리 — 육식·뿌리채소→약한 쪽(보강, greenBright) /
 *   해물·잎채소→강한 쪽(과잉, red). 두 음식 칩·화살표를 좌우 대칭으로
 *   배치하고, 개괄편 과불균형 도식의 green=적정·red=과잉 의미 체계를
 *   그대로 잇는다. 상단 흐름의 "육식"에서 직접 내려오는 화살표는 두지
 *   않는다 — 육식이 화면에 두 번 등장하는 중복을 피한다
 * - 강한 쪽은 gold(주의 계열)·약한 쪽은 blue — 강한 쪽이 "좋은 쪽"으로
 *   보이지 않게 밝은 긍정색을 피한다
 * - 카드·칩 형식은 개괄편 Section02(BalanceDiagram·OrganChip)와 동일 톤.
 *   해당 컴포넌트가 씬 로컬이라 export되지 않아 스타일만 통일했다
 *
 * 음식 품목 나열·육식동물 대장 비유는 이 도식에 넣지 않는다 (별도 자막/컷).
 * 발자국은 CONTENT_MAX_Y(686) 안에서 끝난다 (최하단 요소 y 649).
 */
export const Section2bDiagram: React.FC<Section2bProps> = ({
  stageStartsSec = [0, 3.5, 6.5, 10],
  source = '출처: 빛과소금 94-5월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3, s4] = stageStartsSec;

  const in1 = useStageIn(frame, fps, s1);
  const in2 = useStageIn(frame, fps, s2);
  const in3 = useStageIn(frame, fps, s3);
  const in4 = useStageIn(frame, fps, s4);

  const Card: React.FC<{
    title: string;
    sub: string;
    color: string;
    left: number;
  }> = ({ title, sub, color, left }) => (
    <div
      style={{
        position: 'absolute',
        left,
        top: 310,
        width: 640,
        height: 200,
        opacity: in2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: `3px solid ${color}`,
        borderRadius: 20,
        padding: '30px 40px',
      }}
    >
      <div style={{ color, fontFamily: FONT, fontSize: 46, fontWeight: 900 }}>{title}</div>
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 28, fontWeight: 600, marginTop: 12 }}>
        {sub}
      </div>
    </div>
  );

  return (
    <>
      {/* 단계1 — 간 → 담즙 → 육식 소화. 이후 단계에서도 사라지지 않는다 */}
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 22,
          opacity: in1,
        }}
      >
        <Chip label="간(肝)" color={COLORS.greenPale} opacity={1} />
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 40, fontWeight: 700 }}>→</div>
        <Chip label="담즙" color={COLORS.greenPale} opacity={1} />
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 40, fontWeight: 700 }}>→</div>
        <Chip label="육식을 잘 소화" color={COLORS.greenPale} opacity={1} />
      </div>

      {/* 단계2 — 화면 확장: 길항 구도 */}
      <Card title="강한 쪽 — 간·담낭" sub="이미 충분한 자리 · 지나치기 쉬움" color={COLORS.gold} left={210} />
      <Card title="약한 쪽 — 폐·대장" sub="약한 자리 · 보강이 필요" color={COLORS.blue} left={1070} />
      <div
        style={{
          position: 'absolute',
          top: 386,
          left: 850,
          width: 220,
          textAlign: 'center',
          opacity: in2,
          color: COLORS.textDim,
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        ↔
        <br />
        길항 관계
      </div>

      {/* 단계3 — 보강 방향 음식 칩 (우하단, 약한 쪽 카드 아래).
          상단 흐름의 "육식"과 중복되지 않도록 화살표는 이 칩에서만 출발한다 */}
      <Chip
        label="육식 · 뿌리채소"
        color={COLORS.greenBright}
        opacity={in3}
        style={{ position: 'absolute', right: 230, top: 578, fontSize: 28, padding: '14px 26px' }}
      />

      {/* 단계4 — 반대 방향 음식 칩 (좌하단, 강한 쪽 카드 아래) — 좌우 대칭 */}
      <Chip
        label="해물 · 푸른 잎채소"
        color={COLORS.red}
        opacity={in4}
        style={{ position: 'absolute', left: 230, top: 578, fontSize: 28, padding: '14px 26px' }}
      />

      {/* 단계3·4 — 방향 화살표 (SVG 오버레이) */}
      <svg
        viewBox={`0 0 1920 ${CONTENT_MAX_Y}`}
        style={{ position: 'absolute', top: 0, left: 0, width: 1920, height: CONTENT_MAX_Y }}
      >
        {/* 육식·뿌리채소(우하단) → 약한 쪽: 보강 — 과잉 화살표와 좌우 대칭 */}
        <ArrowLine
          x1={1500}
          y1={572}
          x2={1440}
          y2={524}
          color={COLORS.greenBright}
          opacity={in3}
          label="보강"
          labelDx={-82}
          labelDy={14}
        />
        {/* 해물·잎채소(좌하단) → 강한 쪽: 과잉 */}
        <ArrowLine
          x1={420}
          y1={572}
          x2={480}
          y2={524}
          color={COLORS.red}
          opacity={in4}
          label="과잉"
          labelDx={82}
          labelDy={14}
        />
      </svg>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

export const SECTION2B_PREVIEW_FRAMES = 14 * 30;

/** 검수용 단독 프리뷰 */
export const Section2bPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Section2bDiagram />
  </AbsoluteFill>
);
