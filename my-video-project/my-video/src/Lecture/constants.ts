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

export const FONT =
  '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "나눔고딕", sans-serif';

/** 각 장면의 프레임 수 (30fps 기준) */
export const SCENE_DURATIONS: number[] = [
  300, // 장면1  10초
  450, // 장면2  15초
  600, // 장면3  20초
  750, // 장면4  25초
  450, // 장면5  15초
  450, // 장면6  15초
  600, // 장면7  20초
  450, // 장면8  15초
  450, // 장면9  15초
  600, // 장면10 20초
  600, // 장면11 20초
  600, // 장면12 20초
  450, // 장면13 15초
  600, // 장면14 20초
  600, // 장면15 20초
  300, // 장면16 10초
];

export const TOTAL_FRAMES = SCENE_DURATIONS.reduce((a, b) => a + b, 0); // 8250

/** sceneIndex(0-based) 번째 장면의 시작 프레임 */
export const getSceneStart = (idx: number): number =>
  SCENE_DURATIONS.slice(0, idx).reduce((a, b) => a + b, 0);
