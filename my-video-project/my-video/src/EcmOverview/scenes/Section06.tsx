import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CREDIT, FONT, IMAGES } from '../constants';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { SourceCaptions } from '../components/SourceCaptions';
import { Subtitles, type Cue } from '../components/Subtitles';

/** 섹션6 — 클로징 (Image 3: 권도원 박사님 진료 장면 → 명언 → 구독 유도) */
export const Section06: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hanjaScale = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 70 }, from: 0.85, to: 1 });

  // 구독 유도는 후반부에 등장
  const ctaStart = Math.round(durationInFrames * 0.62);
  const ctaSpring = spring({ frame: frame - ctaStart, fps, config: { damping: 15, stiffness: 90 }, from: 0, to: 1 });

  const cues: Cue[] = [
    { fromSec: 0, text: '권도원 박사님은 이렇게 말했습니다.' },
    { fromSec: 5, text: '"체질을 아는 것이 곧 하늘의 뜻을 아는 것이다."' },
    { fromSec: 12, text: '나는 왜 이 음식이 안 받을까. 나는 왜 저 사람과 다를까.' },
    { fromSec: 17, text: '그 답의 시작이 바로 당신의 체질입니다.' },
    { fromSec: 21, text: '다음 편 — 체질별 심화 1편: 목양·목음체질. 구독과 알림 설정!' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <KenBurnsImage src={IMAGES.kwonTreating} durationInFrames={durationInFrames} objectPosition="center 25%" from={1.05} to={1.15} />
      <AbsoluteFill style={{ backgroundColor: 'rgba(8,16,13,0.55)' }} />

      {/* 명언 */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            color: COLORS.gold,
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: 10,
            transform: `scale(${hanjaScale})`,
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
          }}
        >
          知體質而知天命
        </div>
        <div
          style={{
            marginTop: 20,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 600,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          체질을 아는 것이 곧 하늘의 뜻을 아는 것이다
        </div>
      </div>

      {/* 구독 유도 — ★v5 자막 안전 영역(하단 160px) 위 */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: ctaSpring,
          transform: `translateY(${(1 - ctaSpring) * 30}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            backgroundColor: 'rgba(230,57,70,0.95)',
            padding: '20px 44px',
            borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: COLORS.white, fontFamily: FONT, fontSize: 44, fontWeight: 900 }}>▶ 구독</span>
          <span style={{ color: COLORS.white, fontFamily: FONT, fontSize: 36, fontWeight: 700 }}>
            + 알림 설정으로 다음 편을 놓치지 마세요
          </span>
        </div>
      </div>

      <SourceCaptions
        cues={[
          // Image 3(권도원 진료 장면, ecmed) — 전 구간 배경
          { fromSec: 0, text: CREDIT.ecmed },
          // 지체질이지천명 명언 노출 구간의 출처
          { fromSec: 5, toSec: 13, text: '출처: 권도원, 「체질과 직업」, 빛과소금 1996년 3월호' },
        ]}
      />
      <Subtitles cues={cues} />
    </AbsoluteFill>
  );
};
