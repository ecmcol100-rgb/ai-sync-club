/** 인트로·아웃트로 전용 색상 / 폰트 / 타이밍 */

export const IC = {
  bgLight:    '#F5F5F8',
  deepGreen1: '#0A3D2B',
  deepGreen2: '#1A6B4A',
  navy:       '#1B2A4A',
  gold:       '#C9A843',
  mint:       '#4ECDC4',
  darkBrown:  '#2C1810',
  white:      '#FFFFFF',
  darkText:   '#2C3E50',
  gray:       '#888888',
} as const;

/** 공용 폰트 (src/fonts.ts 에서 Google Fonts로 로드) 재수출 */
export { FONT } from '../fonts';

export const INTRO_FRAMES = 240;  // 8s × 30fps
export const OUTRO_FRAMES = 360;  // 12s × 30fps
export const TOTAL_FRAMES = INTRO_FRAMES + OUTRO_FRAMES; // 600
