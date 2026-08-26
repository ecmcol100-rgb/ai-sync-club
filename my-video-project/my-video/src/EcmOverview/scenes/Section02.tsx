import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CREDIT, FONT, FPS, IMAGES } from '../constants';
import { SourceCaptions } from '../components/SourceCaptions';
import { SectionBadge } from '../components/SectionBadge';
import { Subtitles, type Cue } from '../components/Subtitles';

const ORGANS_SOLID = ['간 肝', '심장 心', '췌장 膵', '폐 肺', '신장 腎'];
const ORGANS_HOLLOW = ['담낭 膽', '소장 小腸', '위 胃', '대장 大腸', '방광 膀胱'];
const NERVES = ['교감신경', '부교감신경'];

/** 장기 칩 (스태거 등장) */
const OrganChip: React.FC<{ label: string; idx: number; color: string }> = ({ label, idx, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 10 + idx * 4;
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 }, from: 0, to: 1 });
  return (
    <div
      style={{
        opacity: s,
        transform: `scale(${0.85 + s * 0.15})`,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: '18px 10px',
        textAlign: 'center',
        color: COLORS.text,
        fontFamily: FONT,
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
};

/** Phase B — 12기관 인포그래픽 */
const OrganGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const nerveOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 300, left: 120, right: 120 }}>
      <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
        속이 꽉 찬 장기 5 (오장)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginBottom: 30 }}>
        {ORGANS_SOLID.map((o, i) => (
          <OrganChip key={o} label={o} idx={i} color={COLORS.greenBright} />
        ))}
      </div>
      <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
        속이 빈 장기 5 (오부)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginBottom: 30 }}>
        {ORGANS_HOLLOW.map((o, i) => (
          <OrganChip key={o} label={o} idx={i + 5} color={COLORS.blue} />
        ))}
      </div>
      <div style={{ opacity: nerveOpacity, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ color: COLORS.gold, fontFamily: FONT, fontSize: 30, fontWeight: 700 }}>+ 자율신경 2</div>
        {NERVES.map((n, i) => (
          <OrganChip key={n} label={n} idx={i + 10} color={COLORS.gold} />
        ))}
        <div style={{ marginLeft: 'auto', color: COLORS.text, fontFamily: FONT, fontSize: 44, fontWeight: 900 }}>
          = 12기관
        </div>
      </div>
    </div>
  );
};

/** Phase C — 적불균형 vs 과불균형 */
const BalanceDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const leftIn = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rightIn = interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const Card: React.FC<{ opacity: number; title: string; sub: string; desc: string; color: string }> = ({
    opacity,
    title,
    sub,
    desc,
    color,
  }) => (
    <div
      style={{
        opacity,
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: `3px solid ${color}`,
        borderRadius: 20,
        padding: '40px 44px',
      }}
    >
      <div style={{ color, fontFamily: FONT, fontSize: 58, fontWeight: 900 }}>{title}</div>
      <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 30, fontWeight: 600, margin: '6px 0 24px' }}>
        {sub}
      </div>
      <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 34, fontWeight: 500, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', top: 320, left: 120, right: 120, display: 'flex', gap: 40 }}>
      <Card
        opacity={leftIn}
        title="적불균형 適不均衡"
        sub="적당한 불균형 = 건강"
        desc="타고난 강약 배열은 병이 아니라 그 사람의 개성이자 건강한 생리 상태입니다."
        color={COLORS.greenBright}
      />
      <Card
        opacity={rightIn}
        title="과불균형 過不均衡"
        sub="지나친 불균형 = 병"
        desc="잘못된 음식섭생·생활습관으로 강한 장기는 더 강해지고 약한 장기는 더 약해질 때 — 병이 됩니다."
        color={COLORS.red}
      />
    </div>
  );
};

