import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONT, FPS } from '../constants';
import { SERIES_LAYOUT, useBottomLayout, type SourceStyle } from '../bottomLayout';

export interface SourceCue {
  /** 노출 시작 시각(초, 해당 Sequence 내부 기준) */
  fromSec: number;
  /** 노출 종료 시각(초). 생략 시 구간 끝까지 유지 */
  toSec?: number;
  /** 예: '사진 출처: ecmed.org' / '출처: 빛과소금 94-8월호' */
  text: string;
}

interface SourceCaptionsProps {
  cues: SourceCue[];
  /**
   * 표준 위치(항목 행 우측) 대신 쓸 bottom(px). 4-h 대조표처럼 본문이
   * 자막 슬롯까지 확장되는 특수 화면에서만 사용 — 남용 금지
   */
  bottomOverride?: number;
}

/** 글자폭 추정 — 한글·한자·전각기호 1em, 그 외(숫자·라틴·기호) 0.55em */
const estimateWidth = (text: string, fontSize: number): number => {
  let w = 0;
  for (const ch of text) {
    w += /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF\u3000-\u303F\uFF00-\uFFEF\u00B7]/.test(ch)
      ? fontSize
      : fontSize * 0.55;
  }
  return w;
};

const isPhotoCredit = (text: string): boolean => text.startsWith('사진 출처');

/**
 * 출처 문구가 한 줄에 들어가는지 검사 — 데이터 작성 시 검증용으로도 쓸 것.
 * 출처는 어떤 경우에도 두 줄로 꺾이면 안 된다 — 렌더는 nowrap으로 강제하고,
 * 상한 초과는 이 추정 폭 검사로 잡는다 (초과 시 개발 중 콘솔 경고).
 * 표기 규칙: 간략 표기 — 저자·기고문 제목 없이 매체와 월호만.
 * 예: '출처: 빛과소금 94-5월호 · 95-5월호 / 월간조선 2011-5월호'
 */
export const sourceFitsOneLine = (text: string, style: SourceStyle = SERIES_LAYOUT.source): boolean =>
  estimateWidth(text, isPhotoCredit(text) ? style.creditFontSize : style.fontSize) <= style.maxLineW;

/** 같은 문구로 경고가 반복되지 않게 기록 */
const warnedTexts = new Set<string>();

/**
 * 화면 우하단 출처 자막.
 *
 * 두 종류를 구분 표시한다.
 * - "사진 출처: …"  → 사진 크레딧: 작은 글자, 흰색 65% 투명도
 * - "출처: …"       → 화면 출처: 조금 더 크게·밝게(92%), 가독성 우선
 * 동시에 여러 출처가 활성화되면 세로로 쌓여 서로 겹치지 않는다.
 * 사진·컷이 바뀔 때(각 cue fromSec) 짧은 페이드로 함께 전환된다.
 *
 * 위치·글자 크기는 하단 레이아웃 프로파일(bottomLayout.ts)에서 온다.
 * - series: 항목 행(y 686~734)의 오른쪽 — career/addiction 상자와 같은 행을
 *   나눠 쓰며 세로 중앙 정렬. medical 띠는 이 행 위에 서므로 어떤 구간에서도
 *   출처가 medical과 겹치지 않는다 (예전의 상향 이동이 필요 없어졌다)
 * - legacy: 개괄영상 v5 확정 렌더 값 (bottom 235, 31px)
 */
export const SourceCaptions: React.FC<SourceCaptionsProps> = ({ cues, bottomOverride }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const { source: style } = useBottomLayout();

  const active = cues
    .map((c, i) => ({ ...c, key: i }))
    .filter((c) => sec >= c.fromSec && (c.toSec === undefined || sec < c.toSec));

  if (active.length === 0) return null;

  return (
    <div
      data-probe="source"
      style={{
        position: 'absolute',
        right: style.right,
        bottom: bottomOverride ?? style.bottom,
        // 항목 행 높이에 맞춰 세로 중앙 (legacy는 rowH 0 → 내용 높이)
        height: style.rowH || undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: style.rowH ? 4 : 8,
        maxWidth: style.maxLineW,
        zIndex: 60,
      }}
    >
      {active.map((c) => {
        const startFrame = c.fromSec * FPS;
        const fade = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const credit = isPhotoCredit(c.text);
        // 두 줄 방지 검사 — 상한을 넘으면 개발 중 콘솔에 경고 (스튜디오·렌더 로그)
        if (!sourceFitsOneLine(c.text, style) && !warnedTexts.has(c.text)) {
          warnedTexts.add(c.text);
          console.warn(
            `[SourceCaptions] 출처 자막이 한 줄 폭(${style.maxLineW}px)을 넘습니다 — 간략 표기로 줄이십시오: "${c.text}"`,
          );
        }
        return (
          <div
            key={c.key}
            style={{
              opacity: (credit ? 0.65 : 0.92) * fade,
              color: COLORS.white,
              fontFamily: FONT,
              fontSize: credit ? style.creditFontSize : style.fontSize,
              fontWeight: credit ? 500 : 600,
              lineHeight: style.lineHeight,
              textAlign: 'right',
              textShadow: '0 1px 5px rgba(0,0,0,0.8)',
              // 출처는 어떤 경우에도 줄바꿈되지 않는다
              whiteSpace: 'nowrap',
            }}
          >
            {c.text}
          </div>
        );
      })}
    </div>
  );
};
