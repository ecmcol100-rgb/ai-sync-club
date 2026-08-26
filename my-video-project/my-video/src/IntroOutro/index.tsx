import { Sequence } from 'remotion';
import { INTRO_FRAMES, OUTRO_FRAMES } from './constants';
import { Intro } from './Intro';
import { Outro } from './Outro';

/** 인트로(8초) + 아웃트로(12초) 합본 컴포지션 */
export const IntroOutro: React.FC = () => (
  <>
    <Sequence  durationInFrames={INTRO_FRAMES}>
      <Intro />
    </Sequence>
    <Sequence from={INTRO_FRAMES} durationInFrames={OUTRO_FRAMES}>
      <Outro />
    </Sequence>
  </>
);

export { Intro } from './Intro';
export { Outro } from './Outro';
export { INTRO_FRAMES, OUTRO_FRAMES, TOTAL_FRAMES } from './constants';
