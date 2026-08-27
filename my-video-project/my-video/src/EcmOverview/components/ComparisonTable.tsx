import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, CONTENT_MAX_Y, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';
import { SafetyCaption } from './SafetyCaption';
import { ConstitutionName } from './ConstitutionName';

export interface ComparisonRow {
  label: string;
  /** 체질 A 내용. '\n' 줄바꿈 지원 */
  left: string;
  /** 체질 B 내용 */
  right: string;
  /** true면 좌우 병합 셀로 렌더 (음식 항목 — 두 체질 공통) */
  shared?: boolean;
}

export interface ComparisonTableProps {
  leftTitle: string;
  leftSub: string;
  rightTitle: string;
  rightSub: string;
  /** 9행 — 줄이거나 합치지 말 것 (사양서 5절) */
  rows: ComparisonRow[];
  /** 출처 자막 문구 */
  source: string;
}

/**
 * 표 세로 배치(px).
 *
 * 이 컴포넌트가 CONTENT_MAX_Y 제약을 가장 크게 받는다 — 9행+헤더를 넣기 위해
 * 행 높이는 내용 줄 수로 계산한다(1줄 행 40px, 2줄 행 70px). 목양·목음편
 * 데이터(1줄×5, 2줄×4) 기준 총높이 68+5×41+4×71 = 557 → 표 하단 y 653 < 686.
 * 다른 편에서 줄 수가 늘어 686을 넘으면 글자를 줄이기 전에 행 여백(PAD_Y)을
 * 먼저 조정할 것 (사양서 4절 — 가독성 최우선).
 */
const TABLE_TOP = 96;
const TABLE_W = 1720;
const TABLE_LEFT = (1920 - TABLE_W) / 2;
const LABEL_W = 180;
const COL_W = (TABLE_W - LABEL_W) / 2;
const HEADER_H = 68;
const LINE_H = 30;
const PAD_Y = 5;

const rowLines = (r: ComparisonRow): number =>
  Math.max(r.left.split('\n').length, r.right.split('\n').length, 1);

const rowHeight = (r: ComparisonRow): number => rowLines(r) * LINE_H + PAD_Y * 2;

/** 표 전체 높이 — 검수·컴포지션 길이 계산용으로 내보낸다 */
export const comparisonTableHeight = (rows: ComparisonRow[]): number =>
  HEADER_H + rows.reduce((acc, r) => acc + rowHeight(r) + 1, 0);

/**
 * 행 데이터가 본문 발자국 한계(CONTENT_MAX_Y) 안에 들어가는지 검사.
 * 다른 편 데이터를 넣을 때 이 값이 false면 글자를 줄이기 전에
 * PAD_Y·행 여백부터 조정할 것 (사양서 4절 — 가독성 최우선).
 */
export const comparisonTableFits = (rows: ComparisonRow[]): boolean =>
  TABLE_TOP + comparisonTableHeight(rows) <= CONTENT_MAX_Y - 14;

/**
 * ComparisonTable — 9항목 대조표 (섹션 4-h)
 *
 * 20초 정지 노출·내레이션 없음·스크린샷 저장 지점이라는 성격에 따라
 * 애니메이션은 전체 페이드인 하나뿐이다 (사양서 5절 — 행별 순차 등장 금지).
 *
 * - shared 행은 좌우 병합 셀 — 두 체질의 공통 항목이 시각적으로 드러난다.
 *   병합 셀은 어느 한쪽에 속하지 않도록 중립색으로 그린다
 * - 체질 시그니처 컬러(CONSTITUTION_ACCENTS)는 헤더와 테두리에만 쓰고
 *   본문 텍스트는 흰색 계열로 가독성을 지킨다. 항목 라벨 열은 중립색
 * - 표 전체가 CONTENT_MAX_Y(686) 위에서 끝난다 — 하단 disclaimer와 안 겹침
 * - '\n' 줄바꿈 지원 (whiteSpace: pre-line)
 */
