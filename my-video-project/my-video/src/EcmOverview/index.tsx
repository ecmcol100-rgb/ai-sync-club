import { AbsoluteFill, Sequence } from 'remotion';
import { SECTION_FRAMES, getSectionStart, COLORS } from './constants';
import { Section00 } from './scenes/Section00';
import { Section01 } from './scenes/Section01';
import { Section02 } from './scenes/Section02';
import { Section03 } from './scenes/Section03';
import { Section04 } from './scenes/Section04';
import { Section05 } from './scenes/Section05';
import { Section06 } from './scenes/Section06';

/** 섹션 컴포넌트 (SECTION_ORDER 순서: 타이틀 → 섹션1~6) */
const SECTIONS = [Section00, Section01, Section02, Section03, Section04, Section05, Section06] as const;

/**
 * 8체질의학 개괄영상 (EcmOverview)
 *
 * 스펙(8체질의학_개괄영상_제작스펙_2.md)의 6개 섹션 구성.
 * 각 섹션 길이는 constants.ts 의 SECTION_SECONDS 로 관리 — 오디오 확정 시 그 값만 교체.
 * 현재는 오디오 없이 내레이션을 하단 자막으로만 표시한다.
 */
export const EcmOverview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    {SECTIONS.map((SectionComp, idx) => {
      const durationInFrames = SECTION_FRAMES[idx];
      return (
        <Sequence key={idx} from={getSectionStart(idx)} durationInFrames={durationInFrames}>
          <SectionComp durationInFrames={durationInFrames} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