/** 섹션2 — 핵심 원리 (Image 2: 권도원 박사님 정면 흑백 인물 → 12기관 → 적/과불균형) */
export const Section02: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const phaseAEnd = Math.round(durationInFrames * 0.2);
  const phaseBEnd = Math.round(durationInFrames * 0.68);

  const cues: Cue[] = [
    { fromSec: 0, text: '8체질의학은 고(故) 권도원 박사님(1921~2022)께서\n창시하신 의학입니다.' },
    { fromSec: 8, text: '1965년 도쿄 국제침구학회에서 처음 발표된 이래,\n전혀 새로운 의학적 패러다임으로 자리 잡아 왔습니다.' },
    // ★v5: 강조 해제 — 일반 내레이션 자막으로 (강조는 2-a 화면 그래픽 텍스트가 담당)
    { fromSec: 16, text: '8체질의학은 기존의 어떤 의학과도 다른, 완전히 새로운 체계를\n가지고 있는데, 핵심 원리는 이렇습니다.' },
    { fromSec: 24, text: '우리 몸의 5개 내장 — 간·심장·췌장·폐·신장,\n그리고 담낭·소장·위·대장·방광 5개.' },
    { fromSec: 31, text: '여기에 자율신경(교감·부교감)을 더한 12기관.' },
    { fromSec: 37, text: '이 12기관의 강약 배열이\n태어날 때부터 사람마다 다르게 정해져 있습니다.' },
    { fromSec: 43, text: '그리고 그 배열은 여덟 가지로 나뉩니다.' },
    { fromSec: 47, text: "이 불균형은 병이 아닙니다.\n'적불균형' — 타고난 건강한 개성입니다." },
    { fromSec: 54, text: "문제는 잘못된 섭생·생활습관으로 '과불균형'이 될 때." },
    // v3/v4: 핵심 문구 강조 처리
    { fromSec: 59, text: '강한 장기는 더욱 강해지고, 약한 장기는 더욱 약해지는 것', emphasis: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ★v5 화면별 헤더 분리: 2-a "8체질의학의 창시" / 2-b 이후 "12기관의 강약 배열" */}
      <Sequence  durationInFrames={phaseAEnd}>
        <div style={{ position: 'absolute', top: 80, left: 120 }}>
          <SectionBadge label="핵심 원리" title="8체질의학의 창시" />
        </div>
      </Sequence>
      <Sequence from={phaseAEnd}>
        <div style={{ position: 'absolute', top: 80, left: 120 }}>
          <SectionBadge label="핵심 원리" title="12기관의 강약 배열" />
        </div>
      </Sequence>

      {/* Phase A — 권도원 박사님 정면 인물 */}
      <Sequence  durationInFrames={phaseAEnd}>
        <PortraitIntro />
      </Sequence>

      {/* Phase B — 12기관 그리드 */}
      <Sequence from={phaseAEnd} durationInFrames={phaseBEnd - phaseAEnd}>
        <OrganGrid />
      </Sequence>

      {/* Phase C — 적불균형/과불균형 */}
      <Sequence from={phaseBEnd} durationInFrames={durationInFrames - phaseBEnd}>
        <BalanceDiagram />
      </Sequence>

      <SourceCaptions
        cues={[
          // Image 2(권도원 정면, ecmed) — 인물 사진 노출 구간(Phase A)에만
          { fromSec: 0, toSec: phaseAEnd / FPS, text: CREDIT.ecmed },
          // ★v5 화면 출처 3구간 — 2-a(복수·간략) / 2-b(1개·전체) / 2-c(1개·전체)
          { fromSec: 0, toSec: 16, text: '출처: 미래한국 2009.12.7 인터뷰 / 8체질의학론 개요(2003)' },
          { fromSec: 37, toSec: 47, text: '출처: 권도원, 「8체질을 압시다」, 빛과소금 1994년 8월호' },
          { fromSec: 54, text: '출처: 권도원, 「육체적 개성론의 선구자」, 빛과소금 1999년 12월호' },
        ]}
      />
      <Subtitles cues={cues} />
    </AbsoluteFill>
  );
};

/** Phase A 내부 — 인물 사진 + 발표 연도 */
const PortraitIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const imgOpacity = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 200], [1.02, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          right: 160,
          top: 240,
          width: 520,
          height: 520,
          borderRadius: 20,
          overflow: 'hidden',
          opacity: imgOpacity,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: `3px solid ${COLORS.green}`,
        }}
      >
        <Img
          src={staticFile(IMAGES.kwonPortrait)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
        />
        {/* 인물 캡션 — ★v5 자막·출처와 겹치지 않게 사진 프레임 내부 하단 오버레이로 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(8,16,13,0.78)',
            padding: '12px 0',
            textAlign: 'center',
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          권도원 박사님 <span style={{ color: COLORS.greenPale, fontWeight: 500 }}>(1921~2022)</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 320, opacity: imgOpacity, maxWidth: 900 }}>
        <div style={{ color: COLORS.gold, fontFamily: FONT, fontSize: 120, fontWeight: 900 }}>1965</div>
        <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 44, fontWeight: 700, lineHeight: 1.4 }}>
          도쿄 국제침구학회에서
          <br />
          권도원 박사님이 처음 발표
        </div>
        {/* ★v5 그래픽 텍스트 강조 (소형 청록 → 크기·색상 강조) */}
        <div
          style={{
            marginTop: 28,
            display: 'inline-block',
            backgroundColor: 'rgba(212,162,78,0.14)',
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 12,
            padding: '14px 28px',
            color: COLORS.gold,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          기존 의학과 다른 완전히 새로운 체계
        </div>
      </div>
    </>
  );
};