export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  leftTitle,
  leftSub,
  rightTitle,
  rightSub,
  rows,
  source,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftAccent =
    CONSTITUTION_ACCENTS[leftTitle.slice(0, 2) as keyof typeof CONSTITUTION_ACCENTS] ??
    COLORS.greenBright;
  const rightAccent =
    CONSTITUTION_ACCENTS[rightTitle.slice(0, 2) as keyof typeof CONSTITUTION_ACCENTS] ??
    COLORS.blue;

  const cellText: React.CSSProperties = {
    color: COLORS.text,
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: 500,
    lineHeight: `${LINE_H}px`,
    whiteSpace: 'pre-line',
    textAlign: 'center',
  };

  const HeaderCell: React.FC<{ title: string; sub: string; accent: string }> = ({
    title,
    sub,
    accent,
  }) => (
    <div
      style={{
        width: COL_W,
        height: HEADER_H,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${accent}2E`,
        borderTop: `4px solid ${accent}`,
      }}
    >
      {/* 체질명 — 확정 색 칩 (밴드 틴트·상단 바의 시그니처색은 그래픽으로 유지) */}
      <ConstitutionName name={title} fontSize={28} />
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 19, fontWeight: 600 }}>{sub}</div>
    </div>
  );

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: TABLE_LEFT,
          top: TABLE_TOP,
          width: TABLE_W,
          opacity: fadeIn,
          backgroundColor: COLORS.bgSoft,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        {/* 헤더 — 라벨 자리 + 체질 A/B. 썸네일로 잘라도 이 영역만으로 주제가 읽힌다 */}
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: LABEL_W,
              height: HEADER_H,
              backgroundColor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textDim,
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            9항목
          </div>
          <HeaderCell title={leftTitle} sub={leftSub} accent={leftAccent} />
          <HeaderCell title={rightTitle} sub={rightSub} accent={rightAccent} />
        </div>

        {rows.map((r, i) => {
          const h = rowHeight(r);
          return (
            <div key={i} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {/* 항목 라벨 — 중립색 */}
              <div
                style={{
                  width: LABEL_W,
                  height: h,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.greenPale,
                  fontFamily: FONT,
                  fontSize: 23,
                  fontWeight: 700,
                }}
              >
                {r.label}
              </div>

              {r.shared ? (
                // 병합 셀 — 두 체질 공통. 중립색 배경으로 어느 쪽에도 속하지 않음
                <div
                  style={{
                    width: COL_W * 2,
                    height: h,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={cellText}>{r.left}</div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: COL_W,
                      height: h,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      borderLeft: `2px solid ${leftAccent}40`,
                    }}
                  >
                    <div style={cellText}>{r.left}</div>
                  </div>
                  <div
                    style={{
                      width: COL_W,
                      height: h,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: `2px solid ${rightAccent}40`,
                    }}
                  >
                    <div style={cellText}>{r.right}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

/** 목양·목음편 데이터 (사양서 3절) */
export const MOK_COMPARISON: ComparisonTableProps = {
  leftTitle: '목양체질',
  leftSub: '木陽 · Hepatonia',
  rightTitle: '목음체질',
  rightSub: '木陰 · Cholecystonia',
  rows: [
    {
      label: '장기강약',
      left: '간이 선두 / 폐·대장이 약한 자리',
      right: '담낭이 선두 / 폐·대장이 약한 자리',
    },
    {
      label: '외형',
      left: '풍채 좋고 체구 큰 편\n어깨 좁고 허리가 굵음',
      right: '팔다리 길고 손발이 큼\n근육 발달',
    },
    {
      label: '성격',
      left: '과묵, 인자\n따지기 싫어함',
      right: '감성적, 급하나 독하지 못함\n봉사적',
    },
    { label: '직업', left: '독자 사업, 투자, 기계공학', right: '교육계, 기계공학' },
    { label: '운동', left: '등산, 땀 내는 운동, 사우나', right: '던지고 차는 구기 종목' },
    {
      label: '질병',
      left: '채식 시 피로·눈 통증\n혈압이 다소 높은 편',
      right: '대변 잦음, 배꼽 주위 불편\n절주 필요',
    },
    {
      label: '음식',
      shared: true,
      left: '육식 · 무 · 당근 · 도라지 · 마늘 · 버섯 · 호박\n해물 · 푸른 잎채소 · 포도 주의',
      right: '',
    },
    { label: '건강법', left: '온수욕 + 전신 발한', right: '온수욕 + 하복부 보온' },
    { label: '유명인', left: '이병철 · 전두환 · 육영수', right: '김영삼 · 이건희 · 김용옥' },
  ],
  source: '출처: 빛과소금 94~99년 / 8체질의학론 개요(2003) / 생기능의학 교재(2008)',
};

/** 20초 정지 노출 (사양서 1절) */
export const COMPARISON_PREVIEW_FRAMES = 20 * 30;

/**
 * 검수용 단독 프리뷰 — 실제 4-h 화면처럼 disclaimer 상시 노출을 겹쳐
 * 표와 자막이 겹치지 않는 것까지 함께 검수한다.
 */
export const ComparisonTablePreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <ComparisonTable {...MOK_COMPARISON} />
    <SafetyCaption
      kind="disclaimer"
      text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
    />
  </AbsoluteFill>
);
