import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, CONTENT_MAX_Y, FONT } from '../constants';
import { ORGAN_SILHOUETTES } from './PersonTypoCard';
import { ConstitutionName } from './ConstitutionName';

export interface ConstitutionTitleCardProps {
  /** '목양체질' */
  constitution: string;
  /** '木陽 · Hepatonia' */
  constitutionSub: string;
  /** '간이 강한 체질' — 개괄편 섹션3 컷의 organ 표현과 동일 문구 사용 */
  organLine: string;
  /** 배경 실루엣 키 (PersonTypoCard의 ORGAN_SILHOUETTES 재사용) */
  organSilhouette?: string;
  /** 미지정 시 체질 시그니처 컬러 (실루엣·밑줄용 — 체질명 칩 색과 별개) */
  accentColor?: string;
}

/**
 * ConstitutionTitleCard — 체질 타이틀 카드 (3-a / 4-a, 약 4초)
 *
 * 섹션 3·4의 여는 화면. ItemPanel 사양서 7절이 별도 컴포넌트로 지정한 것.
 * PersonTypoCard와 같은 시각 언어 — 배경 장기 실루엣(저채도) + 타이포만.
 * 3-a와 4-a는 색·문구만 다르고 구조 동일 (섹션 대칭 원칙).
 * 발자국 y < CONTENT_MAX_Y.
 */
export const ConstitutionTitleCard: React.FC<ConstitutionTitleCardProps> = ({
  constitution,
  constitutionSub,
  organLine,
  organSilhouette,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent =
    accentColor ??
    CONSTITUTION_ACCENTS[constitution.slice(0, 2) as keyof typeof CONSTITUTION_ACCENTS] ??
    COLORS.greenBright;

  const nameScale = spring({ frame, fps, config: { damping: 17, stiffness: 80 }, from: 0.92, to: 1 });
  const nameOpacity = interpolate(frame, [2, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subIn = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const organIn = interpolate(frame, [26, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const silhouette = organSilhouette ? ORGAN_SILHOUETTES[organSilhouette] : undefined;

  return (
    <>
      {/* 배경 실루엣 — 저채도, 본문 한계선 위에서 끝난다 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 130,
          height: CONTENT_MAX_Y - 130 - 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: nameOpacity,
        }}
      >
        {silhouette ? (
          <svg viewBox={silhouette.viewBox} style={{ height: '100%', opacity: 0.12 }}>
            {silhouette.paths.map((d, i) => (
              <path key={i} d={d} fill={accent} />
            ))}
          </svg>
        ) : (
          <div
            style={{
              width: 900,
              height: '92%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse at center, ${accent} 0%, transparent 68%)`,
              opacity: 0.1,
            }}
          />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 220,
          textAlign: 'center',
          transform: `scale(${nameScale})`,
        }}
      >
        {/* 체질명 — 확정 색 칩 (CONSTITUTION_TITLE_COLORS) */}
        <div style={{ opacity: nameOpacity }}>
          <ConstitutionName name={constitution} fontSize={120} style={{ letterSpacing: 4 }} />
        </div>
        <div
          style={{
            marginTop: 14,
            opacity: subIn,
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          {constitutionSub}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
          <div
            style={{
              width: 150,
              height: 5,
              borderRadius: 3,
              backgroundColor: accent,
              transform: `scaleX(${subIn})`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 34,
            opacity: organIn,
            color: COLORS.text,
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 700,
          }}
        >
          {organLine}
        </div>
      </div>
    </>
  );
};

/** 3-a / 4-a 데이터 — 체질명·장기 표현은 개괄편 섹션3 컷과 동일 */
export const MOK_YANG_TITLE: ConstitutionTitleCardProps = {
  constitution: '목양체질',
  constitutionSub: '木陽 · Hepatonia',
  organLine: '간이 강한 체질',
  organSilhouette: 'liver',
};

export const MOK_EUM_TITLE: ConstitutionTitleCardProps = {
  constitution: '목음체질',
  constitutionSub: '木陰 · Cholecystonia',
  organLine: '담낭이 강한 체질',
  organSilhouette: 'gallbladder',
};

export const CONSTITUTION_TITLE_PREVIEW_FRAMES = 240;

/** 검수용 — 3-a(0~4초) → 4-a(4~8초) 순차 재생으로 대칭 확인 */
export const ConstitutionTitleCardPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <Sequence durationInFrames={120}>
      <ConstitutionTitleCard {...MOK_YANG_TITLE} />
    </Sequence>
    <Sequence from={120}>
      <ConstitutionTitleCard {...MOK_EUM_TITLE} />
    </Sequence>
  </AbsoluteFill>
);
