import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, CONTENT_MAX_Y, FONT } from '../constants';
import { ConstitutionName } from './ConstitutionName';

export interface Person {
  name: string;
  /** 수식어 (예: '삼성 창업주'). 없어도 레이아웃이 유지된다 */
  title?: string;
}

export interface PersonTypoCardProps {
  constitution: string;
  constitutionSub: string;
  /** 최대 3인 권장. 2~4인도 깨지지 않는다 */
  people: Person[];
  /** 배경 장기 실루엣 에셋 키 ('liver' | 'gallbladder' | ...) */
  organSilhouette: string;
  /** 미지정 시 체질 시그니처 컬러(CONSTITUTION_ACCENTS) 사용 */
  accentColor?: string;
  /** 첫 인물 등장까지 대기(초) — 단계 0(체질명+배경) 길이 */
  appearDelaySec?: number;
  /** 인물 간 등장 간격(초). TTS 실측 후 이름 낭독에 맞춰 조정 */
  intervalSec?: number;
}

/**
 * 장기 실루엣 — 이미지 에셋 없이 코드로 그린 단순화 SVG 패스.
 * (개괄편 Section03의 CSS 흉상과 같은 방식 — 저작권·에셋 관리 부담 없음)
 *
 * 해부학적 정밀도는 목표가 아니다. 저채도 배경으로 크게 깔렸을 때
 * "간이구나/담낭이구나" 정도로 읽히는 단순 형태면 충분하다.
 *
 * 8체질 확장: 체질별 주도 장기 키에 항목만 추가하면 된다.
 *   금양 lung(폐) / 금음 colon(대장) / 토양 pancreas(췌장) / 토음 stomach(위)
 *   목양 liver(간) / 목음 gallbladder(담낭) / 수양 kidney(신장) / 수음 bladder(방광)
 * 등록되지 않은 키는 저채도 글로우 배경으로 대체된다.
 */
export const ORGAN_SILHOUETTES: Record<string, { viewBox: string; paths: string[] }> = {
  /** 간 — 오른엽이 두툼하고 오른쪽 끝으로 갈수록 얇아지는 쐐기꼴.
   *  중앙~하단 배를 깊게 그려서(뷰박스 세로의 ~95%) 세로로 깔았을 때
   *  아래쪽 인물 행까지 실루엣 안에 들어온다 */
  liver: {
    // viewBox는 패스 실경계에 딱 맞게 — 배경 띠 높이 100%가 곧 실제 그림 높이가
    // 되어 인물 행 전체를 세로로 감싸고, 박스 중심 = 화면 중심(텍스트 축)이 된다
    viewBox: '6 6 382 252',
    paths: [
      'M 12 110' +
        ' C 12 40, 100 10, 190 20' +
        ' C 272 28, 348 62, 374 100' +
        ' C 382 116, 370 138, 344 150' +
        ' C 312 162, 282 176, 252 200' +
        ' C 218 244, 168 258, 116 250' +
        ' C 52 238, 12 164, 12 110 Z',
    ],
  },
  /** 담낭 — 목이 좁고 아래가 불룩한 서양배(주머니)꼴, 위쪽에 짧은 관.
   *  세로로 깔리는 형태라 인물 이름 열을 감싸도록 불룩한 몸통을 넉넉히 그린다 */
  gallbladder: {
    viewBox: '28 10 202 356',
    paths: [
      'M 148 18' +
        ' C 158 40, 150 62, 138 82' +
        ' C 122 110, 96 132, 76 164' +
        ' C 36 228, 34 296, 92 332' +
        ' C 142 360, 206 326, 216 272' +
        ' C 224 216, 196 152, 162 102' +
        ' C 152 82, 140 44, 148 18 Z',
    ],
  },
};

/**
 * PersonTypoCard — 인물 타이포 카드 (섹션 3-g, 4-g)
 *
 * 사양서 1절 제작 방침: 사진·실루엣·초상 일러스트·AI 인물 이미지 전면 금지.
 * 인물은 타이포그래피만으로 표현하고, 시각적 밀도는 배경 장기 실루엣(저채도)과
 * 타이포 등장 리듬으로 보완한다.
 *
 * - 추정 등급 인물은 이 카드에 넣지 않는다 — `추정` 태그 prop도 두지 않는다
 *   (추정 인물은 본문 자막 서식으로 처리, 사양서 4절)
 * - 등장 간격은 appearDelaySec / intervalSec props로 제어 — 하드코딩 없음
 * - 등장한 인물은 사라지지 않고 남아 마지막에 전원이 함께 보인다
 * - 발자국은 CONTENT_MAX_Y(686) 안에서 끝난다 — 하단 disclaimer 자막
 *   (SafetyCaption)과 겹치지 않는다
 * - 색은 공통 팔레트만 사용: 강조색 기본값은 체질 시그니처 컬러
 *   (CONSTITUTION_ACCENTS — 개괄편 섹션3 체질 컷과 동일 톤)
 */
