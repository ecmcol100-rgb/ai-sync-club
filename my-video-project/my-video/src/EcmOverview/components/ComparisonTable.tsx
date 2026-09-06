import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';
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
 * ★ 이 화면만 본문 발자국 한계가 CONTENT_MAX_Y(686)가 아니라
 * TABLE_MAX_Y(880)다 — 4-h 대조표는 무음 20초 구간이라 내레이션 자막이
 * 없고(narration.ts 빈 cue 센티널), 읽으라고 세운 화면이라 가독성을
 * 우선해 자막 슬롯까지 확장한다 (2026-09-06 원장님 지시).
 * 출처·disclaimer는 표 아래(896~980)로 하향 — 유튜브 진행바가 하단
 * 약 80~100px을 덮으므로 980을 넘기지 않는다.
 *
 * 행 높이는 내용 줄 수로 계산한다(1줄 행 54px, 2줄 행 98px). 목양·목음편
 * 데이터(1줄×5, 2줄×4) 기준 총높이 125+5×55+4×99 = 796 → 표 y 84~880.
 * 다른 편에서 줄 수가 늘어 한계를 넘으면 글자를 줄이기 전에 행 여백(PAD_Y)을
 * 먼저 조정할 것 (사양서 4절 — 가독성 최우선).
 */
const TABLE_TOP = 84;
const TABLE_W = 1800;
const TABLE_LEFT = (1920 - TABLE_W) / 2;
const LABEL_W = 180;
const COL_W = (TABLE_W - LABEL_W) / 2;
const HEADER_H = 125;
const LINE_H = 44;
const PAD_Y = 5;

/**
 * 4-h 대조표 전용 발자국 상한. 자막 없는 구간이라 슬롯 침범 허용 —
 * 그 외 전 화면은 CONTENT_MAX_Y(686)를 따른다.
 */
export const TABLE_MAX_Y = 880;

const rowLines = (r: ComparisonRow): number =>
  Math.max(r.left.split('\n').length, r.right.split('\n').length, 1);

const rowHeight = (r: ComparisonRow): number => rowLines(r) * LINE_H + PAD_Y * 2;

/** 표 전체 높이 — 검수·컴포지션 길이 계산용으로 내보낸다 */
export const comparisonTableHeight = (rows: ComparisonRow[]): number =>
  HEADER_H + rows.reduce((acc, r) => acc + rowHeight(r) + 1, 0);

/**
 * 행 데이터가 대조표 전용 상한(TABLE_MAX_Y) 안에 들어가는지 검사.
 * 이 화면은 CONTENT_MAX_Y(686) 검사 대상이 아니다 — 검사를 없애지 말고
 * 이 함수로 대체한다. 다른 편 데이터를 넣을 때 false면 글자를 줄이기 전에
 * PAD_Y·행 여백부터 조정할 것 (사양서 4절 — 가독성 최우선).
 */
export const comparisonTableFits = (rows: ComparisonRow[]): boolean =>
  TABLE_TOP + comparisonTableHeight(rows) <= TABLE_MAX_Y;

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
    fontSize: 35,
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
      <ConstitutionName name={title} fontSize={38} />
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 26, fontWeight: 600 }}>{sub}</div>
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
              fontSize: 27,
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
                  fontSize: 35,
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

      {/* 출처 — 표가 자막 슬롯까지 내려오므로 표 아래(y 896~936)로 하향 */}
      <SourceCaptions cues={[{ fromSec: 0, text: source }]} bottomOverride={144} />
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
      // v6 51항 — 주도 장부 기준 하나씩 (좌우가 서로 다른 장부를 가리킴)
      left: '간이 선두 / 폐가 약한 자리',
      right: '담낭이 선두 / 대장이 약한 자리',
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
      // v6 45항 — 이로운 음식 문맥이므로 소고기 병기
      left: '육식(특히 소고기) · 무 · 당근 · 도라지 · 마늘 · 버섯 · 호박\n해물 · 푸른 잎채소 · 포도 주의',
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
    {/* 실전(index.tsx)과 동일 — 대조표 구간은 disclaimer를 표 아래(938~980)로 하향 */}
    <SafetyCaption
      kind="disclaimer"
      text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
      bottomOverride={100}
    />
  </AbsoluteFill>
);
