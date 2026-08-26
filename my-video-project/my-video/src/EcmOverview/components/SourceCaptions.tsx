import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT, FPS } from '../constants';

export interface SourceCue {
  /** 노출 시작 시각(초, 해당 Sequence 내부 기준) */
  fromSec: number;
  /** 노출 종료 시각(초). 생략 시 구간 끝까지 유지 */
  toSec?: number;
  /** 예: '사진 출처: ecmed.org' / '자막 출처: 권도원, ...' / '출처: ...' */
  text: string;
}

/** 출처 블록을 상향할 구간 (초, 해당 Sequence 내부 기준) */
export interface RaisedRange {
  fromSec: number;
  /** 생략 시 구간 끝까지 유지 */
  toSec?: number;
}

interface SourceCaptionsProps {
  cues: SourceCue[];
  /**
   * medical 안전 자막이 떠 있는 구간 목록 — medical의 Sequence 구간을
   * 그대로 넘긴다. 기본 위치(bottom 235)는 medical 띠(y 762~842)와 같은
   * 높이라서, 이 구간 동안만 출처 블록을 띠 위(bottom 330)로 올린다.
   * 이동은 medical의 페이드(8프레임)와 같은 길이로 부드럽게 처리.
   */
  raisedRanges?: RaisedRange[];
}

/** 상향 시 bottom 값 — medical 띠 상단(y 762) 위 12px */
const RAISED_BOTTOM = 330;
const DEFAULT_BOTTOM = 235;
const RAISE_FRAMES = 8;

/**
 * 화면 우하단 출처 자막.
 *
 * v4 자막 스타일 규칙에 따라 두 종류를 구분 표시한다.
 * - "사진 출처: …"  → 사진 크레딧: 24px, 흰색 65% 투명도(기존 유지)
 * - "출처: …"       → 화면 출처: 약 130% 상향(31px) + 밝게(92%), 가독성 우선
 * 동시에 여러 출처가 활성화되면 아래에서 위로 쌓여 서로 겹치지 않는다.
 * 사진·컷이 바뀔 때(각 cue fromSec) 짧은 페이드로 함께 전환된다.
 *
 * ★v5 자막 안전 영역: 화면 하단 160px은 내레이션 자막 전용이므로
 * 출처 자막 블록은 그 위(bottom: 170)에 배치한다.
 */
export const SourceCaptions: React.FC<SourceCaptionsProps> = ({ cues, raisedRanges }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;

  const active = cues
    .map((c, i) => ({ ...c, key: i }))
    .filter((c) => sec >= c.fromSec && (c.toSec === undefined || sec < c.toSec));

  // medical 구간 상향 정도(0~1) — 구간 진입·이탈 시 8프레임에 걸쳐 이동
  let raise = 0;
  for (const r of raisedRanges ?? []) {
    const start = r.fromSec * FPS;
    const up = interpolate(frame, [start, start + RAISE_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const down =
      r.toSec === undefined
        ? 1
        : interpolate(frame, [r.toSec * FPS - RAISE_FRAMES, r.toSec * FPS], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
    raise = Math.max(raise, Math.min(up, down));
  }

  if (active.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: 28,
        // ★v5 자막 안전 영역(하단 160px) 위. 2줄 내레이션 자막 박스가
        // 160px 선보다 높이 올라오므로(상단 ~864px) 그보다 위에 배치.
        // medical 안전 자막 구간(raisedRanges)에는 띠 위로 상향.
        bottom: DEFAULT_BOTTOM + raise * (RAISED_BOTTOM - DEFAULT_BOTTOM),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: 1300,
        zIndex: 60,
      }}
    >
      {active.map((c) => {
        const startFrame = c.fromSec * FPS;
        const fade = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const isPhotoCredit = c.text.startsWith('사진 출처');
        return (
          <div
            key={c.key}
            style={{
              opacity: (isPhotoCredit ? 0.65 : 0.92) * fade,
              color: COLORS.white,
              fontFamily: FONT,
              fontSize: isPhotoCredit ? 24 : 31,
              fontWeight: isPhotoCredit ? 500 : 600,
              textAlign: 'right',
              textShadow: '0 1px 5px rgba(0,0,0,0.8)',
            }}
          >
            {c.text}
          </div>
        );
      })}
    </div>
  );
};
