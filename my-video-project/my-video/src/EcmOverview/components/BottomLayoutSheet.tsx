import { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../constants';
import {
  CONTENT_MAX_Y,
  DISCLAIMER_BOTTOM,
  DISCLAIMER_TOP,
  FRAME_H,
  ITEM_ROW_BOTTOM,
  MEDICAL_BOTTOM,
  MEDICAL_CONTENT_MAX_Y,
  MEDICAL_TOP,
  NARRATION_TOP,
  SERIES_LAYOUT,
  narrationBoxHeight,
} from '../bottomLayout';
import { BloodPressurePanel, BP_NARRATION_PROBE, MOK_BLOOD_PRESSURE } from './BloodPressurePanel';
import { ItemLabel } from './ItemLabel';
import { SafetyCaption } from './SafetyCaption';
import { Subtitles } from './Subtitles';

export const BOTTOM_LAYOUT_SHEET_FRAMES = 90;

/** 눈금선 정의 — bottomLayout.ts 파생값 그대로 */
const GUIDES: { y: number; label: string; color: string }[] = [
  { y: MEDICAL_CONTENT_MAX_Y, label: `MEDICAL_CONTENT_MAX_Y ${MEDICAL_CONTENT_MAX_Y}`, color: COLORS.warning },
  { y: MEDICAL_TOP, label: `medical ${MEDICAL_TOP}`, color: COLORS.warning },
  { y: MEDICAL_BOTTOM, label: `${MEDICAL_BOTTOM}`, color: COLORS.warning },
  { y: CONTENT_MAX_Y, label: `CONTENT_MAX_Y ${CONTENT_MAX_Y} = item row`, color: COLORS.gold },
  { y: ITEM_ROW_BOTTOM, label: `${ITEM_ROW_BOTTOM}`, color: COLORS.gold },
  { y: DISCLAIMER_TOP, label: `disclaimer ${DISCLAIMER_TOP}`, color: COLORS.greenBright },
  { y: DISCLAIMER_BOTTOM, label: `${DISCLAIMER_BOTTOM}`, color: COLORS.greenBright },
  { y: NARRATION_TOP, label: `NARRATION_TOP ${NARRATION_TOP}`, color: COLORS.blue },
];

interface Probe {
  name: string;
  top: number;
  bottom: number;
}

/** 실측 상자가 넘지 말아야 할 선 — 상수와 대조해 OK/NG 판정 */
const LIMITS: Record<string, { top?: number; bottom?: number }> = {
  'card-left': { bottom: MEDICAL_CONTENT_MAX_Y },
  'card-right': { bottom: MEDICAL_CONTENT_MAX_Y },
  medical: { top: MEDICAL_TOP, bottom: MEDICAL_BOTTOM },
  career: { top: CONTENT_MAX_Y, bottom: ITEM_ROW_BOTTOM },
  source: { top: CONTENT_MAX_Y, bottom: ITEM_ROW_BOTTOM },
  disclaimer: { top: DISCLAIMER_TOP, bottom: DISCLAIMER_BOTTOM },
  narration: { top: NARRATION_TOP, bottom: FRAME_H },
};

const verdict = (p: Probe): string => {
  const lim = LIMITS[p.name];
  if (!lim) return '';
  const ok = (lim.top === undefined || p.top >= lim.top) && (lim.bottom === undefined || p.bottom <= lim.bottom);
  return ok ? 'OK' : 'NG';
};

/**
 * 하단 레이아웃 검수 시트.
 *
 * 혈압 화면(하단 스택이 전부 서는 유일한 구간)을 그대로 깔고, bottomLayout.ts의
 * 파생 y에 눈금선을 긋는다. 여기에 실제 DOM 상자(내레이션·medical·disclaimer·
 * 항목 행·출처·본문 카드)의 실측 top/bottom을 우상단에 찍는다 — 상수와 실측이
 * 어긋나면 이 시트에서 바로 드러난다.
 *
 * 실측은 getBoundingClientRect를 컴포지션 루트 기준으로 환산한 값(스튜디오
 * 축소 배율 무관). 첫 마운트는 숨김 상태(폭 0)일 수 있어 프레임마다 다시 잰다.
 */
export const BottomLayoutSheet: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [probes, setProbes] = useState<Probe[]>([]);
  const frame = useCurrentFrame();

  useEffect(() => {
    // 렌더러는 마운트 직후 루트 폭이 0일 수 있다 — 레이아웃이 잡힐 때까지
    // 짧게 재시도하고, 그동안 delayRender로 스크린샷을 잡아 둔다
    const handle = delayRender('measure bottom layout');
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const root = rootRef.current;
      const rootRect = root?.getBoundingClientRect();
      if (root && rootRect && rootRect.width > 0) {
        const scale = rootRect.width / 1920;
        const els = Array.from(root.querySelectorAll<HTMLElement>('[data-probe]'));
        setProbes(
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return {
              name: el.dataset.probe ?? '?',
              top: Math.round((r.top - rootRect.top) / scale),
              bottom: Math.round((r.bottom - rootRect.top) / scale),
            };
          }),
        );
        continueRender(handle);
        return;
      }
      if (++tries > 40) {
        continueRender(handle);
        return;
      }
      timer = setTimeout(tick, 50);
    };
    tick();
    return () => {
      if (timer) clearTimeout(timer);
      continueRender(handle);
    };
  }, [frame]);

  const n = SERIES_LAYOUT.narration;

  return (
    <AbsoluteFill ref={rootRef} style={{ backgroundColor: COLORS.bg }}>
      <ItemLabel label="질병·건강법" accentColor={CONSTITUTION_ACCENTS.목양} />
      <BloodPressurePanel {...MOK_BLOOD_PRESSURE} stageStartsSec={[0, 0, 0]} />
      <Sequence>
        <SafetyCaption
          kind="medical"
          text="복용 중인 혈압약을 임의로 중단하지 마시고 반드시 담당 의사와 상의하십시오."
        />
      </Sequence>
      <SafetyCaption
        kind="disclaimer"
        text="일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다."
      />
      {/* 혈압 구간에는 실제로 뜨지 않지만 항목 행 예약 검증을 위해 함께 올린다 */}
      <SafetyCaption kind="career" text="직업 적성은 경향이며, 진로 판단의 근거가 아닙니다." />
      <Subtitles cues={BP_NARRATION_PROBE} />

      {/* 눈금선 */}
      {GUIDES.map((g) => (
        <div key={g.label} style={{ position: 'absolute', left: 0, right: 0, top: g.y, zIndex: 2000 }}>
          <div style={{ height: 1, backgroundColor: g.color, opacity: 0.8 }} />
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: -18,
              color: g.color,
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              textShadow: '0 0 4px #000',
            }}
          >
            {g.label}
          </div>
        </div>
      ))}

      {/* 실측 표 */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: 20,
          zIndex: 2001,
          backgroundColor: 'rgba(0,0,0,0.75)',
          border: `1px solid ${COLORS.textDim}`,
          borderRadius: 8,
          padding: '10px 14px',
          color: COLORS.text,
          fontFamily: FONT,
          fontSize: 16,
          lineHeight: 1.5,
          whiteSpace: 'pre',
        }}
      >
        {`상수  narration ${n.fontSize}px × ${n.lineHeight} + pad ${n.padY} → 2줄 상자 ${narrationBoxHeight(n)}px, bottom ${n.bottom}
      필요 하단 영역 = ${FRAME_H - NARRATION_TOP}px (y ${NARRATION_TOP}~${FRAME_H})
실측\n` +
          probes
            .map(
              (p) =>
                `  ${p.name.padEnd(12)} top ${String(p.top).padStart(4)}  bottom ${String(p.bottom).padStart(4)}  h ${String(p.bottom - p.top).padStart(3)}  ${verdict(p)}`,
            )
            .join(String.fromCharCode(10))}
      </div>
    </AbsoluteFill>
  );
};
