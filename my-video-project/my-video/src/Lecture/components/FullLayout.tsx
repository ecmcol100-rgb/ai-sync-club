import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { TopBar } from './TopBar';
import { COLORS } from '../constants';

interface FullLayoutProps {
  avatarImage: string;
  children: React.ReactNode;
}

/**
 * 아바타가 화면 전체를 채우는 강조 레이아웃.
 * 하단 그라디언트 위에 텍스트를 배치한다.
 */
export const FullLayout: React.FC<FullLayoutProps> = ({ avatarImage, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 55, mass: 1 },
    from: 0.88,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* 아바타 전체 화면 — 스프링 등장 */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
        <Img
          src={staticFile(avatarImage)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
        />
      </AbsoluteFill>

      {/* 하단 그라디언트 오버레이 — 텍스트 가독성 */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(250,250,245,0.97) 30%, rgba(250,250,245,0.55) 60%, transparent)',
        }}
      />

      <TopBar />

      {/* 텍스트 콘텐츠 — 하단 배치 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 120px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
