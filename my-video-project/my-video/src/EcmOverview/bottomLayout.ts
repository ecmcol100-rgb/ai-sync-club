import { createContext, useContext } from 'react';

/**
 * 화면 하단 레이아웃 — 본문 발자국 한계 아래 영역의 단일 원천 (1080p 기준).
 *
 * 하단은 위→아래로 이렇게 쌓인다 (시리즈 프로파일):
 *
 *   ┄┄ CONTENT_MAX_Y(686) ┄┄  본문은 이 선 위에서 끝난다
 *   [career/addiction ─ 좌]  [출처 ─ 우]     ← 항목 행 (한 행 공유)
 *   [disclaimer ─ 중앙]                        ← 상시
 *   [내레이션 자막 ─ 중앙, 60px 2줄]            ← 하단 여백 위
 *
 * medical(의료 경고)은 이 스택에 자리를 예약하지 않는다. 혈압 구간 한 곳에만
 * 뜨는데 그 구간의 본문(BloodPressurePanel)만 짧으므로, 본문 바로 아래·항목
 * 행 위(y 596~676)에 띄운다. 이렇게 하면 나머지 96%의 시간 동안 비어 있을
 * 80px 띠를 본문에 돌려줄 수 있고, 아래 자막들은 medical이 뜨든 지든
 * 위치가 변하지 않는다. 대신 혈압 화면의 본문은 MEDICAL_CONTENT_MAX_Y 위에서
 * 끝나야 한다 (BloodPressurePanel 참조).
 *
 * ★ medical 띠(80px)는 압축 대상이 아니다 — 시인성 최상위 규칙.
 *
 * 개괄영상(EcmOverview)은 v5 확정 렌더를 보존해야 하므로 LEGACY 프로파일을
 * 컨텍스트로 주입한다 (EcmOverview/index.tsx). 그 외 모든 컴포지션은 기본값인
 * SERIES 프로파일을 쓴다.
 */

export const FRAME_H = 1080;

/**
 * ★ 본문 컴포넌트의 세로 발자국 한계(px). 불변 계약 (CLAUDE.md).
 * 본문 그래픽은 애니메이션 최대 이동 범위까지 포함해 이 선 위에서 끝난다.
 */
export const CONTENT_MAX_Y = 686;

/** 하단 스택 치수 — 값을 바꾸면 아래 파생 y가 모두 따라온다 */
export const BOTTOM_STACK = {
  /** career/addiction(좌)·출처(우) 공용 행 */
  itemRowH: 48,
  gapItemDisclaimer: 10,
  disclaimerH: 42,
  gapDisclaimerNarration: 12,
  /** medical 띠 — 압축 금지 */
  medicalH: 80,
  gapMedicalContent: 16,
  gapMedicalItem: 10,
} as const;

/* ── 파생 y (top 기준) ─────────────────────────────────────────── */
export const ITEM_ROW_TOP = CONTENT_MAX_Y; // 686
export const ITEM_ROW_BOTTOM = ITEM_ROW_TOP + BOTTOM_STACK.itemRowH; // 734
export const DISCLAIMER_TOP = ITEM_ROW_BOTTOM + BOTTOM_STACK.gapItemDisclaimer; // 744
export const DISCLAIMER_BOTTOM = DISCLAIMER_TOP + BOTTOM_STACK.disclaimerH; // 786
/** 내레이션 2줄 상자의 위 모서리 — 이 아래는 내레이션 전용 */
export const NARRATION_TOP = DISCLAIMER_BOTTOM + BOTTOM_STACK.gapDisclaimerNarration; // 798

export const MEDICAL_BOTTOM = CONTENT_MAX_Y - BOTTOM_STACK.gapMedicalItem; // 676
export const MEDICAL_TOP = MEDICAL_BOTTOM - BOTTOM_STACK.medicalH; // 596
/** medical이 떠 있는 화면(혈압)의 본문 발자국 한계 */
export const MEDICAL_CONTENT_MAX_Y = MEDICAL_TOP - BOTTOM_STACK.gapMedicalContent; // 580

