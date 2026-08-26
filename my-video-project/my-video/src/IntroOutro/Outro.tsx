import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { FONT, IC } from './constants';

/* ─────────────────────────────────────────
   헬퍼
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
   학회 로고 그룹 (엔딩 카드용)
───────────────────────────────────────── */
const LogoGroup: React.FC<{ scale?: number; color?: string }> = ({
  scale = 1,
  color = IC.darkBrown,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 * scale }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 * scale }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRight: `2px solid ${color}`,
          paddingRight: 16 * scale,
          gap: 3,
        }}
      >
        <span style={{ fontSize: 20 * scale, color, fontFamily: FONT, fontWeight: 600, lineHeight: 1.3 }}>
          사단
        </span>
        <span style={{ fontSize: 20 * scale, color, fontFamily: FONT, fontWeight: 600, lineHeight: 1.3 }}>
          법인
        </span>
      </div>
      <span style={{ fontSize: 64 * scale, color, fontFamily: FONT, fontWeight: 700 }}>
        8체질의학회
      </span>
    </div>
    <span
      style={{
        fontSize: 17 * scale,
        color,
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
   아웃트로 메인 컴포넌트 (360프레임 = 12초)

   Phase 1  (  0–209) : 마무리 카드 (딥그린 배경)
   Phase 2  (210–359) : 엔딩 카드 (흰색 배경)
   전환      (207–222) : 크로스페이드
───────────────────────────────────────── */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── 페이즈 크로스페이드 (선형, frames 207–222) ── */
  const phase1Opacity = fadeLinear(frame, 207, 222, 1, 0);
  const phase2Opacity = fadeLinear(frame, 207, 222, 0, 1);

  /* ── Phase 1: 마무리 카드 애니메이션 ── */
  const tagOp  = ease(frame, 20, 35);
  const tagY   = ease(frame, 20, 35, 16, 0);
  const msg1Op = ease(frame, 35, 50);
  const msg1Y  = ease(frame, 35, 50, 16, 0);
  const msg2Op = ease(frame, 50, 65);
  const msg2Y  = ease(frame, 50, 65, 16, 0);

  /* ── Phase 2: 엔딩 카드 애니메이션 (0.4초 = 12프레임 간격) ── */
  const logoOp   = ease(frame, 222, 237);
  const logoY    = ease(frame, 222, 237, 20, 0);
  const nextOp   = ease(frame, 234, 249);
  const nextY    = ease(frame, 234, 249, 16, 0);
  const subsOp   = ease(frame, 246, 261);
  const subsY    = ease(frame, 246, 261, 16, 0);
  const divOp    = ease(frame, 258, 273);
  const copy1Op  = ease(frame, 270, 285);
  const copy2Op  = ease(frame, 282, 297);

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
          PHASE 1 — 마무리 카드 (딥그린)
         ════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase1Opacity,
          background: `linear-gradient(135deg, ${IC.deepGreen1} 0%, ${IC.deepGreen2} 100%)`,
        }}
      >
        {/* 하단 골드 바 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 8,
            backgroundColor: IC.gold,
          }}
        />

        {/* 우측 하단 소형 로고 */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 48,
            color: 'rgba(255,255,255,0.60)',
            fontSize: 22,
            fontFamily: FONT,
          }}
        >
          8체질의학회
        </div>

        {/* 중앙 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {/* Q&A 민트 라운드 태그 */}
          <div
            style={{
              opacity: tagOp,
              transform: `translateY(${tagY}px)`,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: IC.mint,
                color: IC.white,
                fontSize: 26,
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: 9999,
                letterSpacing: '0.1em',
              }}
            >
              Q&amp;A
            </span>
          </div>

          {/* 댓글 유도 메시지 */}
          <div
            style={{
              opacity: msg1Op,
              transform: `translateY(${msg1Y}px)`,
            }}
          >
            <p
              style={{
                fontSize: 52,
                color: IC.white,
                fontWeight: 700,
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              궁금한 점은 댓글로 남겨주세요
            </p>
          </div>

          {/* 서브 메시지 */}
          <div
            style={{
              opacity: msg2Op,
              transform: `translateY(${msg2Y}px)`,
            }}
          >
            <p
              style={{
                fontSize: 32,
                color: IC.white,
                fontWeight: 400,
                textAlign: 'center',
                margin: 0,
              }}
            >
              다음 시간에 만나요!
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          PHASE 2 — 엔딩 카드 (흰색)
         ════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2Opacity,
          backgroundColor: IC.white,
        }}
      >
        {/* 좌측 40% — 장식 영역 */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(160deg, rgba(10,61,43,0.06) 0%, rgba(26,107,74,0.11) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 장식용 대형 "8" */}
          <span
            style={{
              fontSize: 340,
              color: 'rgba(10,61,43,0.07)',
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: FONT,
              userSelect: 'none',
            }}
          >
            8
          </span>
        </div>

        {/* 하단 골드 바 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 8,
            backgroundColor: IC.gold,
          }}
        />

        {/* 우측 60% — 콘텐츠 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '40%',
            width: '60%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            paddingBottom: 8,
          }}
        >
          {/* 로고 그룹 */}
          <div
            style={{
              opacity: logoOp,
              transform: `translateY(${logoY}px)`,
            }}
          >
            <LogoGroup scale={0.85} />
          </div>

          {/* 다음 영상도 */}
          <div
            style={{
              opacity: nextOp,
              transform: `translateY(${nextY}px)`,
              marginTop: 8,
            }}
          >
            <p
              style={{
                fontSize: 28,
                color: IC.darkText,
                textAlign: 'center',
                margin: 0,
                fontWeight: 400,
              }}
            >
              다음 영상도 함께해주세요 :)
            </p>
          </div>

          {/* 구독·좋아요·알림 */}
          <div
            style={{
              opacity: subsOp,
              transform: `translateY(${subsY}px)`,
            }}
          >
            <p
              style={{
                fontSize: 32,
                color: IC.gold,
                fontWeight: 700,
                textAlign: 'center',
                margin: 0,
              }}
            >
              구독 · 좋아요 · 알림설정 ♥
            </p>
          </div>

          {/* 골드 구분선 */}
          <div
            style={{
              opacity: divOp,
              width: 260,
              height: 2,
              backgroundColor: IC.gold,
              borderRadius: 1,
            }}
          />

          {/* © 법인명 */}
          <div style={{ opacity: copy1Op }}>
            <p
              style={{
                fontSize: 18,
                color: IC.gray,
                textAlign: 'center',
                margin: 0,
              }}
            >
              © 사단법인 8체질의학회
            </p>
          </div>

          {/* 영문 */}
          <div style={{ opacity: copy2Op }}>
            <p
              style={{
                fontSize: 16,
                color: IC.gray,
                textAlign: 'center',
                margin: 0,
              }}
            >
              The Society of Eight Constitutional Medicine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
