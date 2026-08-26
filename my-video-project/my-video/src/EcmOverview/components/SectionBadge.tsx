import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT } from '../constants';

interface SectionBadgeProps {
  /** 상단 작은 라벨 (예: '핵심 원리') */
  label: string;
  /** 큰 제목 */
  title: string;
  delay?: number;
}

/** 섹션 상단 좌측의 라벨 + 제목 블록 (좌에서 슬라이드 인) */
export const SectionBadge: React.FC<SectionBadgeProps> = ({ label, title, delay = 6 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(frame, [delay, delay + 14], [-40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateX(${x}px)` }}>
      <div
        style={{
          display: 'inline-block',
          backgroundColor: COLORS.green,
          color: COLORS.white,
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 4,
          padding: '8px 20px',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.2,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </div>
    </div>
  );
};
