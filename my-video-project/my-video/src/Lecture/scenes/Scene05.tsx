import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';
import { SlideLayout } from '../components/SlideLayout';
import { FadeText } from '../components/FadeText';

/** 장면5 — 비교표 (레팬4, 15초) */
export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();

  const rows = [
    { label: '역할', food: '보조', drug: '대신' },
    { label: '효과', food: '부드러움', drug: '강력함' },
    { label: '장기복용', food: '안전', drug: '주의 필요 ⚠️' },
  ];

  return (
    <SlideLayout avatarImage="레팬4.png">
      {/* 표 제목 */}
      <FadeText delay={0} duration={18}>
        <div style={{ fontSize: 44, color: COLORS.darkGreen, fontFamily: FONT, fontWeight: 800, marginBottom: 4 }}>
          음식 vs 약물 비교
        </div>
      </FadeText>

      {/* 표 */}
      <FadeText delay={10} duration={15}>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${COLORS.cardBorder}` }}>
          {/* 헤더 */}
          <div style={{ display: 'flex', backgroundColor: COLORS.topBar }}>
            {['구분', '음식', '약물'].map((h, i) => (
              <div
                key={h}
                style={{
                  flex: i === 0 ? 0.8 : 1,
                  padding: '18px 20px',
                  color: COLORS.white,
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 34,
                  textAlign: 'center',
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* 행 순차 등장 */}
          {rows.map((row, idx) => {
            const rowOpacity = interpolate(frame, [20 + idx * 22, 40 + idx * 22], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const rowY = interpolate(frame, [20 + idx * 22, 40 + idx * 22], [16, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  backgroundColor: idx % 2 === 0 ? COLORS.greenLight : COLORS.cardBg,
                  opacity: rowOpacity,
                  transform: `translateY(${rowY}px)`,
                  borderTop: `1px solid ${COLORS.cardBorder}`,
                }}
              >
                <div style={{ flex: 0.8, padding: '16px 20px', fontFamily: FONT, fontWeight: 700, fontSize: 34, color: COLORS.blue, textAlign: 'center' }}>
                  {row.label}
                </div>
                <div style={{ flex: 1, padding: '16px 20px', fontFamily: FONT, fontSize: 34, color: COLORS.topBar, textAlign: 'center', fontWeight: 600 }}>
                  {row.food}
                </div>
                <div style={{ flex: 1, padding: '16px 20px', fontFamily: FONT, fontSize: 34, color: COLORS.red, textAlign: 'center', fontWeight: 600 }}>
                  {row.drug}
                </div>
              </div>
            );
          })}
        </div>
      </FadeText>
    </SlideLayout>
  );
};
