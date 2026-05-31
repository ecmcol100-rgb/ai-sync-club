import { COLORS, FONT } from '../constants';

interface TopBarProps {
  title?: string;
}

/** 상단 초록색 학회 바 */
export const TopBar: React.FC<TopBarProps> = ({ title = '8체질의학회' }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: COLORS.topBar,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 48,
      paddingRight: 48,
      zIndex: 100,
    }}
  >
    <span
      style={{
        color: COLORS.white,
        fontSize: 22,
        fontFamily: FONT,
        fontWeight: 700,
        letterSpacing: 3,
      }}
    >
      {title}
    </span>
  </div>
);
