import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, CREDIT, FONT, FPS, IMAGES, ecm } from '../constants';
import { SourceCaptions } from '../components/SourceCaptions';
import { SectionBadge } from '../components/SectionBadge';
import { Subtitles, type Cue } from '../components/Subtitles';

interface Photo {
  src: string;
  name: string;
  credit: string;
  /** 아직 확보되지 않은 사진 — 실제 이미지 대신 자리표시(placeholder) 박스로 표시 */
  placeholder?: boolean;
}

interface Constitution {
  hanja: string;
  eng: string;
  ko: string;
  organ: string;
  desc: string;
  accent: string;
  photos: Photo[];
  /** 사진 없이 이름+실루엣으로만 표기할 인물 */
  silhouettes: string[];
  /** 추정 인물 여부 (자막 '추정' 표기) */
  estimate?: boolean;
  /** 희귀 체질 그래픽 사용 */
  rare?: boolean;
  /** 우하단 출처 자막 (특징 출처 + 인물 출처) — 스펙 §섹션3 비주얼 괄호 기준 */
  source: string;
}

const CONSTITUTIONS: Constitution[] = [
  {
    hanja: '金陽',
    eng: 'Pulmotonia',
    ko: '금양체질',
    organ: '폐가 강한 체질',
    desc: '창의력으로 새 기원을 여는 이상가형\n육식을 안 하는 것이 중요',
    accent: '#52B788', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [
      { src: ecm('kwon_4.jpg'), name: '권도원', credit: CREDIT.ecmed },
      { src: ecm('rhee_syngman.gif'), name: '이승만', credit: CREDIT.archive },
    ],
    silhouettes: [],
    source: '출처: 빛과소금 94-8월호, 96-3월호 / 월간조선 2011년 5월호',
  },
  {
    hanja: '金陰',
    eng: 'Colonotonia',
    ko: '금음체질',
    organ: '대장이 강한 체질',
    desc: '세상을 꿰뚫어 보는 직관력과 야심\n위대한 정치가 중에 많음',
    accent: '#457B9D', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [
      { src: ecm('park_chunghee.jpg'), name: '박정희', credit: CREDIT.archive },
      { src: ecm('roh_moohyun.jpg'), name: '노무현', credit: CREDIT.archive },
    ],
    silhouettes: [],
    source: '출처: 빛과소금 96-3월호 / 월간조선 2011년 5월호',
  },
  {
    hanja: '土陽',
    eng: 'Pancreotonia',
    ko: '토양체질',
    organ: '췌장이 강한 체질',
    desc: "부지런한 '빨리빨리' 체질\n성직자, 예술가 중에 많음",
    accent: '#D4A24E', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    // v3: 타이포/실루엣 → public 폴더 사진 사용. credit '' → 사진 출처 표기 없음(스펙 확정)
    photos: [{ src: IMAGES.michaelJackson, name: '마이클 잭슨', credit: '' }],
    silhouettes: [],
    estimate: true,
    source: '출처: 빛과소금 94-8월호, 96-3월호',
  },
  {
    hanja: '土陰',
    eng: 'Gastrotonia',
    ko: '토음체질',
    organ: '위가 강한 체질',
    desc: '1년에 한 번 볼까 말까 한 희귀 체질',
    accent: '#B07BC4', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [],
    silhouettes: [],
    rare: true,
    source: '출처: 빛과소금 94-8월호, 95-7월호',
  },
  {
    hanja: '木陽',
    eng: 'Hepatonia',
    ko: '목양체질',
    organ: '간이 강한 체질',
    // ★v5: "과묵하고 덕이 있어 보이는 체질" 복원
    desc: '과묵하고 덕이 있어 보이는 체질\n말 없이 신망을 얻어 지도자, 기업가 중에 많음',
    accent: '#7F9E5E', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    // ★v5: 이병철 회장 삭제 (내레이션·실루엣·근거 모두 제거)
    photos: [{ src: ecm('chun_doohwan.jpg'), name: '전두환', credit: CREDIT.archive }],
    silhouettes: [],
    source: '출처: 빛과소금 94-8월호, 96-3월호',
  },
  {
    hanja: '木陰',
    eng: 'Cholecystonia',
    ko: '목음체질',
    organ: '담낭이 강한 체질',
    desc: '던지고 차는 운동에 탁월하고 감성적인 체질\n박세리·박찬호 선수도 이 체질로 추정',
    accent: '#6FB3A8', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [{ src: ecm('kim_youngsam.jpg'), name: '김영삼', credit: CREDIT.archive }],
    silhouettes: [],
    source: '출처: 권도원, 「8체질을 압시다」, 빛과소금 1994년 8월호',
  },
  {
    hanja: '水陽',
    eng: 'Renotonia',
    ko: '수양체질',
    organ: '신장이 강한 체질',
    desc: "세심하고 정확한 정리의 달인\n'돌다리도 두드려보고 건너는' 신중한 성격",
    accent: '#5B8DBE', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [{ src: ecm('kim_daejung.jpg'), name: '김대중', credit: CREDIT.archive }],
    silhouettes: [],
    source: '출처: 빛과소금 94-8월호, 96-3월호',
  },
  {
    hanja: '水陰',
    eng: 'Vesicotonia',
    ko: '수음체질',
    organ: '방광이 강한 체질',
    // ★v5: "소식이 건강법인 체질" 복원
    desc: '소식이 건강법인 체질\n겉은 부드럽지만 속은\n냉철·강단 있는 외유내강형',
    accent: '#8FA8C9', // 개괄편 v5 확정 톤 (심화편 확정 색과 별개)
    photos: [{ src: ecm('churchill.jpg'), name: '윈스턴 처칠', credit: CREDIT.wiki }],
    silhouettes: [],
    estimate: true,
    source: '출처: 빛과소금 94-8월호 / ecmed.org 체질별 설명',
  },
];