/* ── 내레이션 자막 프로파일 ─────────────────────────────────────── */
export interface NarrationStyle {
  fontSize: number;
  emphasisFontSize: number;
  lineHeight: number;
  padY: number;
  padX: number;
  emphasisPadY: number;
  emphasisPadX: number;
  maxWidth: number;
  /** 상자 아래 모서리의 화면 하단으로부터 거리 */
  bottom: number;
}

/* ── 출처 자막 프로파일 ─────────────────────────────────────────── */
export interface SourceStyle {
  fontSize: number;
  creditFontSize: number;
  right: number;
  bottom: number;
  /** 항목 행 높이에 맞춰 세로 중앙 정렬할 때의 행 높이. 0이면 정렬 없음 */
  rowH: number;
  /** 한 줄 폭 상한 — 이 값을 넘는 문구는 간략 표기로 줄인다 */
  maxLineW: number;
  /** 행간. 생략 시 브라우저 기본(legacy 렌더 보존용) */
  lineHeight?: number;
}

export interface BottomLayoutProfile {
  name: 'series' | 'legacy';
  narration: NarrationStyle;
  source: SourceStyle;
}

/** 내레이션 2줄 상자 높이 */
export const narrationBoxHeight = (n: NarrationStyle, lines = 2): number =>
  Math.round(n.fontSize * n.lineHeight * lines + n.padY * 2);

const SERIES_NARRATION_BASE = {
  fontSize: 60,
  emphasisFontSize: 60,
  lineHeight: 1.4,
  padY: 18,
  padX: 44,
  emphasisPadY: 18,
  emphasisPadX: 52,
  maxWidth: 1560,
};

/**
 * 시리즈 프로파일 (목양·목음편부터). 내레이션 상자는 아래 모서리를 고정하고
 * 위로 자라므로, 2줄일 때 위 모서리가 정확히 NARRATION_TOP에 닿도록 bottom을
 * 역산한다 — 1줄 자막은 같은 바닥선에 붙고 위쪽만 짧아진다.
 */
export const SERIES_LAYOUT: BottomLayoutProfile = {
  name: 'series',
  narration: {
    ...SERIES_NARRATION_BASE,
    bottom: FRAME_H - NARRATION_TOP - narrationBoxHeight(SERIES_NARRATION_BASE as NarrationStyle),
  },
  source: {
    fontSize: 24,
    creditFontSize: 20,
    right: 120,
    bottom: FRAME_H - ITEM_ROW_BOTTOM,
    rowH: BOTTOM_STACK.itemRowH,
    lineHeight: 1.2,
    // 24px 기준 한글 약 41자. career 상자(좌, ~600px)와 같은 행을 쓰므로
    // 1920 - 120(좌) - 600 - 40(간격) - 120(우) 안에서 끝나야 한다
    maxLineW: 1000,
  },
};

/** 개괄영상 v5 확정 렌더 값 — 바꾸지 말 것 */
export const LEGACY_LAYOUT: BottomLayoutProfile = {
  name: 'legacy',
  narration: {
    fontSize: 40,
    emphasisFontSize: 54,
    lineHeight: 1.5,
    padY: 20,
    padX: 40,
    emphasisPadY: 24,
    emphasisPadX: 52,
    maxWidth: 1500,
    bottom: 56,
  },
  source: {
    fontSize: 31,
    creditFontSize: 24,
    right: 28,
    bottom: 235,
    rowH: 0,
    maxLineW: 1300,
  },
};

export const BottomLayoutContext = createContext<BottomLayoutProfile>(SERIES_LAYOUT);

/** 현재 컴포지션의 하단 레이아웃 프로파일 */
export const useBottomLayout = (): BottomLayoutProfile => useContext(BottomLayoutContext);
