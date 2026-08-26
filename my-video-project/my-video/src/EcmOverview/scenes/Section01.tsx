import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, CREDIT, FONT, IMAGES } from '../constants';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { SourceCaptions } from '../components/SourceCaptions';
import { Subtitles, type Cue } from '../components/Subtitles';

/** 섹션1 — 후킹 (Image 4: 권도원 박사님 청년기 집필 흑백 사진) */
export const Section01: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const cues: Cue[] = [
    { fromSec: 0, text: '지금으로부터 100여 년 전, 열두 살 소년이\n어금니를 치료하면서 금니를 해 넣었습니다.' },
    { fromSec: 7, text: '그런데 그날부터 심한 치통이 생겼습니다.' },
    { fromSec: 12, text: '2년 뒤 금니를 빼자 통증이 사라졌고,\n다시 금니를 해 넣자 또 아팠습니다.' },
    { fromSec: 19, text: '비슷한 시기, 독일의 금주사가 류머티즘 특효약으로 유행했지만\n두 사람이 이 주사를 맞고 사망했습니다.' },
    { fromSec: 26, text: '같은 금(金)인데, 누구에게는 약이 되고 누구에게는 독이 된다?' },
    { fromSec: 31, text: '열두 살 소년은 이 의문을 평생 붙들고 고민하게 됩니다.' },
    { fromSec: 34, text: '그 고민의 답이 바로, 오늘 소개할 8체질의학입니다.' },
  ];

  // 상단 후킹 카피
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <KenBurnsImage
        src={IMAGES.kwonYoung}
        durationInFrames={durationInFrames}
        objectPosition="center 30%"
        from={1.05}
        to={1.16}
      />

      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            color: COLORS.gold,
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 6,
            textShadow: '0 3px 18px rgba(0,0,0,0.7)',
          }}
        >
          金 — 약인가, 독인가
        </div>
        <div
          style={{
            marginTop: 12,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 600,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          8체질의학이란 무엇인가
        </div>
      </div>

      {/* ★v5 화면 출처(복수, 간략 표기) + Image 4(권도원 청년기, ecmed) 사진 출처 */}
      <SourceCaptions
        cues={[
          { fromSec: 0, text: '출처: 빛과소금 94-4월호 / 미래한국 2009.12.7 인터뷰' },
          { fromSec: 0, text: CREDIT.ecmed },
        ]}
      />
      <Subtitles cues={cues} />
    </AbsoluteFill>
  );
};
