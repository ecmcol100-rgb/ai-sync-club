import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { FONT, IC } from './constants';

/* ─────────────────────────────────────────
   헬퍼: easeOut 보간
───────────────────────────────────────── */
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const ease = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });

const fadeLinear = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/* ─────────────────────────────────────────
   학회 로고 그룹
   scale: 크기 배수 (기본 1)
───────────────────────────────────────── */
const LogoGroup: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 * scale }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 * scale }}>
      {/* 사단 / 법인 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRight: `2px solid ${IC.darkBrown}`,
          paddingRight: 16 * scale,
          gap: 3,
        }}
      >
        <span style={{ fontSize: 20 * scale, color: IC.darkBrown, fontFamily: FONT, fontWeight: 600, lineHeight: 1.3 }}>
          사단
        </span>
        <span style={{ fontSize: 20 * scale, color: IC.darkBrown, fontFamily: FONT, fontWeight: 600, lineHeight: 1.3 }}>
          법인
        </span>
      </div>
      {/* 메인 로고명 */}
      <span style={{ fontSize: 64 * scale, color: IC.darkBrown, fontFamily: FONT, fontWeight: 700 }}>
        8체질의학회
      </span>
    </div>
    {/* 영문 */}
    <span
      style={{
        fontSize: 17 * scale,
        color: IC.darkBrown,
        fontFamily: FONT,
        letterSpacing: '0.06em',
        opacity: 0.75,
      }}
    >
      The Society of Eight Constitutional Medicine
    </span>
  </div>
);

/* ─────────────────────────────────────────
   인트로 메인 컴포넌트 (240프레임 = 8초)

   Phase 1  (  0– 89) : 로고 등장 (연회색 배경)
   Phase 2  ( 90–119) : 딥그린 크로스페이드 전환
   Phase 3  (120–239) : 타이틀 카드 (딥그린 배경)
───────────────────────────────────────── */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── 페이즈 크로스페이드 (선형, frames 90–105) ── */
  const phase1Opacity = fadeLinear(frame, 90, 105, 1, 0);
  const phase3Opacity = fadeLinear(frame, 90, 105, 0, 1);

  /* ── Phase 1 애니메이션 ── */
  const logoOp     = ease(frame, 10, 30);
  const logoY      = ease(frame, 10, 30, 24, 0);
  const bottomTxtOp = ease(frame, 25, 45);

  /* ── Phase 3 애니메이션 (0.3초 = 9프레임 간격) ── */
  const qaOp     = ease(frame, 125, 140);
  const qaY      = ease(frame, 125, 140, 16, 0);
  const titleOp  = ease(frame, 134, 149);
  const titleY   = ease(frame, 134, 149, 16, 0);
  const subOp    = ease(frame, 143, 158);
  const subY     = ease(frame, 143, 158, 16, 0);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT,
      }}
    >
      {/* ════════════════════════════════
          PHASE 1 — 로고 (연회색 배경)
         ════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase1Opacity,
          backgroundColor: IC.bgLight,
        }}
      >
        {/* 라벤더 장식 원 1 */}
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'rgba(200, 185, 230, 0.20)',
            top: 170,
            left: 580,
          }}
        />
        {/* 라벤더 장식 원 2 */}
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'rgba(180, 170, 220, 0.14)',
            top: 270,
            left: 1060,
          }}
        />

        {/* 상단 네이비 바 */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 6,
            backgroundColor: IC.navy,
          }}
        />
        {/* 하단 네이비 바 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 6,
            backgroundColor: IC.navy,
          }}
        />

        {/* 로고 그룹 — 화면 중앙 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: logoOp,
            transform: `translateY(${logoY}px)`,
          }}
        >
          <LogoGroup scale={1.5} />
        </div>

        {/* 하단 자간 넓은 텍스트 */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: bottomTxtOp,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: '#8A9AB5',
              letterSpacing: '0.45em',
              fontWeight: 300,
            }}
          >
            8  C O N S T I T U T I O N &nbsp;&nbsp; M E D I C I N E
          </span>
        </div>
      </div>

      {/* ════════════════════════════════
          PHASE 3 — 타이틀 카드 (딥그린)
         ════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3Opacity,
          background: `linear-gradient(135deg, ${IC.deepGreen1} 0%, ${IC.deepGreen2} 100%)`,
        }}
      >
        {/* 중앙 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          {/* Q & A + 골드 언더라인 */}
          <div
            style={{
              opacity: qaOp,
              transform: `translateY(${qaY}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 48,
                color: IC.gold,
                fontWeight: 700,
                letterSpacing: '0.35em',
              }}
            >
              Q &amp; A
            </span>
            <div
              style={{
                width: 88,
                height: 3,
                backgroundColor: IC.gold,
                borderRadius: 2,
              }}
            />
          </div>

          {/* 메인 제목 */}
          <div
            style={{
              opacity: titleOp,
              transform: `translateY(${titleY}px)`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 48,
                color: IC.white,
                fontWeight: 700,
                lineHeight: 1.65,
                margin: 0,
                padding: '0 160px',
              }}
            >
              수체질에게 좋다는 인삼·홍삼,
              <br />
              매일 먹어도 괜찮을까?
            </p>
          </div>

          {/* 부제목 */}
          <div
            style={{
              opacity: subOp,
              transform: `translateY(${subY}px)`,
            }}
          >
            <p
              style={{
                fontSize: 28,
                color: IC.mint,
                fontWeight: 400,
                textAlign: 'center',
                margin: 0,
              }}
            >
              8체질의학으로 본 음식과 약물의 차이
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
