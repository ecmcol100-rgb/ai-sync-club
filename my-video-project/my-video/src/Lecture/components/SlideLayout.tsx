import { AbsoluteFill } from 'remotion';
import { Avatar } from './Avatar';
import { TopBar } from './TopBar';
import { COLORS } from '../constants';

interface SlideLayoutProps {
  /** public 폴더 기준 이미지명 */
  avatarImage: string;
  children: React.ReactNode;
}

/**
 * 좌측 40% 아바타 + 우측 60% 슬라이드 레이아웃
 */
export const SlideLayout: React.FC<SlideLayoutProps> = ({ avatarImage, children }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <TopBar />

    {/* 좌측: 아바타 영역 40% */}
    <div
      style={{
        position: 'absolute',
        top: 60,
        bottom: 0,
        left: 0,
        width: '40%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Avatar image={avatarImage} />
    </div>

    {/* 우측: 슬라이드 영역 60% */}
    <div
      style={{
        position: 'absolute',
        top: 60,
        bottom: 0,
        left: '40%',
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '28px 52px',
        gap: 18,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);
