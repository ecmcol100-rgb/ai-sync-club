export const COLORS = {
  bg: '#FAFAF5',
  topBar: '#2D6A4F',
  darkGreen: '#1B4332',
  red: '#E63946',
  blue: '#1D3557',
  text: '#2D3436',
  textLight: '#636E72',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardBorder: '#C8DDD8',
  greenLight: '#E8F5F0',
  blueLight: '#E8F0F7',
} as const;

/** 공용 폰트 (src/fonts.ts 에서 Google Fonts로 로드) 재수출 */
export { FONT } from '../fonts';

/** 각 장면의 프레임 수 (30fps 기준) */
export const SCENE_DURATIONS: number[] = [
  210, // 장면1  오프닝           7초
  480, // 장면2  주제 제시        16초
  930, // 장면3  Chapter 1      31초
  600, // 장면4  숙제 비유        20초
  420, // 장면5  비교표          14초
  570, // 장면6  약초            19초
  420, // 장면7  Chapter 2      14초
  540, // 장면8  휘발유 비유      18초
  600, // 장면9  핵심            20초
  870, // 장면10 과식·즙 주의     29초
  510, // 장면11 Chapter 3      17초
  870, // 장면12 평상시 주의      29초
  330, // 장면13 부모-아이 비유   11초
  930, // 장면14 결론            31초
  270, // 장면15 엔딩             9초
];

export const TOTAL_FRAMES = SCENE_DURATIONS.reduce((a, b) => a + b, 0); // 8550

/** sceneIndex(0-based) 번째 장면의 시작 프레임 */
export const getSceneStart = (idx: number): number =>
  SCENE_DURATIONS.slice(0, idx).reduce((a, b) => a + b, 0);
