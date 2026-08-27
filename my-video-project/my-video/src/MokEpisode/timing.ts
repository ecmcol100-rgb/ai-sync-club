/**
 * 목양·목음편 타이밍 상수 — 조립 사양서(docs/episode_assembly_spec.md) 1절.
 *
 * ★ 모든 길이는 이 파일에서만 온다. 컴포넌트·조립부에 프레임 수를 직접
 * 쓰지 않는다. 오디오 확보 후 이 파일의 초 단위 값만 실측으로 교체하면
 * 전체 배선이 따라온다 (문단 구간은 섹션 길이를 글자 수 비율로 분배).
 *
 * 현재 값은 5.5자/초 환산 임시 길이. 총 667초 = 11:07 (낭독 639 + 무음 28).
 */

export const FPS = 30;
export const SEC = (s: number): number => Math.round(s * FPS);

/** 섹션 시작(초) — 유튜브 챕터 지점과 일치해야 한다 */
export const SECTION_STARTS_SEC = {
  s0: 0,
  s1: 8,
  s2: 56,
  s3: 192,
  s4: 395,
  s5: 607,
  s6: 653,
} as const;

/** 섹션 길이(초). 섹션 4는 낭독 192 + 대조표 무음 20 */
export const SECTION_LENGTHS_SEC = {
  s0: 8,
  s1: 48,
  s2: 136,
  s3: 203,
  s4: 212,
  s5: 45,
  s6: 14,
} as const;

export const TOTAL_SEC = SECTION_STARTS_SEC.s6 + SECTION_LENGTHS_SEC.s6; // 667 = 11:07
export const TOTAL_FRAMES = SEC(TOTAL_SEC);

/* ── 섹션 1 — 후킹 (문단 5개) ─────────────────────────────────── */
export const S1_STAGES_SEC: [number, number, number, number, number] = [
  0, // 통념 제시 (4.0초)
  4.0, // 사례 ① (11.6초)
  15.6, // 사례 ② 카운트업 (17.6초)
  33.2, // 목양체질 + 사례 후퇴 (5.1초)
  38.3, // 항목 예고 (9.8초)
];
/** 예고 8개가 섹션 끝(48초) 전에 등장을 마치도록 잡은 간격 —
 *  마지막 항목 38.7+7×1.1=46.4에 등장, +0.33초 여유 확보 */
export const S1_ITEM_INTERVAL_SEC = 1.1;

/* ── 섹션 2 — 공통 원리 (상대초) ──────────────────────────────── */
export const S2 = {
  intro: 0, // 도입 — ConstitutionName 2개 제시
  organPresent: 5.5, // 2-a ① 양 끝 동일 제시 (A 배열 정지)
  /** ② 문단(28.8~) 시작 후 약 2초 지점에서 이동 애니메이션 진입 */
  organAnim: 30.8,
  organEnd: 47.2, // ③ 독립 체질 결론까지 최종 상태 유지
  bile: 47.2, // 2-b 1단계 (담즙 인과)
  bileExpand: 59.9, // 2-b 2~4단계 (길항·음식 대비)
  bileEnd: 87.4,
  carnivore: 87.4,
  food: 101.4,
  bathing: 117.2,
  bridge: 131.7, // 전환 문장 (화면은 공백)
  end: 136,
} as const;

/** 2-a 정지 제시에 쓸 컴포넌트 내부 프레임 — 등장 스태거 완료 직후,
 *  강조 점등(1.0초=30f) 직전. 라이브 재생도 이 프레임부터 이어 붙인다 */
export const ORGAN_FREEZE_FRAME = 25;

/** 2-b 단계 시작(컴포넌트 상대초) — 2~4단계는 27.5초 창을 3등분 */
export const S2B_STAGES_SEC: [number, number, number, number] = [0, 12.7, 21.9, 31.1];
export const CARNIVORE_STAGES_SEC: [number, number, number] = [0, 3.5, 8.5];
export const FOOD_STAGES_SEC: number[] = [0.5, 8.0];
export const S2C_STAGES_SEC: [number, number, number] = [0, 4.8, 9.7];

/* ── 섹션 3 — 목양체질 (상대초) ───────────────────────────────── */
export const S3 = {
  title: 0, // 3-a 타이틀 카드
  b: 9.3, // 외형
  c: 19.8, // 성격
  d: 49.2, // 직업
  e: 104.8, // 운동
  f: 110.8, // 질병·건강법
  bp: 134.8, // 혈압 문단
  people: 173.0, // 유명인 (인물 카드)
  exception: 188.8, // 체형 반례 강조 자막
  end: 203,
} as const;

/** 섹션 3 자막 구간 (상대초) */
export const S3_CAPTIONS = {
  career: [49.2, 111] as const, // 직업 문단 + 유보 문장
  medical: [134.8, 173] as const, // 혈압 문단 — 출처 상향도 동일 구간
} as const;

/* ── 섹션 4 — 목음체질 (상대초) ───────────────────────────────── */
export const S4 = {
  title: 0, // 4-a 타이틀 카드
  b: 10.0, // 외형
  c: 15.3, // 성격
  d: 28.6, // 직업 (패널은 82.9까지 연속 — 자막만 세 구간)
  dAlcohol: 53.1, // 알코올 문단 (career → addiction 교체)
  dAfter: 65.5,
  e: 82.9, // 운동
  f: 114.3, // 질병·건강법
  people: 154.0, // 유명인
  table: 160.2, // 9항목 대조표 — 무음 20초, 전환 없이 즉시
  answer: 180.2, // 4-i 정답 + 예고
  end: 212,
} as const;

/** 4-d 포인트 등장(패널 상대초) — 3번째(술)가 알코올 문단 시작(24.5)과 맞물림 */
export const S4_D_POINTS_SEC: number[] = [0.4, 6, 24.5, 37, 40];

/** 섹션 4 자막 구간 (상대초) — career는 알코올 문단을 비켜 두 구간 */
export const S4_CAPTIONS = {
  career1: [28.6, 53.1] as const,
  addiction: [53.1, 65.5] as const,
  career2: [65.5, 82.9] as const,
} as const;

/** 대조표 진입 시 내부 페이드인(0.5초)을 건너뛰는 오프셋 프레임 —
 *  "전환 없이 즉시 정지 화면" (조립 사양서 4절) */
export const TABLE_SKIP_FADE_FRAMES = 15;

/* ── 섹션 5 — 자가진단 경계 (상대초) ──────────────────────────── */
export const S5_STAGES_SEC: [number, number, number, number, number] = [
  0, // 경고 리드
  7.8, // 가변 요소
  17.0, // 정점 강조
  27.6, // 맥진
  33.1, // 대안
];

/* ── 유튜브 챕터 (검수용 기록 — 섹션 시작·대조표 지점과 일치) ── */
export const YOUTUBE_CHAPTERS: [number, string][] = [
  [0, '시작'],
  [SECTION_STARTS_SEC.s1, '채식이 독이 된 두 사람'],
  [SECTION_STARTS_SEC.s2, '목체질의 공통점 — 장기 배열과 음식'],
  [SECTION_STARTS_SEC.s3, '목양체질'],
  [SECTION_STARTS_SEC.s4, '목음체질'],
  [SECTION_STARTS_SEC.s4 + S4.table, '두 체질 한눈에 비교'],
  [SECTION_STARTS_SEC.s5, '자가진단을 하지 마셔야 하는 이유'],
  [SECTION_STARTS_SEC.s6, '다음 편 예고'],
];