/** 사진 없는 인물용 실루엣 흉상 */
const Silhouette: React.FC<{ name: string; accent: string }> = ({ name, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    <div
      style={{
        width: 300,
        height: 360,
        borderRadius: 16,
        border: `3px dashed ${accent}`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg width="200" height="240" viewBox="0 0 200 240">
        <circle cx="100" cy="80" r="52" fill={accent} opacity="0.5" />
        <path d="M20 240 C20 150 60 130 100 130 C140 130 180 150 180 240 Z" fill={accent} opacity="0.5" />
      </svg>
    </div>
    <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 34, fontWeight: 700 }}>{name}</div>
  </div>
);

/** 인물 사진 카드 (placeholder 인 경우 자리표시 박스) */
const PersonPhoto: React.FC<{ photo: Photo; accent: string }> = ({ photo, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    {photo.placeholder ? (
      <div
        style={{
          width: 300,
          height: 360,
          borderRadius: 16,
          border: `3px dashed ${accent}`,
          backgroundColor: 'rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.8">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 26, fontWeight: 600 }}>사진 준비 중</div>
      </div>
    ) : (
      <div
        style={{
          width: 300,
          height: 360,
          borderRadius: 16,
          overflow: 'hidden',
          border: `3px solid ${accent}`,
          boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
        }}
      >
        <Img
          src={staticFile(photo.src)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
    )}
    <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 34, fontWeight: 700 }}>{photo.name}</div>
  </div>
);

/** 희귀 체질 그래픽 — 군중 속 한 명만 강조 */
const RareCrowd: React.FC<{ accent: string }> = ({ accent }) => {
  const cols = 12;
  const rows = 5;
  const highlight = 27;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: i === highlight ? accent : 'rgba(255,255,255,0.14)',
            transform: i === highlight ? 'scale(1.4)' : 'none',
            boxShadow: i === highlight ? `0 0 20px ${accent}` : 'none',
          }}
        />
      ))}
    </div>
  );
};

