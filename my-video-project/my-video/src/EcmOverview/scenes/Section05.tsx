import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, CREDIT, FONT, IMAGES } from '../constants';
import { SourceCaptions } from '../components/SourceCaptions';
import { SectionBadge } from '../components/SectionBadge';
import { Subtitles, type Cue } from '../components/Subtitles';

/** 우측 사진 패널 (켄번스 + 라운드 프레임) */
const PhotoPanel: React.FC<{ src: string; objectPosition?: string }> = ({ src, objectPosition = 'center' }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 240], [1.03, 1.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        right: 120,
        top: 300,
        width: 760,
        height: 620,
        borderRadius: 20,
        overflow: 'hidden',
        opacity: o,
        border: `3px solid ${COLORS.green}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, transform: `scale(${scale})` }}
      />
    </div>
  );
};

const LeadText: React.FC<{ tag: string; title: string; body: string }> = ({ tag, title, body }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = interpolate(frame, [8, 26], [-40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 120, top: 340, width: 760, opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ color: COLORS.gold, fontFamily: FONT, fontSize: 32, fontWeight: 800, letterSpacing: 4 }}>{tag}</div>
      <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 72, fontWeight: 900, margin: '10px 0 24px' }}>
        {title}
      </div>
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 40, fontWeight: 500, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
};

/** 섹션5 — 어떻게 진단하고 치료하는가 (Image 5 맥진 → Image 1 체질침) */
export const Section05: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const phaseAEnd = Math.round(durationInFrames * 0.42);

  const cues: Cue[] = [
    { fromSec: 0, text: '그럼 내 체질은 어떻게 알 수 있을까요?' },
    { fromSec: 5, text: '8체질의학의 진단법은 맥진(脈診)입니다.' },
    { fromSec: 11, text: '손목 요골동맥에는 체질마다 다른 고유한 사인이 숨어 있습니다.' },
    { fromSec: 18, text: '이 맥상은 태어날 때부터 평생 변하지 않습니다.' },
    { fromSec: 24, text: '치료의 핵심은 두 가지입니다.' },
    { fromSec: 29, text: '하나는 체질침. 같은 병이라도 체질에 따라 침 처방이 달라집니다.' },
    { fromSec: 38, text: '다른 하나는 체질식. 음식은 각 장기별로 영양이 됩니다.' },
    { fromSec: 46, text: '강한 장기를 돕는 음식은 끊고, 약한 장기를 돕는 음식을 먹는 것.' },
    { fromSec: 52, text: '체질식은 추후 별도 영상에서 자세히 다루겠습니다.' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Phase A — 맥진 */}
      <Sequence  durationInFrames={phaseAEnd}>
        <AbsoluteFill>
          <LeadText
            tag="진단 · DIAGNOSIS"
            title="맥진 脈診"
            body="손목 요골동맥의 고유한 맥상으로 체질을 감별합니다. 이 맥상은 평생 변하지 않습니다."
          />
          <PhotoPanel src={IMAGES.pulseDiagnosis} objectPosition="center" />
        </AbsoluteFill>
      </Sequence>

      {/* Phase B — 체질침 + 체질식 */}
      <Sequence from={phaseAEnd} durationInFrames={durationInFrames - phaseAEnd}>
        <AbsoluteFill>
          <LeadText
            tag="치료 · TREATMENT"
            title="체질침 · 체질식"
            body="체질마다 장기 배열이 달라 침 처방이 달라지고, 강한 장기를 돕는 음식은 끊고 약한 장기를 돕는 음식을 먹습니다."
          />
          <PhotoPanel src={IMAGES.acupuncture} objectPosition="center" />
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: 'absolute', top: 80, left: 120, zIndex: 30 }}>
        <SectionBadge label="진단과 치료" title="맥진으로 알고, 침과 음식으로 다스린다" />
      </div>

      {/* v4 화면 대표 출처(섹션 통합 1개) + Image 5·1 사진 출처(ecmed) */}
      <SourceCaptions
        cues={[
          { fromSec: 0, text: '출처: 빛과소금 94-8월호, 95-5월호, 97-2월호' },
          { fromSec: 0, text: CREDIT.ecmed },
        ]}
      />
      <Subtitles cues={cues} />
    </AbsoluteFill>
  );
};
