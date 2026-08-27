import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';
import { ConstitutionName } from './ConstitutionName';

export interface TitlePart {
  text: string;
  /** true면 체질명 확정 색 칩(ConstitutionName)으로 그린다 */
  isName?: boolean;
  /** isName이 아닌 일반 텍스트의 색. 미지정 시 기본 텍스트색 */
  color?: string;
}

export interface EpisodeTitleCardProps {
  /** 상단 소형 채널 라벨 */
  seriesLabel?: string;
  /** 타이틀 — 부분별 색을 줄 수 있다 (체질명 2색 등) */
  titleParts: TitlePart[];
  /** 밑줄 아래 부제 */
  sub?: string;
}

/**
 * EpisodeTitleCard — 편 타이틀 (섹션 0, 약 4~5초)
 *
 * 개괄편 Section00과 같은 연출(스프링 등장 → gold 밑줄 확장 → 부제 페이드,
 * 끝 페이드아웃)을 편 제목만 갈아끼울 수 있게 컴포넌트화한 것.
 * 배경 방사광·타이포 크기·리듬은 개괄편과 동일 — 시리즈 첫 화면 톤 통일.
 */
export const EpisodeTitleCard: React.FC<EpisodeTitleCardProps> = ({
  seriesLabel = '8체질의학회',
  titleParts,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 18, stiffness: 70 }, from: 0.9, to: 1 });
  const titleOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineWidth = interpolate(frame, [20, 44], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subOpacity = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outOpacity = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', opacity: outOpacity }}
    >
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at 50% 42%, rgba(45,106,79,0.35) 0%, rgba(14,26,22,0) 55%)',
        }}
      />
      <div style={{ textAlign: 'center', transform: `scale(${titleScale})` }}>
        <div
          style={{
            color: COLORS.greenPale,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 8,
            opacity: titleOpacity,
            marginBottom: 24,
          }}
        >
          {seriesLabel}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: titleOpacity,
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}
        >
          {titleParts.map((p, i) =>
            p.isName ? (
              <ConstitutionName key={i} name={p.text} fontSize={104} style={{ margin: '0 6px' }} />
            ) : (
              <span key={i} style={{ color: p.color ?? COLORS.text }}>
                {p.text}
              </span>
            ),
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <div
            style={{ width: `${lineWidth}%`, maxWidth: 620, height: 5, backgroundColor: COLORS.gold, borderRadius: 3 }}
          />
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 28,
              color: COLORS.textDim,
              fontFamily: FONT,
              fontSize: 36,
              fontWeight: 500,
              opacity: subOpacity,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 목양·목음편 타이틀 — 부제는 스펙 v5 '시리즈 위치: 8체질 기본 시리즈 ①' 기준.
 * 체질명은 확정 색 칩(CONSTITUTION_TITLE_COLORS: 목양 하양 / 목음 붉은색).
 */
export const MOK_EPISODE_TITLE: EpisodeTitleCardProps = {
  titleParts: [
    { text: '목양체질', isName: true },
    { text: '과 ' },
    { text: '목음체질', isName: true },
  ],
  sub: '8체질 기본 ①',
};

export const EPISODE_TITLE_PREVIEW_FRAMES = 150;

export const EpisodeTitleCardPreview: React.FC = () => <EpisodeTitleCard {...MOK_EPISODE_TITLE} />;
