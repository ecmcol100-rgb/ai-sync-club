import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import data from '../data/song-lyrics.json';
import { FONT } from '../IntroOutro/constants';

const AUDIO_FILE = 'ECM_song_mr.mp3';

/* ── 색상 ── */
const BG = '#FDFCF8'; // 미색 배경
const NAVY = '#123159'; // 남색 (제목·진행바)
const GRAY = '#8A8A86'; // 크레딧 회색
const LINE = '#D8D5CC'; // 구분선·플레이스홀더 테두리

const XFADE = 0.5; // 구간 크로스페이드 시간 (초)
const SPLIT_TOP = 430; // split 레이아웃 상단 이미지 영역 높이 (px)

type ScoreSegment = { score: string; image: string; start: number; end: number };
type SongData = {
  layout: 'center' | 'split';
  intro: { logo: string; title: string; credit: string; duration: number };
  scores: ScoreSegment[];
  outro: { image: string; start: number; end: number };
};

const { layout, intro, scores, outro } = data as SongData;

/** 오디오 길이(초)를 읽어 전체 프레임 수를 결정한다 */
export const calculateSongLyricsMetadata: CalculateMetadataFunction<
  Record<string, unknown>
> = async () => {
  const durationInSeconds = await getAudioDurationInSeconds(
    staticFile(AUDIO_FILE),
  );
  return {
    durationInFrames: Math.max(1, Math.ceil(durationInSeconds * 30)),
  };
};

/** 경계 시각(start·end)을 중심으로 XFADE 동안 겹치는 크로스페이드 opacity */
const segOpacity = (t: number, start: number, end: number): number => {
  const h = XFADE / 2;
  return interpolate(t, [start - h, start + h, end - h, end + h], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/** s초부터 1초 동안 페이드 인하는 opacity */
const fadeIn = (t: number, s: number): number =>
  interpolate(t, [s, s + 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 악보 한 구간 — center: 정중앙 / split: 상단 이미지 + 하단 악보 */
const ScoreSlide: React.FC<{ seg: ScoreSegment }> = ({ seg }) => {
  if (layout === 'split') {
    return (
      <>
        {/* 상단 이미지 영역 (비어 있으면 미색 그대로) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: SPLIT_TOP,
            overflow: 'hidden',
          }}
        >
          {seg.image !== '' && (
            <Img
              src={staticFile(seg.image)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        {/* 하단 악보 영역 */}
        <div
          style={{
            position: 'absolute',
            top: SPLIT_TOP,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Img
            src={staticFile(seg.score)}
            style={{ width: '88%', height: '90%', objectFit: 'contain' }}
          />
        </div>
      </>
    );
  }
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Img
        src={staticFile(seg.score)}
        style={{ width: '88%', height: '90%', objectFit: 'contain' }}
      />
    </AbsoluteFill>
  );
};

/**
 * 8체질의학의 노래 — 악보 영상
 * 인트로(로고·제목·크레딧) → 악보 8장 크로스페이드 → 아웃트로(사진 자리)
 */
export const SongLyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const scoreStart = scores[0].start;
  const scoreEnd = scores[scores.length - 1].end;

  /* ── 섹션 opacity ── */
  const introOpacity = interpolate(
    t,
    [intro.duration - XFADE / 2, intro.duration + XFADE / 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const outroOpacity = interpolate(
    t,
    [outro.start - XFADE / 2, outro.start + XFADE / 2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  /* 우하단 로고·진행바는 악보 구간에만 표시 */
  const overlayOpacity = segOpacity(t, scoreStart, scoreEnd);

  /* ── 악보 구간 진행바 (10초=0% → 95초=100%) ── */
  const progress = interpolate(t, [scoreStart, scoreEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: BG }}>
      <Audio src={staticFile(AUDIO_FILE)} />

      {/* ════════════ 인트로 (0~10초) ════════════ */}
      {introOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: introOpacity,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 36,
            }}
          >
            {/* 학회 로고 — 0.5초 페이드 인, 지름 260px */}
            <Img
              src={staticFile(intro.logo)}
              style={{
                width: 260,
                height: 260,
                borderRadius: '50%',
                objectFit: 'cover',
                opacity: fadeIn(t, 0.5),
              }}
            />
            {/* 제목 — 1.5초 페이드 인 */}
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: NAVY,
                letterSpacing: '0.04em',
                opacity: fadeIn(t, 1.5),
              }}
            >
              {intro.title}
            </span>
            {/* 구분선 */}
            <div
              style={{
                width: 140,
                height: 2,
                backgroundColor: LINE,
                opacity: fadeIn(t, 2.2),
              }}
            />
            {/* 크레딧 — 3초 페이드 인 */}
            <span
              style={{
                fontSize: 30,
                fontWeight: 400,
                color: GRAY,
                letterSpacing: '0.08em',
                opacity: fadeIn(t, 3),
              }}
            >
              {intro.credit}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* ════════════ 악보 구간 (10~95초) ════════════ */}
      {scores.map((seg, i) => {
        const opacity = segOpacity(t, seg.start, seg.end);
        if (opacity <= 0) return null;
        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <ScoreSlide seg={seg} />
          </AbsoluteFill>
        );
      })}

      {/* 우하단 로고 (높이 60px, 투명도 0.5) */}
      {overlayOpacity > 0 && (
        <Img
          src={staticFile(intro.logo)}
          style={{
            position: 'absolute',
            right: 32,
            bottom: 24,
            height: 60,
            opacity: 0.5 * overlayOpacity,
          }}
        />
      )}

      {/* 최하단 진행바 (남색, 4px) */}
      {overlayOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 4,
            width: `${progress * 100}%`,
            backgroundColor: NAVY,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* ════════════ 아웃트로 (95초~) ════════════ */}
      {outroOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: outroOpacity,
            backgroundColor: BG,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {outro.image !== '' ? (
            <Img
              src={staticFile(outro.image)}
              style={{ maxWidth: '70%', maxHeight: '80%', objectFit: 'contain' }}
            />
          ) : (
            /* 사진 자리 플레이스홀더 */
            <div
              style={{
                width: 420,
                height: 560,
                border: `2px dashed ${LINE}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 26, color: LINE }}>사진 자리</span>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
