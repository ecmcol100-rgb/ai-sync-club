import { AbsoluteFill } from 'remotion';
import { COLORS, CONSTITUTION_TITLE_COLORS, FONT, type ConstitutionKey } from '../constants';

export interface ConstitutionNameProps {
  /** '목양체질' 등 — 앞 두 글자로 확정 색을 찾는다 */
  name: string;
  fontSize: number;
  style?: React.CSSProperties;
}

/**
 * ConstitutionName — 체질명 제목 표기 칩 (시리즈 공통)
 *
 * CONSTITUTION_TITLE_COLORS(원장님 확정 색)를 배경 칩 + 글자색으로 그린다.
 * 여덟 체질 공통 형식 — 목양(하양)·토양(검정)이 글자색으로 성립하지 않아
 * 칩이 필수이고, 형식 통일을 위해 나머지도 같은 칩으로 맞춘다.
 * 미등록 이름은 기본 텍스트색으로 안전하게 표시.
 *
 * 크기는 fontSize 하나로 제어 — 패딩·모서리가 글자 크기에 비례한다.
 */
export const ConstitutionName: React.FC<ConstitutionNameProps> = ({ name, fontSize, style }) => {
  const c = CONSTITUTION_TITLE_COLORS[name.slice(0, 2) as ConstitutionKey];

  if (!c) {
    return (
      <span style={{ color: COLORS.text, fontFamily: FONT, fontSize, fontWeight: 900, ...style }}>
        {name}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: c.bg,
        color: c.fg,
        border: 'border' in c ? `${Math.max(2, fontSize * 0.02)}px solid ${c.border}` : undefined,
        borderRadius: fontSize * 0.16,
        padding: `${fontSize * 0.05}px ${fontSize * 0.22}px ${fontSize * 0.09}px`,
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.25,
        ...style,
      }}
    >
      {name}
    </span>
  );
};

const ALL: string[] = ['목양체질', '목음체질', '금양체질', '금음체질', '토양체질', '토음체질', '수양체질', '수음체질'];

/**
 * 확인용 렌더 — 8체질 확정 색을 한 화면에 나열.
 * 상단: 채택안(칩형 통일) / 하단: 비교용 글자색형 — 목양(하양)이 기본
 * 텍스트와 구분되지 않고 토양(검정)이 배경에 묻히는 것이 그대로 보인다.
 */
export const ConstitutionColorSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg, padding: '80px 120px' }}>
    <div style={{ color: COLORS.greenPale, fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: 3 }}>
      칩형 — 채택안 (여덟 체질 공통 형식)
    </div>
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
      {ALL.map((n) => (
        <div key={n} style={{ textAlign: 'center' }}>
          <ConstitutionName name={n} fontSize={54} />
        </div>
      ))}
    </div>

    <div
      style={{
        marginTop: 70,
        color: COLORS.textDim,
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 3,
      }}
    >
      글자색형 — 비교용 (목양·토양이 성립하지 않음)
    </div>
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
      {ALL.map((n) => {
        const c = CONSTITUTION_TITLE_COLORS[n.slice(0, 2) as ConstitutionKey];
        return (
          <div key={n} style={{ textAlign: 'center' }}>
            <span style={{ color: c.bg, fontFamily: FONT, fontSize: 54, fontWeight: 900 }}>{n}</span>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

export const COLOR_SHEET_FRAMES = 90;