export const PersonTypoCard: React.FC<PersonTypoCardProps> = ({
  constitution,
  constitutionSub,
  people,
  organSilhouette,
  accentColor,
  appearDelaySec = 0.8,
  intervalSec = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent =
    accentColor ??
    CONSTITUTION_ACCENTS[constitution.slice(0, 2) as keyof typeof CONSTITUTION_ACCENTS] ??
    COLORS.greenBright;

  // 단계 0 — 체질명 + 배경이 먼저 뜬다
  const headIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const silhouette = ORGAN_SILHOUETTES[organSilhouette];

  return (
    <>
      {/* [배경] 장기 실루엣 — 저채도·대형. 미등록 키는 글로우로 대체.
          띠가 인물 행 영역(top 268~)을 세로로 덮고, 가로는 flex 중앙 정렬로
          실루엣 중심 = 텍스트 중심. 발자국은 CONTENT_MAX_Y 위에서 끝난다 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 240,
          height: CONTENT_MAX_Y - 240 - 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: headIn,
        }}
      >
        {silhouette ? (
          // 체질색 단색 채움 + 저투명도 = 어두운 배경 위에서 저채도로 읽힌다
          <svg
            viewBox={silhouette.viewBox}
            style={{ height: '100%', opacity: 0.12 }}
          >
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

      {/* [상단] 체질명 고정 노출 */}
      <div style={{ position: 'absolute', top: 132, left: 0, right: 0, textAlign: 'center', opacity: headIn }}>
        {/* 체질명 — 확정 색 칩 */}
        <ConstitutionName name={constitution} fontSize={54} />
        <span style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 30, fontWeight: 600, marginLeft: 16 }}>
          ({constitutionSub})
        </span>
        <div
          style={{
            width: 120,
            height: 4,
            margin: '14px auto 0',
            backgroundColor: accent,
            borderRadius: 2,
            transform: `scaleX(${headIn})`,
          }}
        />
      </div>

      {/* [중앙] 인물 세로 배치 — 인원(2~4)과 무관하게 같은 영역을 균등 분할.
          4인부터는 타이포를 한 단계 줄여 행 합계가 영역(404px)을 넘지 않게 한다
          (4×전체행높이 ≤ 404 — 발자국 CONTENT_MAX_Y 보장) */}
      {(() => {
        const compact = people.length >= 4;
        const SIZES = compact
          ? { titleH: 30, title: 22, name: 46 }
          : { titleH: 34, title: 25, name: 58 };
        return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 268,
          height: CONTENT_MAX_Y - 268 - 22,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        {people.map((p, i) => {
          const start = Math.round((appearDelaySec + i * intervalSec) * fps);

          // 리듬: 수식어(소) 먼저 → 이름(대)이 스프링 상승 → 밑줄이 그어짐
          const titleIn = interpolate(frame, [start, start + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const nameSpring = spring({
            frame: frame - start - 5,
            fps,
            config: { damping: 16, stiffness: 120 },
            from: 0,
            to: 1,
          });
          const underline = interpolate(frame, [start + 12, start + 26], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div key={i} style={{ textAlign: 'center' }}>
              {/* 수식어 줄 — title이 없어도 높이를 차지해 행 리듬을 유지한다 */}
              <div
                style={{
                  height: SIZES.titleH,
                  opacity: titleIn,
                  color: accent,
                  fontFamily: FONT,
                  fontSize: SIZES.title,
                  fontWeight: 700,
                  letterSpacing: 3,
                }}
              >
                {p.title ?? ''}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  opacity: nameSpring,
                  transform: `translateY(${(1 - nameSpring) * 26}px)`,
                }}
              >
                <div
                  style={{ color: COLORS.text, fontFamily: FONT, fontSize: SIZES.name, fontWeight: 800, lineHeight: 1.2 }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    height: 3,
                    marginTop: 6,
                    backgroundColor: accent,
                    borderRadius: 2,
                    transform: `scaleX(${underline})`,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
        );
      })()}
    </>
  );
};

/** 목양·목음편 데이터 (사양서 2절) */
export const MOK_YANG_CARD: PersonTypoCardProps = {
  constitution: '목양체질',
  constitutionSub: '木陽 · Hepatonia',
  organSilhouette: 'liver',
  people: [
    { title: '삼성 창업주', name: '이병철' },
    { title: '전 대통령', name: '전두환' },
    { name: '육영수' },
  ],
};

export const MOK_EUM_CARD: PersonTypoCardProps = {
  constitution: '목음체질',
  constitutionSub: '木陰 · Cholecystonia',
  organSilhouette: 'gallbladder',
  people: [
    { title: '전 대통령', name: '김영삼' },
    { title: '회장', name: '이건희' },
    { title: '철학자', name: '김용옥' },
  ],
};

/** 프리뷰 길이(프레임) — 단계0 + 인원×간격 + 잔상 2.5초 */
export const personTypoCardFrames = (
  props: Pick<PersonTypoCardProps, 'people' | 'appearDelaySec' | 'intervalSec'>,
  fps = 30,
): number => {
  const delay = props.appearDelaySec ?? 0.8;
  const interval = props.intervalSec ?? 1.5;
  return Math.round((delay + (props.people.length - 1) * interval + 2.5) * fps);
};

/** 검수용 단독 프리뷰 — 목양(3인, 수식어 없는 인물 포함) */
export const PersonTypoCardPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <PersonTypoCard {...MOK_YANG_CARD} />
  </AbsoluteFill>
);
