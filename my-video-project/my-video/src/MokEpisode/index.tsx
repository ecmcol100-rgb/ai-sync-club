import { AbsoluteFill, Freeze, Sequence } from 'remotion';
import { COLORS, CONSTITUTION_ACCENTS, FONT } from '../EcmOverview/constants';
import { EpisodeTitleCard, MOK_EPISODE_TITLE } from '../EcmOverview/components/EpisodeTitleCard';
import { Section1Hook } from '../EcmOverview/components/Section1Hook';
import { ConstitutionName } from '../EcmOverview/components/ConstitutionName';
import { OrganArrayTransition, MOK_ARRAY } from '../EcmOverview/components/OrganArrayTransition';
import { Section2bDiagram } from '../EcmOverview/components/Section2bDiagram';
import { CarnivoreColonCut, FoodListPanel } from '../EcmOverview/components/Section2Cutaways';
import { Section2cGraphic } from '../EcmOverview/components/Section2cGraphic';
import {
  ConstitutionTitleCard,
  MOK_YANG_TITLE,
  MOK_EUM_TITLE,
} from '../EcmOverview/components/ConstitutionTitleCard';
import { ItemLabel } from '../EcmOverview/components/ItemLabel';
import { ItemPanel, MOK_PANELS } from '../EcmOverview/components/ItemPanel';
import { BloodPressurePanel, MOK_BLOOD_PRESSURE } from '../EcmOverview/components/BloodPressurePanel';
import { PersonTypoCard, MOK_YANG_CARD, MOK_EUM_CARD } from '../EcmOverview/components/PersonTypoCard';
import { EmphasisCaption, MOK_BODY_EXCEPTION } from '../EcmOverview/components/EmphasisCaption';
import { SafetyCaption } from '../EcmOverview/components/SafetyCaption';
import { ComparisonTable, MOK_COMPARISON } from '../EcmOverview/components/ComparisonTable';
import { SelfDiagnosisWarning, MOK_SELF_DIAGNOSIS } from '../EcmOverview/components/SelfDiagnosisWarning';
import { ClosingScene } from '../EcmOverview/components/ClosingScene';
import {
  SEC,
  SECTION_STARTS_SEC,
  SECTION_LENGTHS_SEC,
  S1_STAGES_SEC,
  S1_ITEM_INTERVAL_SEC,
  S2,
  ORGAN_FREEZE_FRAME,
  S2B_STAGES_SEC,
  CARNIVORE_STAGES_SEC,
  FOOD_STAGES_SEC,
  S2C_STAGES_SEC,
  S3,
  S3_CAPTIONS,
  S4,
  S4_D_POINTS_SEC,
  S4_CAPTIONS,
  TABLE_SKIP_FADE_FRAMES,
  S5_STAGES_SEC,
} from './timing';

export { TOTAL_FRAMES as MOK_EPISODE_FRAMES } from './timing';

const DISCLAIMER_TEXT = '일반적인 체질별 경향을 설명한 것으로, 절대적인 특성이 아닙니다.';
const CAREER_TEXT = '직업 적성은 경향이며, 진로 판단의 근거가 아닙니다.';
const ADDICTION_TEXT = '알코올 의존은 전문적인 치료가 필요한 문제입니다.';
const MEDICAL_TEXT = '복용 중인 혈압약을 임의로 중단하지 마시고 반드시 담당 의사와 상의하십시오.';

/** 구간 Sequence 단축 표기 — 시작·길이 모두 초 단위(timing.ts 값)로 받는다 */
const Span: React.FC<{ fromSec: number; lenSec: number; children: React.ReactNode }> = ({
  fromSec,
  lenSec,
  children,
}) => (
  <Sequence from={SEC(fromSec)} durationInFrames={SEC(lenSec)}>
    {children}
  </Sequence>
);

/* ── 섹션 2 도입 — ConstitutionName 2개 제시 (조립 사양서 2절 지정) ── */
const S2Intro: React.FC = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
    <div
      style={{
        position: 'absolute',
        top: 380,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
      }}
    >
      <ConstitutionName name="목양체질" fontSize={88} />
      <span style={{ color: COLORS.textDim, fontFamily: FONT, fontSize: 60, fontWeight: 700 }}>·</span>
      <ConstitutionName name="목음체질" fontSize={88} />
    </div>
  </div>
);

