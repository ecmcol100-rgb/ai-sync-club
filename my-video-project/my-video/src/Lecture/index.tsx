import { AbsoluteFill, Sequence } from 'remotion';
import { SCENE_DURATIONS, getSceneStart } from './constants';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Scene04 } from './scenes/Scene04';
import { Scene05 } from './scenes/Scene05';
import { Scene06 } from './scenes/Scene06';
import { Scene07 } from './scenes/Scene07';
import { Scene08 } from './scenes/Scene08';
import { Scene09 } from './scenes/Scene09';
import { Scene10 } from './scenes/Scene10';
import { Scene11 } from './scenes/Scene11';
import { Scene12 } from './scenes/Scene12';
import { Scene13 } from './scenes/Scene13';
import { Scene14 } from './scenes/Scene14';
import { Scene15 } from './scenes/Scene15';
import { Scene16 } from './scenes/Scene16';

const scenes = [
  Scene01, Scene02, Scene03, Scene04,
  Scene05, Scene06, Scene07, Scene08,
  Scene09, Scene10, Scene11, Scene12,
  Scene13, Scene14, Scene15, Scene16,
] as const;

/**
 * 8체질의학회 강의영상 메인 컴포지션
 * 총 275초 (8250프레임 @ 30fps)
 */
export const Lecture8Constitution: React.FC = () => (
  <AbsoluteFill>
    {scenes.map((SceneComp, idx) => (
      <Sequence
        key={idx}
        from={getSceneStart(idx)}
        durationInFrames={SCENE_DURATIONS[idx]}
      >
        <SceneComp />
      </Sequence>
    ))}
  </AbsoluteFill>
);
