import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { SectionBadge } from '../components/SectionBadge';
import { SourceCaptions } from '../components/SourceCaptions';
import { Subtitles, type Cue } from '../components/Subtitles';

interface Row {
  label: string;
  sasang: string;
  ecm: string;
}

const ROWS: Row[] = [
  { label: '보는 장기의 수', sasang: '간·비·폐·신 4장기의 대소\n→ 4체질', ecm: '12기관 전체의 강약 배열\n→ 8체질' },
  { label: '치료 도구', sasang: '약물 치료 중심', ecm: '체질침 + 체질 섭생표' },
  { label: '진단법', sasang: '성격·체형·약물반응 종합 유추', ecm: '요골동맥 맥진 (평생 불변)' },
];

/** 표의 한 행 (프레임 임계값에서 페이드+슬라이드 인) */
const TableRow: React.FC<{ row: Row; appearAt: number }> = ({ row, appearAt }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [appearAt, appearAt + 16], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cell: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 38,
    fontWeight: 600,
    lineHeight: 1.4,
    padding: '28px 32px',
    whiteSpace: 'pre-line',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        display: 'grid',
        gridTemplateColumns: '360px 1fr 1fr',
        borderTop: `2px solid rgba(255,255,255,0.12)`,
      }}
    >
      <div style={{ ...cell, color: COLORS.gold, fontWeight: 800, justifyContent: 'flex-end', textAlign: 'right' }}>
        {row.label}
      </div>
      <div style={{ ...cell, color: COLORS.textDim, backgroundColor: 'rgba(255,255,255,0.02)' }}>{row.sasang}</div>
      <div style={{ ...cell, color: COLORS.text, backgroundColor: 'rgba(82,183,136,0.10)' }}>{row.ecm}</div>
    </div>
  );
};

/** 섹션4 — 사상의학과 무엇이 다른가 (비교표 중심) */
export const Section04: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const headOpacity = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 행 등장 시점을 섹션 길이에 비례해 배치
  const rowAppear = [0.16, 0.46, 0.72].map((f) => Math.round(durationInFrames * f));

  const cues: Cue[] = [
    { fromSec: 0, text: '"사상의학의 네 체질을 둘씩 쪼갠 게 8체질 아닌가요?"' },
    { fromSec: 6, text: '아닙니다. 두 의학은 출발점부터 진단법, 치료법까지\n많은 부분에서 차이가 있습니다.' },
    { fromSec: 14, text: '첫째, 보는 장기의 수가 다릅니다.' },
    // ★v5: "네 장기의 대소만을 기준으로" → "4개 장기의 대소로"
    { fromSec: 20, text: '사상의학은 간·비·폐·신, 4개 장기의 대소로\n사람을 넷으로 나눕니다.' },
    { fromSec: 27, text: '8체질의학은 12기관 전체의 강약 배열로 여덟 체질을 정립합니다.' },
    { fromSec: 35, text: '둘째, 치료 도구가 다릅니다.' },
    { fromSec: 41, text: '사상은 약물 중심,\n8체질은 체질침과 체질 섭생표를 씁니다.' },
    { fromSec: 49, text: '셋째, 진단법이 다릅니다.' },
    { fromSec: 55, text: '8체질의학은 평생 변하지 않는 맥진으로 체질을 감별합니다.' },
    // v4: 요약 문장 신설(새 문안)
    { fromSec: 62, text: '요약하면, 두 의학은 이론·진단·치료 모든 부분에서 달라\n별개의 의학체계로 보는 것이 맞습니다.' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div style={{ position: 'absolute', top: 80, left: 120 }}>
        <SectionBadge label="무엇이 다른가" title="사상의학 vs 8체질의학" />
      </div>

      {/* 표 헤더 */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 120,
          right: 120,
          opacity: headOpacity,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 1fr' }}>
          <div />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.textDim,
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            사상의학
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 900,
              color: COLORS.greenBright,
              textAlign: 'center',
              padding: '20px 0',
              backgroundColor: 'rgba(82,183,136,0.14)',
              borderRadius: '12px 12px 0 0',
            }}
          >
            8체질의학
          </div>
        </div>

        {ROWS.map((r, i) => (
          <TableRow key={r.label} row={r} appearAt={rowAppear[i]} />
        ))}
      </div>

      {/* v4 화면 대표 출처 */}
      <SourceCaptions cues={[{ fromSec: 0, text: '출처: 빛과소금 94-8월호, 95-5월호, 96-12월호' }]} />
      <Subtitles cues={cues} />
    </AbsoluteFill>
  );
};