/* ── 4-i 정답 + 예고 — [가안] 전용 컴포넌트 미정, 강조 자막 2연으로 배선 ── */
const S4Answer: React.FC<{ lenSec: number }> = ({ lenSec }) => (
  <>
    <Span fromSec={0} lenSec={lenSec * 0.55}>
      <EmphasisCaption text={'목양체질과 가장 가까운 체질은\n수음체질입니다'} />
    </Span>
    <Span fromSec={lenSec * 0.55} lenSec={lenSec * 0.45}>
      <EmphasisCaption
        text={'그리고 목(木)과 반대에 있는 금(金) —\n다음 편에서 다룹니다'}
        accentColor={CONSTITUTION_ACCENTS.금양}
      />
    </Span>
  </>
);

/**
 * MokEpisode — 목양·목음편 본체 (docs/episode_assembly_spec.md)
 *
 * 모든 시각은 timing.ts 상수에서 온다 — 오디오 확보 후 그 파일만 교체.
 * 오디오는 아직 없으므로 무음 구간(대조표 20초 등)은 화면만 유지된다.
 *
 * 전환: 컴포넌트 자체 페이드를 그대로 쓰고 별도 크로스페이드를 얹지
 * 않는다 (사양서 4절 — 이중 전환 금지). 혈압 구간은 컴포넌트 내장
 * 0.8초 페이드가 느린 리듬을 담당하고, 대조표는 내부 페이드인을
 * 오프셋으로 건너뛰어 전환 없이 즉시 정지 화면으로 선다.
 */