/** 개별 체질 카드 */
const ConstitutionCard: React.FC<{ c: Constitution; index: number }> = ({ c, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 80 }, from: 0, to: 1 });
  const textX = interpolate(enter, [0, 1], [-50, 0]);

  // 여러 출처가 섞인 카드는 '사진 출처:' 접두사를 한 번만 붙이고 소스만 나열.
  // credit 이 빈 문자열인 사진(예: 마이클 잭슨)은 출처 표기 생략.
  const PREFIX = '사진 출처: ';
  const sources = Array.from(
    new Set(c.photos.map((p) => p.credit).filter(Boolean).map((cr) => cr.replace(PREFIX, ''))),
  );
  const creditText = sources.length > 0 ? PREFIX + sources.join(' · ') : '';

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* 좌측 색 바 */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, backgroundColor: c.accent }} />

      {/* 좌측 텍스트 */}
      <div style={{ position: 'absolute', left: 120, top: 300, width: 780, opacity: enter, transform: `translateX(${textX}px)` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span style={{ color: c.accent, fontFamily: FONT, fontSize: 130, fontWeight: 900, lineHeight: 1 }}>
            {c.hanja}
          </span>
          <span style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 44, fontWeight: 600 }}>{c.eng}</span>
        </div>
        <div style={{ color: COLORS.text, fontFamily: FONT, fontSize: 56, fontWeight: 800, marginTop: 8 }}>
          {c.ko}
          <span style={{ color: c.accent, fontSize: 36, fontWeight: 700, marginLeft: 16 }}>{c.organ}</span>
        </div>
        <div
          style={{
            color: COLORS.textDim,
            fontFamily: FONT,
            fontSize: 40,
            fontWeight: 500,
            marginTop: 24,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}
        >
          {c.desc}
        </div>
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 26, fontWeight: 500, marginTop: 40 }}>
          {index + 1} / 8
        </div>
      </div>

      {/* 우측 인물/그래픽 */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 260,
          display: 'flex',
          gap: 40,
          alignItems: 'center',
          opacity: enter,
        }}
      >
        {c.rare ? (
          <RareCrowd accent={c.accent} />
        ) : (
          <>
            {c.photos.map((p) => (
              <PersonPhoto key={p.name} photo={p} accent={c.accent} />
            ))}
            {c.silhouettes.map((n) => (
              <Silhouette key={n} name={n} accent={c.accent} />
            ))}
          </>
        )}
      </div>

      {/* 추정 배지 */}
      {c.estimate && (
        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 200,
            backgroundColor: 'rgba(212,162,78,0.9)',
            color: '#1B120A',
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 800,
            padding: '6px 18px',
            borderRadius: 8,
          }}
        >
          추정
        </div>
      )}

      <SourceCaptions
        cues={[
          // 특징 출처 + 인물 출처
          { fromSec: 0, text: c.source },
          // 사진 출처 (사진이 있는 카드만)
          ...(creditText ? [{ fromSec: 0, text: creditText }] : []),
        ]}
      />
    </AbsoluteFill>
  );
};

/** ★v5 도입 다이어그램용 미니 데이터: 체질명 → 최강 장기 */
const TYPE_ORGAN_MAP = [
  { hanja: '金陽', ko: '금양', organ: '폐 肺', hl: true },
  { hanja: '金陰', ko: '금음', organ: '대장 大腸', hl: true },
  { hanja: '土陽', ko: '토양', organ: '췌장 膵' },
  { hanja: '土陰', ko: '토음', organ: '위 胃' },
  { hanja: '木陽', ko: '목양', organ: '간 肝' },
  { hanja: '木陰', ko: '목음', organ: '담낭 膽' },
  { hanja: '水陽', ko: '수양', organ: '신장 腎' },
  { hanja: '水陰', ko: '수음', organ: '방광 膀胱' },
] as const;

/**
 * ★v5 섹션3 도입 화면 — 12기관 강약 배열 → 8체질 분화 다이어그램 (B안).
 * ① 좌측: 강→약 서열 바 ② 여덟 갈래 분화 ③ "체질명 = 가장 강한 장기" 예시
 * (금양 → 폐, 금음 → 대장 하이라이트) ④ 도입 내레이션 자막(누락 수정)
 */
const IntroDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introCues: Cue[] = [
    { fromSec: 0, text: '체질은 앞서 언급한 것처럼 12기관의 강약 배열에 따라\n여덟 개로 구분합니다.' },
    { fromSec: 4.5, text: '체질의 명칭은 가장 강한 장기를 의미합니다.' },
    { fromSec: 7, text: '예를 들어 금양체질은 폐, 금음체질은 대장입니다.' },
  ];

  const arrowOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 금양→폐, 금음→대장 예시 하이라이트는 해당 내레이션(7초)에 맞춰 강조
  const hlBoost = interpolate(frame, [7 * FPS, 7 * FPS + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ① 좌측 — 12기관 강약 서열 바 */}
      <div style={{ position: 'absolute', left: 120, top: 300 }}>
        <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700, marginBottom: 18 }}>
          12기관 강약 배열
        </div>
        {Array.from({ length: 12 }).map((_, i) => {
          const s = spring({ frame: frame - i * 3, fps, config: { damping: 15, stiffness: 90 }, from: 0, to: 1 });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
              <div
                style={{
                  width: (360 - i * 20) * s,
                  height: 24,
                  borderRadius: 6,
                  background: `linear-gradient(to right, ${COLORS.greenBright}, ${COLORS.blue})`,
                  opacity: 0.35 + (11 - i) * 0.055,
                }}
              />
              {i === 0 && <span style={{ color: COLORS.text, fontFamily: FONT, fontSize: 24, fontWeight: 700, opacity: s }}>강</span>}
              {i === 11 && <span style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 24, fontWeight: 500, opacity: s }}>약</span>}
            </div>
          );
        })}
      </div>

      {/* ② 중앙 — 분화 화살표 */}
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 480,
          width: 200,
          textAlign: 'center',
          opacity: arrowOpacity,
        }}
      >
        <div style={{ color: COLORS.gold, fontFamily: FONT, fontSize: 64, fontWeight: 900 }}>→</div>
        <div style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 26, fontWeight: 600, marginTop: 4 }}>
          여덟 가지 배열
        </div>
      </div>

      {/* ③ 우측 — 8체질 칩 (체질명 = 가장 강한 장기) */}
      <div
        style={{
          position: 'absolute',
          left: 840,
          right: 120,
          top: 310,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
        }}
      >
        {TYPE_ORGAN_MAP.map((t, i) => {
          const s = spring({ frame: frame - 40 - i * 4, fps, config: { damping: 15, stiffness: 90 }, from: 0, to: 1 });
          const isHl = 'hl' in t && t.hl;
          return (
            <div
              key={t.ko}
              style={{
                opacity: s,
                transform: `translateY(${(1 - s) * 20}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isHl ? `rgba(212,162,78,${0.08 + hlBoost * 0.14})` : 'rgba(255,255,255,0.05)',
                border: isHl ? `3px solid ${COLORS.gold}` : '2px solid rgba(255,255,255,0.14)',
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <span style={{ color: COLORS.text, fontFamily: FONT, fontSize: 36, fontWeight: 800 }}>
                {t.hanja} <span style={{ fontSize: 30, fontWeight: 700 }}>{t.ko}</span>
              </span>
              <span
                style={{
                  color: isHl ? COLORS.gold : COLORS.textDim,
                  fontFamily: FONT,
                  fontSize: 30,
                  fontWeight: isHl ? 800 : 600,
                  transform: isHl ? `scale(${1 + hlBoost * 0.12})` : undefined,
                }}
              >
                → {t.organ}
              </span>
            </div>
          );
        })}
      </div>

      {/* 도입 화면 출처 (1개 → 전체 표기) + 내레이션 자막 (★v5 누락 수정) */}
      <SourceCaptions cues={[{ fromSec: 0, text: '출처: 권도원, 「8체질을 압시다」, 빛과소금 1994년 8월호' }]} />
      <Subtitles cues={introCues} />
    </AbsoluteFill>
  );
};

/** ★v5 도입(다이어그램) 길이(초) — 이후 8컷이 나머지를 균등 분할 */
const INTRO_SEC = 10;

/** 섹션3 — 여덟 가지 체질 (도입 다이어그램 + 8컷) */
export const Section03: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const introFrames = INTRO_SEC * FPS;
  const slot = (durationInFrames - introFrames) / CONSTITUTIONS.length;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ★v5 도입 — 12기관→8체질 분화 다이어그램 (카드 그리드 대체) */}
      <Sequence  durationInFrames={introFrames}>
        <IntroDiagram />
      </Sequence>

      {CONSTITUTIONS.map((c, i) => (
        <Sequence key={c.ko} from={introFrames + Math.round(i * slot)} durationInFrames={Math.round(slot)}>
          <ConstitutionCard c={c} index={i} />
        </Sequence>
      ))}

      {/* 배지는 카드(불투명 배경) 위에 그려지도록 뒤에 배치 */}
      <div style={{ position: 'absolute', top: 80, left: 120, zIndex: 20 }}>
        <SectionBadge label="여덟 가지 체질" title="가장 강한 장기로 나뉜다" />
      </div>

      {/* 고정 하단 디스클레이머 — 성격 묘사 구간(8컷)에만 노출.
          ★v5 자막 안전 영역(하단 160px) 위, 좌측 정렬(우측 출처 자막과 충돌 방지) */}
      <Sequence from={introFrames}>
        <div
          style={{
            position: 'absolute',
            bottom: 170,
            left: 120,
            zIndex: 70,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.62)',
              borderRadius: 12,
              padding: '14px 40px',
              color: COLORS.white,
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다.
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
