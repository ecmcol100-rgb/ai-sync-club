import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT, FPS } from '../constants';

export interface Cue {
  /** 자막 노출 시작 시각(초, 섹션 내부 기준) */
  fromSec: number;
  /** 자막 텍스트 (\n 으로 줄바꿈 가능) */
  text: string;
  /** 강조 자막 — 더 크고 강조 색으로 표시 (핵심 문구) */
  emphasis?: boolean;
}

interface SubtitlesProps {
  cues: Cue[];
}

/**
 * 화면 하단 내레이션 자막.
 *
 * 나중에 오디오로 대체될 임시 자막이다. 각 cue의 fromSec 부터 다음 cue 직전까지
 * 노출되며, 등장/퇴장은 짧은 페이드로 처리한다. 섹션 Sequence 내부에서 사용하므로
 * useCurrentFrame() 은 섹션 시작 기준(0부터)으로 동작한다.
 */
export const Subtitles: React.FC<SubtitlesProps> = ({ cues }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;

  // 현재 활성 cue 찾기
  let activeIdx = -1;
  for (let i = 0; i < cues.length; i++) {
    if (sec >= cues[i].fromSec) activeIdx = i;
  }
  if (activeIdx < 0) return null;

  const cue = cues[activeIdx];
  const startFrame = cue.fromSec * FPS;
  const opacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 160px',
        zIndex: 50,
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: 1500,
          backgroundColor: cue.emphasis ? 'rgba(27, 67, 50, 0.85)' : 'rgba(8, 16, 13, 0.72)',
          border: cue.emphasis ? `2px solid ${COLORS.gold}` : 'none',
          borderRadius: 14,
          padding: cue.emphasis ? '24px 52px' : '20px 40px',
          color: cue.emphasis ? COLORS.gold : COLORS.text,
          fontFamily: FONT,
          fontSize: cue.emphasis ? 54 : 40,
          fontWeight: cue.emphasis ? 800 : 500,
          lineHeight: 1.5,
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