export const MokEpisode: React.FC = () => {
  const s = SECTION_STARTS_SEC;
  const len = SECTION_LENGTHS_SEC;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ═══ 섹션 0 — 타이틀 ═══ */}
      <Span fromSec={s.s0} lenSec={len.s0}>
        <EpisodeTitleCard {...MOK_EPISODE_TITLE} />
      </Span>

      {/* ═══ 섹션 1 — 후킹 ═══ */}
      <Span fromSec={s.s1} lenSec={len.s1}>
        <Section1Hook stageStartsSec={S1_STAGES_SEC} itemIntervalSec={S1_ITEM_INTERVAL_SEC} />
      </Span>

      {/* ═══ 섹션 2 — 공통 원리 ═══ */}
      <Span fromSec={s.s2 + S2.intro} lenSec={S2.organPresent - S2.intro}>
        <S2Intro />
      </Span>

      {/* 2-a ① 양 끝 동일 제시 — A 배열 정지 (등장 완료 프레임에서 동결) */}
      <Span fromSec={s.s2 + S2.organPresent} lenSec={S2.organAnim - S2.organPresent}>
        <Freeze frame={ORGAN_FREEZE_FRAME}>
          <OrganArrayTransition {...MOK_ARRAY} />
        </Freeze>
      </Span>
      {/* 2-a ②③ — 동결 프레임부터 이어서 라이브 재생 (이음새 없음).
          이동 애니 5.3초가 끝나면 최종 상태가 ③ 결론 구간까지 유지된다 */}
      <Span fromSec={s.s2 + S2.organAnim} lenSec={S2.organEnd - S2.organAnim}>
        <Sequence from={-ORGAN_FREEZE_FRAME}>
          <OrganArrayTransition {...MOK_ARRAY} />
        </Sequence>
      </Span>

      <Span fromSec={s.s2 + S2.bile} lenSec={S2.bileEnd - S2.bile}>
        <Section2bDiagram stageStartsSec={S2B_STAGES_SEC} />
      </Span>
      <Span fromSec={s.s2 + S2.carnivore} lenSec={S2.food - S2.carnivore}>
        <CarnivoreColonCut stageStartsSec={CARNIVORE_STAGES_SEC} />
      </Span>
      <Span fromSec={s.s2 + S2.food} lenSec={S2.bathing - S2.food}>
        <FoodListPanel stageStartsSec={FOOD_STAGES_SEC} />
      </Span>
      <Span fromSec={s.s2 + S2.bathing} lenSec={S2.bridge - S2.bathing}>
        <Section2cGraphic stageStartsSec={S2C_STAGES_SEC} />
      </Span>
      {/* S2.bridge~end — 전환 문장 (내레이션만, 화면 공백) */}

      {/* ═══ 섹션 3 — 목양체질 ═══ */}
      <Span fromSec={s.s3 + S3.title} lenSec={S3.b - S3.title}>
        <ConstitutionTitleCard {...MOK_YANG_TITLE} />
      </Span>
      <Span fromSec={s.s3 + S3.b} lenSec={S3.c - S3.b}>
        <ItemPanel {...MOK_PANELS['3b']} />
      </Span>
      <Span fromSec={s.s3 + S3.c} lenSec={S3.d - S3.c}>
        <ItemPanel {...MOK_PANELS['3c']} />
      </Span>
      <Span fromSec={s.s3 + S3.d} lenSec={S3.e - S3.d}>
        <ItemPanel {...MOK_PANELS['3d']} />
      </Span>
      <Span fromSec={s.s3 + S3.e} lenSec={S3.f - S3.e}>
        <ItemPanel {...MOK_PANELS['3e']} />
      </Span>
      <Span fromSec={s.s3 + S3.f} lenSec={S3.bp - S3.f}>
        <ItemPanel {...MOK_PANELS['3f']} />
      </Span>
      <Span fromSec={s.s3 + S3.bp} lenSec={S3.people - S3.bp}>
        <BloodPressurePanel {...MOK_BLOOD_PRESSURE} medicalRanges={[{ fromSec: 0 }]} />
      </Span>
      <Span fromSec={s.s3 + S3.people} lenSec={S3.exception - S3.people}>
        <PersonTypoCard {...MOK_YANG_CARD} />
      </Span>
      <Span fromSec={s.s3 + S3.exception} lenSec={S3.end - S3.exception}>
        <EmphasisCaption text={MOK_BODY_EXCEPTION} />
      </Span>

      {/* 섹션 3 — 항목 라벨 */}
      <Span fromSec={s.s3 + S3.b} lenSec={S3.c - S3.b}>
        <ItemLabel label="외형" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>
      <Span fromSec={s.s3 + S3.c} lenSec={S3.d - S3.c}>
        <ItemLabel label="성격" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>
      <Span fromSec={s.s3 + S3.d} lenSec={S3.e - S3.d}>
        <ItemLabel label="직업" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>
      <Span fromSec={s.s3 + S3.e} lenSec={S3.f - S3.e}>
        <ItemLabel label="운동" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>
      <Span fromSec={s.s3 + S3.f} lenSec={S3.people - S3.f}>
        <ItemLabel label="질병·건강법" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>
      <Span fromSec={s.s3 + S3.people} lenSec={S3.exception - S3.people}>
        <ItemLabel label="유명인" accentColor={CONSTITUTION_ACCENTS.목양} />
      </Span>

      {/* 섹션 3 — 안전 자막 (disclaimer 섹션 전체 / career / medical) */}
      <Span fromSec={s.s3} lenSec={len.s3}>
        <SafetyCaption kind="disclaimer" text={DISCLAIMER_TEXT} />
      </Span>
      <Span fromSec={s.s3 + S3_CAPTIONS.career[0]} lenSec={S3_CAPTIONS.career[1] - S3_CAPTIONS.career[0]}>
        <SafetyCaption kind="career" text={CAREER_TEXT} />
      </Span>
      <Span fromSec={s.s3 + S3_CAPTIONS.medical[0]} lenSec={S3_CAPTIONS.medical[1] - S3_CAPTIONS.medical[0]}>
        <SafetyCaption kind="medical" text={MEDICAL_TEXT} />
      </Span>

      {/* ═══ 섹션 4 — 목음체질 ═══ */}
      <Span fromSec={s.s4 + S4.title} lenSec={S4.b - S4.title}>
        <ConstitutionTitleCard {...MOK_EUM_TITLE} />
      </Span>
      <Span fromSec={s.s4 + S4.b} lenSec={S4.c - S4.b}>
        <ItemPanel {...MOK_PANELS['4b']} />
      </Span>
      <Span fromSec={s.s4 + S4.c} lenSec={S4.d - S4.c}>
        <ItemPanel {...MOK_PANELS['4c']} />
      </Span>
      {/* 4-d — 패널은 세 문단(전반·알코올·후반)에 걸쳐 연속. 자막만 교체된다 */}
      <Span fromSec={s.s4 + S4.d} lenSec={S4.e - S4.d}>
        <ItemPanel {...MOK_PANELS['4d']} stageStartsSec={S4_D_POINTS_SEC} />
      </Span>
      <Span fromSec={s.s4 + S4.e} lenSec={S4.f - S4.e}>
        <ItemPanel {...MOK_PANELS['4e']} />
      </Span>
      <Span fromSec={s.s4 + S4.f} lenSec={S4.people - S4.f}>
        <ItemPanel {...MOK_PANELS['4f']} />
      </Span>
      <Span fromSec={s.s4 + S4.people} lenSec={S4.table - S4.people}>
        <PersonTypoCard {...MOK_EUM_CARD} />
      </Span>
      {/* 4-h 대조표 — 무음 20초. 내부 페이드인을 건너뛰어 즉시 정지 화면 */}
      <Span fromSec={s.s4 + S4.table} lenSec={S4.answer - S4.table}>
        <Sequence from={-TABLE_SKIP_FADE_FRAMES}>
          <ComparisonTable {...MOK_COMPARISON} />
        </Sequence>
      </Span>
      <Span fromSec={s.s4 + S4.answer} lenSec={S4.end - S4.answer}>
        <S4Answer lenSec={S4.end - S4.answer} />
      </Span>

      {/* 섹션 4 — 항목 라벨 (직업은 세 문단에 걸쳐 하나로 유지) */}
      <Span fromSec={s.s4 + S4.b} lenSec={S4.c - S4.b}>
        <ItemLabel label="외형" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>
      <Span fromSec={s.s4 + S4.c} lenSec={S4.d - S4.c}>
        <ItemLabel label="성격" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>
      <Span fromSec={s.s4 + S4.d} lenSec={S4.e - S4.d}>
        <ItemLabel label="직업" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>
      <Span fromSec={s.s4 + S4.e} lenSec={S4.f - S4.e}>
        <ItemLabel label="운동" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>
      <Span fromSec={s.s4 + S4.f} lenSec={S4.people - S4.f}>
        <ItemLabel label="질병·건강법" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>
      <Span fromSec={s.s4 + S4.people} lenSec={S4.table - S4.people}>
        <ItemLabel label="유명인" accentColor={CONSTITUTION_ACCENTS.목음} />
      </Span>

      {/* 섹션 4 — 안전 자막. career는 알코올 문단을 비켜 두 구간, 사이에 addiction */}
      <Span fromSec={s.s4} lenSec={len.s4}>
        <SafetyCaption kind="disclaimer" text={DISCLAIMER_TEXT} />
      </Span>
      <Span fromSec={s.s4 + S4_CAPTIONS.career1[0]} lenSec={S4_CAPTIONS.career1[1] - S4_CAPTIONS.career1[0]}>
        <SafetyCaption kind="career" text={CAREER_TEXT} />
      </Span>
      <Span fromSec={s.s4 + S4_CAPTIONS.addiction[0]} lenSec={S4_CAPTIONS.addiction[1] - S4_CAPTIONS.addiction[0]}>
        <SafetyCaption kind="addiction" text={ADDICTION_TEXT} />
      </Span>
      <Span fromSec={s.s4 + S4_CAPTIONS.career2[0]} lenSec={S4_CAPTIONS.career2[1] - S4_CAPTIONS.career2[0]}>
        <SafetyCaption kind="career" text={CAREER_TEXT} />
      </Span>

      {/* ═══ 섹션 5 — 자가진단 경계 (disclaimer 없음) ═══ */}
      <Span fromSec={s.s5} lenSec={len.s5}>
        <SelfDiagnosisWarning {...MOK_SELF_DIAGNOSIS} stageStartsSec={S5_STAGES_SEC} />
      </Span>

      {/* ═══ 섹션 6 — 클로징 ═══ */}
      <Span fromSec={s.s6} lenSec={len.s6}>
        <ClosingScene />
      </Span>
    </AbsoluteFill>
  );
};
