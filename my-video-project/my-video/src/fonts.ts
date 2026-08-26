/**
 * 프로젝트 공용 폰트 정의
 *
 * 기존에는 시스템에 설치된 "Noto Sans KR"에 의존했기 때문에, 폰트가 없는 PC나
 * 클라우드 환경에서 렌더하면 맑은고딕으로 대체되어 글자 모양·줄바꿈이 달라졌다.
 * 이제 @remotion/google-fonts 로 폰트 파일 자체를 불러오므로 어디서 렌더하든
 * 결과가 동일하다. loadFont() 는 내부적으로 delayRender() 를 걸어 폰트 로드가
 * 끝난 뒤에 렌더가 시작되도록 보장한다.
 *
 * 각 영상의 constants.ts 는 이 파일의 FONT 를 재수출하므로,
 * 장면 코드에서는 기존과 동일하게 `import { FONT } from './constants'` 로 쓰면 된다.
 */

import { loadFont } from '@remotion/google-fonts/NotoSansKR';

/**
 * Noto Sans KR 로드.
 *
 * weights: 실제 장면에서 쓰는 굵기 7종(300~900)만 지정.
 * subsets: 한글 + 라틴(영문·숫자)만. 한글 서브셋은 유니코드 구간별로 잘게
 *          나뉘어 있어 @font-face 선언 수가 많지만, 실제로 화면에 쓰인 글자가
 *          속한 구간만 내려받으므로 렌더 부담은 크지 않다.
 *          (선언 수가 많아 뜨는 경고는 ignoreTooManyRequestsWarning 로 끔)
 */
const { fontFamily } = loadFont('normal', {
  weights: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['korean', 'latin'],
  ignoreTooManyRequestsWarning: true,
});

/** 전 영상 공용 font-family 문자열. 뒤쪽은 로드 실패 시를 대비한 폴백. */
export const FONT = `${fontFamily}, "Apple SD Gothic Neo", "Malgun Gothic", "나눔고딕", sans-serif`;
