import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { Greeting } from "./Greeting";
import { Lecture8Constitution } from "./Lecture";
import { TOTAL_FRAMES } from "./Lecture/constants";
import { IntroOutro, Intro, Outro, INTRO_FRAMES, OUTRO_FRAMES, TOTAL_FRAMES as IO_TOTAL } from "./IntroOutro";
import { EcmOverview } from "./EcmOverview";
import { TOTAL_FRAMES as ECM_TOTAL } from "./EcmOverview/constants";
import { SongLyrics, calculateSongLyricsMetadata } from "./SongLyrics";
import { OrganArrayPreview, organArrayFrames, MOK_ARRAY } from "./EcmOverview/components/OrganArrayTransition";
import { SafetyCaptionPreview, SAFETY_PREVIEW_FRAMES } from "./EcmOverview/components/SafetyCaption";
import { PersonTypoCardPreview, personTypoCardFrames, MOK_YANG_CARD } from "./EcmOverview/components/PersonTypoCard";
import { ComparisonTablePreview, COMPARISON_PREVIEW_FRAMES } from "./EcmOverview/components/ComparisonTable";
import { ItemLabelPreview, ITEM_LABEL_PREVIEW_FRAMES } from "./EcmOverview/components/ItemLabel";
import { Section2bPreview, SECTION2B_PREVIEW_FRAMES } from "./EcmOverview/components/Section2bDiagram";
import { Section2cPreview, SECTION2C_PREVIEW_FRAMES } from "./EcmOverview/components/Section2cGraphic";
import { Section1HookPreview, SECTION1_HOOK_PREVIEW_FRAMES } from "./EcmOverview/components/Section1Hook";
import { ItemPanelPreview, ITEM_PANEL_PREVIEW_FRAMES } from "./EcmOverview/components/ItemPanel";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ===== 8체질의학의 노래 (가사 자막 영상) ===== */}
      <Composition
        id="SongLyrics"
        component={SongLyrics}
        calculateMetadata={calculateSongLyricsMetadata}
        durationInFrames={30 * 100}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 8체질의학회 인트로 + 아웃트로 ===== */}
      <Composition
        id="IntroOutro"
        component={IntroOutro}
        durationInFrames={IO_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntroOnly"
        component={Intro}
        durationInFrames={INTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="OutroOnly"
        component={Outro}
        durationInFrames={OUTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 8체질의학회 강의영상 ===== */}
      <Composition
        id="Lecture8Constitution"
        component={Lecture8Constitution}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 8체질의학 개괄영상 (5분 허브 영상) ===== */}
      <Composition
        id="EcmOverview"
        component={EcmOverview}
        durationInFrames={ECM_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 장기 강약 배열 전환 (섹션 2-a) — 단독 검수용 ===== */}
      <Composition
        id="OrganArrayTransition"
        component={OrganArrayPreview}
        durationInFrames={organArrayFrames(MOK_ARRAY, 30)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 항목 패널 템플릿 (3-c/4-c 대칭 검수) ===== */}
      <Composition
        id="ItemPanel"
        component={ItemPanelPreview}
        durationInFrames={ITEM_PANEL_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 섹션1 후킹 (채식의 역설 + 항목 예고) — 단독 검수용 ===== */}
      <Composition
        id="Section1Hook"
        component={Section1HookPreview}
        durationInFrames={SECTION1_HOOK_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 항목 라벨 + 섹션2 도식 2종 — 단독 검수용 ===== */}
      <Composition
        id="ItemLabel"
        component={ItemLabelPreview}
        durationInFrames={ITEM_LABEL_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Section2bDiagram"
        component={Section2bPreview}
        durationInFrames={SECTION2B_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Section2cGraphic"
        component={Section2cPreview}
        durationInFrames={SECTION2C_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 9항목 대조표 (섹션 4-h) — 단독 검수용 ===== */}
      <Composition
        id="ComparisonTable"
        component={ComparisonTablePreview}
        durationInFrames={COMPARISON_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 인물 타이포 카드 (섹션 3-g/4-g) — 단독 검수용 ===== */}
      <Composition
        id="PersonTypoCard"
        component={PersonTypoCardPreview}
        durationInFrames={personTypoCardFrames(MOK_YANG_CARD, 30)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== 안전·고지 자막 4종 — 단독 검수용 ===== */}
      <Composition
        id="SafetyCaption"
        component={SafetyCaptionPreview}
        durationInFrames={SAFETY_PREVIEW_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
      <Composition
        id="Greeting"
        component={Greeting}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
