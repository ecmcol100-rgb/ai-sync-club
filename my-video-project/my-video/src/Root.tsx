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
