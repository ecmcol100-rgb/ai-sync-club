import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT, FPS } from '../constants';
import { useBottomLayout } from '../bottomLayout';

export interface Cue {
  /** 자막 노출 시작 시각(초, 섹션 내부 기준) */
  fromSec: number;
  /** 자막 텍스트 (\n 으로 줄바꿈 가능 — 두 줄까지) */
  text: string;
  /** 강조 자막 — 강조 색·테두리로 표시 (핵심 문구) */
  emphasis?: boolean;
}

interface SubtitlesProps {
  cues: Cue[];
}

/**
 * 화면 하단 내레이션 자막.
 *
 * 각 cue의 fromSec 부터 다음 cue 직전까지 노출되며, 등장은 짧은 페이드로
 * 처리한다. 섹션 Sequence 내부에서 사용하므로 useCurrentFrame() 은 섹션 시작
 * 기준(0부터)으로 동작한다.
 *
 * 글자 크기·여백·바닥선은 하단 레이아웃 프로파일(bottomLayout.ts)에서 온다.
 * 상자는 바닥선을 고정하고 위로 자라며, 2줄일 때 위 모서리가 NARRATION_TOP에
 * 닿는다 — 그 위의 disclaimer·항목 행과 겹치지 않는다.
 * - series: 60px, 2줄 상자 204px (bottom 78)
 * - legacy: 개괄영상 v5 확정 렌더 값 (40px, bottom 56)
 */
export const Subtitles: React.FC<SubtitlesProps> = ({ cues }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const { narration: n } = useBottomLayout();

  // 현재 활성 cue 찾기
  let activeIdx = -1;
  for (let i = 0; i < cues.length; i++) {
    if (sec >= cues[i].fromSec) activeIdx = i;
  }
  if (activeIdx < 0) return null;

  const cue = cues[activeIdx];
  // 빈 텍스트 cue는 자막 소거 센티널 — 무음 구간(대조표 등)에서 이전 자막을 내린다
  if (!cue.text) return null;
  const startFrame = cue.fromSec * FPS;
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: n.bottom,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 160px',
        zIndex: 50,
      }}
    >
      <div
        data-probe="narration"
        style={{
          opacity,
          maxWidth: n.maxWidth,
          backgroundColor: cue.emphasis ? 'rgba(27, 67, 50, 0.85)' : 'rgba(8, 16, 13, 0.72)',
          border: cue.emphasis ? `2px solid ${COLORS.gold}` : 'none',
          borderRadius: 14,
          padding: cue.emphasis ? `${n.emphasisPadY}px ${n.emphasisPadX}px` : `${n.padY}px ${n.padX}px`,
          color: cue.emphasis ? COLORS.gold : COLORS.text,
          fontFamily: FONT,
          fontSize: cue.emphasis ? n.emphasisFontSize : n.fontSize,
          fontWeight: cue.emphasis ? 800 : 500,
          lineHeight: n.lineHeight,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          boxShadow: cue.emphasis ? '0 10px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.35)',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
