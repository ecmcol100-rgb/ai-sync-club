/**
 * 8체질의학 개괄영상(EcmOverview) 상수 정의
 *
 * 오디오가 아직 없으므로 각 섹션 길이는 스펙 타임코드(초 단위)를 그대로 사용한다.
 * 추후 TTS 오디오가 확정되면 SECTION_SECONDS 값만 실제 오디오 길이(초)로 교체하면
 * 프레임 수·시작점·전체 길이가 자동으로 재계산된다.
 */

export const FPS = 30;

/** 섹션별 길이(초). 스펙 타임코드 기준. 오디오 확정 시 이 값만 바꾸면 됨. */
export const SECTION_SECONDS = {
  title: 5, // 섹션0 타이틀             (0:00~0:05)
  hooking: 37, // 섹션1 후킹              (0:05~0:42) ★v5 마지막 장면 +2초
  principle: 65, // 섹션2 핵심 원리         (0:42~1:47)
  eightTypes: 70, // 섹션3 여덟 가지 체질     (1:47~2:57)
  vsSasang: 70, // 섹션4 사상의학과 차이     (2:57~4:07)
  diagnosis: 55, // 섹션5 진단·치료          (4:07~5:02)
  closing: 25, // 섹션6 클로징             (5:02~5:27)
} as const;

/** 섹션 렌더 순서 */
export const SECTION_ORDER = [
  'title',
  'hooking',
  'principle',
  'eightTypes',
  'vsSasang',
  'diagnosis',
  'closing',
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

/** 초 → 프레임 변환 (반올림) */
export const secToFrames = (sec: number): number => Math.round(sec * FPS);

/** 섹션별 프레임 수 (SECTION_ORDER 순서) */
export const SECTION_FRAMES: number[] = SECTION_ORDER.map((k) =>
  secToFrames(SECTION_SECONDS[k]),
);

/** 전체 프레임 수 */
export const TOTAL_FRAMES = SECTION_FRAMES.reduce((a, b) => a + b, 0);

/** idx(0-based) 섹션의 시작 프레임 */
export const getSectionStart = (idx: number): number =>
  SECTION_FRAMES.slice(0, idx).reduce((a, b) => a + b, 0);

/** 색상 팔레트 (기존 강의영상 톤과 통일) */
export const COLORS = {
  bg: '#0E1A16', // 개괄영상은 다큐 톤의 어두운 배경
  bgSoft: '#14261F',
  topBar: '#2D6A4F',
  green: '#2D6A4F',
  greenBright: '#52B788',
  greenPale: '#A8DFCA',
  gold: '#D4A24E',
  red: '#E63946',
  blue: '#457B9D',
  text: '#F4F4EF',
  textDim: '#B9C4BE',
  white: '#FFFFFF',
  overlay: 'rgba(8, 16, 13, 0.55)',
} as const;

/** 공용 폰트 (src/fonts.ts 에서 Google Fonts로 로드) 재수출 */
export { FONT } from '../fonts';

/** public/images/ecm 기준 이미지 경로 헬퍼 */
export const ecm = (file: string): string => `images/ecm/${file}`;

/** 스펙 이미지 매핑 (Image 1~5 → 실제 파일) */
export const IMAGES = {
  /** Image 1 — 발목 침 시술 클로즈업 (섹션5 체질침) */
  acupuncture: ecm('acupuncture.jpg'),
  /** Image 2 — 권도원 박사님 정면 흑백 인물 (섹션2) */
  kwonPortrait: ecm('kwon_2.jpg'),
  /** Image 3 — 권도원 박사님 시술/진료 장면 (섹션6 클로징) */
  kwonTreating: ecm('kwon_3.jpg'),
  /** Image 4 — 청년기 흑백 사진, 책상 집필 (섹션1 후킹) */
  kwonYoung: ecm('kwon_1.jpg'),
  /** Image 5 — 맥진하는 손 클로즈업 (섹션5) */
  pulseDiagnosis: ecm('pulse_diagnosis.jpg'),
  /** 노년 컬러 정면 인물 (섹션3 금양체질 '권도원 본인' 컷) */
  kwonColor: ecm('kwon_4.jpg'),
  /**
   * 섹션3 토양체질 컷 — 마이클 잭슨 사진 (원장님 제공, public 폴더).
   * 저작권 이슈 발생 시 이 한 줄만 교체하면 컷이 바뀐다 (스펙 v3 연출 메모).
   */
  michaelJackson: ecm('Michael_Jackson.jpg'),
} as const;

/** 사진 출처 표기 문구 */
export const CREDIT = {
  ecmed: '사진 출처: ecmed.org',
  archive: '사진 출처: e영상역사관·국가기록원 (KOGL)',
  wiki: '사진 출처: Wikimedia Commons (Public Domain)',
} as const;
