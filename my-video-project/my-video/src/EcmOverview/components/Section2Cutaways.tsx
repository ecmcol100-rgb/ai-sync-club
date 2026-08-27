import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../constants';
import { SourceCaptions } from './SourceCaptions';

/* ──────────────────────────────────────────────────────────────────
 * A. CarnivoreColonCut — 육식동물 대장 비유 컷 (섹션 2 보조)
 *
 * Section2b 사양서 B-3이 "이 도식에 넣으면 복잡해진다"며 별도 컷으로
 * 분리한 비유. 문안은 스펙 v5 섹션 2 내레이션(「중환자와 채식」 94-5월호)
 * 의 인과 순서를 그대로 따른다:
 *   대장이 짧다(구조) → 간이 강하다는 뜻 → 그것이 육식동물이 "된" 이유
 * ★ 8체질의학은 구조가 먼저이고 먹이가 결과다 — "몸이 먹이에 맞게
 * 만들어졌다"식의 역방향 서술을 쓰지 않는다.
 *
 * 비주얼은 비교 막대 2행(육식동물 짧다 / 초식동물 길다) — 길이 대비로
 * "짧다"가 즉시 읽힌다. 동물 이미지 없음(시리즈 실사 금지), 추상 캡슐이라
 * 해부 도해로 읽히지 않는다. 두 동물은 중립색 — 선악·우열 없음.
 * ────────────────────────────────────────────────────────────────── */

export interface CarnivoreColonCutProps {
  /** 상단 — 관찰 문장 (구조가 원인이라는 원자료의 출발점) */
  headline?: string;
  /** 비교 막대 2행: [라벨, 설명, 바 길이(px)] */
  rows?: { label: string; desc: string; barW: number }[];
  /** 하단 결론(gold) — 구조 → 육식동물이 된 이유 */
  takeaway?: string;
  stageStartsSec?: [number, number, number];
  source?: string;
}

export const CarnivoreColonCut: React.FC<CarnivoreColonCutProps> = ({
  headline = '육식동물은 대장이 짧습니다',
  rows = [
    { label: '육식동물', desc: '대장이 짧다', barW: 380 },
    { label: '초식동물', desc: '대장이 길다', barW: 1100 },
  ],
  takeaway = '대장이 짧다는 것은 간이 강하다는 뜻이고,\n그것이 육식동물이 된 이유입니다',
  stageStartsSec = [0, 2.5, 7],
  source = '출처: 빛과소금 94-5월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [s1, s2, s3] = stageStartsSec;

  const in1 = interpolate(frame, [s1 * fps, s1 * fps + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const in3 = interpolate(frame, [s3 * fps, s3 * fps + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* 관찰 — 구조가 출발점 */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: in1,
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 54,
          fontWeight: 800,
        }}
      >
        {headline}
      </div>

      {/* 비교 막대 — 길이 대비로 "짧다"가 읽힌다 */}
      {rows.map((r, i) => {
        const start = s2 + i * 1.6;
        const rowIn = interpolate(frame, [start * fps, start * fps + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const grow = interpolate(frame, [start * fps + 6, start * fps + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={r.label} style={{ position: 'absolute', left: 260, top: 290 + i * 140, opacity: rowIn }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <div style={{ width: 210, color: COLORS.text, fontFamily: FONT, fontSize: 40, fontWeight: 800 }}>
                {r.label}
              </div>
              <div
                style={{
                  width: r.barW * grow,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  border: `2px solid ${COLORS.greenPale}`,
                }}
              />
              <div
                style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 32, fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {r.desc}
              </div>
            </div>
          </div>
        );
      })}

      {/* 결론 — 구조가 먼저, 먹이는 결과 */}
      <div
        style={{
          position: 'absolute',
          top: 552,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: in3,
          color: COLORS.gold,
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 800,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
        }}
      >
        {takeaway}
      </div>

      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

/* ──────────────────────────────────────────────────────────────────
 * B. FoodListPanel — 섹션 2 음식 품목 자막
 *
 * Section2b 사양서 B-3: "음식 품목 나열은 도식이 아니라 별도 자막".
 * 품목은 ComparisonTable 음식 행(shared)과 동일 데이터.
 * 색 의미는 2-b 도식과 동일 — green=맞는 방향 / red=주의(과잉 방향).
 * 주의 그룹에 X·경고 아이콘은 쓰지 않는다.
 * ────────────────────────────────────────────────────────────────── */

export interface FoodGroup {
  label: string;
  items: string[];
  color: string;
}

export interface FoodListPanelProps {
  groups?: FoodGroup[];
  /** 그룹별 등장 시각(초) */
  stageStartsSec?: number[];
  source?: string;
}

export const FoodListPanel: React.FC<FoodListPanelProps> = ({
  groups = [
    {
      label: '맞는 음식',
      items: ['육식', '무', '당근', '도라지', '마늘', '버섯', '호박'],
      color: COLORS.greenBright,
    },
    {
      label: '주의가 필요한 음식',
      items: ['해물', '푸른 잎채소', '포도'],
      color: COLORS.red,
    },
  ],
  stageStartsSec = [0, 3],
  source = '출처: 빛과소금 94-5월호',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {groups.map((g, gi) => {
        const start = stageStartsSec[gi] ?? gi * 3;
        const groupIn = interpolate(frame, [start * fps, start * fps + 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={g.label} style={{ position: 'absolute', left: 160, top: 220 + gi * 210, opacity: groupIn }}>
            <div style={{ color: g.color, fontFamily: FONT, fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>
              {g.label}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 20, flexWrap: 'wrap', width: 1600 }}>
              {g.items.map((item, i) => {
                const chipIn = interpolate(
                  frame,
                  [(start + 0.25 + i * 0.22) * fps, (start + 0.25 + i * 0.22) * fps + 8],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                );
                return (
                  <div
                    key={item}
                    style={{
                      opacity: chipIn,
                      transform: `translateY(${(1 - chipIn) * 12}px)`,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: `2px solid ${g.color}`,
                      borderRadius: 12,
                      padding: '16px 30px',
                      color: COLORS.text,
                      fontFamily: FONT,
                      fontSize: 36,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <SourceCaptions cues={[{ fromSec: 0, text: source }]} />
    </>
  );
};

export const CARNIVORE_PREVIEW_FRAMES = 10 * 30;
export const FOODLIST_PREVIEW_FRAMES = 8 * 30;

export const CarnivoreColonCutPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <CarnivoreColonCut />
  </AbsoluteFill>
);

export const FoodListPanelPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <FoodListPanel />
  </AbsoluteFill>
);
