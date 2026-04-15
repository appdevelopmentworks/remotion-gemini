import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// @ts-expect-error JSON asset import is handled by the Remotion bundler.
import storyMeta from "../public/audio/story-meta.json";

export const YOUTUBE_SHORT_ID = "NASA-Orion-Parachute";
export const YOUTUBE_SHORT_FPS = 30;
export const YOUTUBE_SHORT_WIDTH = 1080;
export const YOUTUBE_SHORT_HEIGHT = 1920;
// Make it a bit longer to let the music or last line echo out. 57 seconds = 1710 frames
export const YOUTUBE_SHORT_DURATION_IN_FRAMES = 1710; 

// A Helper component to display an image with a slow zoom/pan effect (Ken Burns)
const KenBurnsImage = ({ src, delayFrames = 0 }: { src: string; delayFrames?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom for the main image
  const scale = interpolate(frame - delayFrames, [0, fps * 10], [1, 1.05], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <>
      {/* Blurred background to fill the empty space */}
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.6)",
          position: "absolute",
        }}
      />
      {/* Foreground image that fits without cropping */}
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${scale})`,
          position: "absolute",
        }}
      />
    </>
  );
};

const TitleText = ({ text, subtext = "", accent = "#FF3366" }: { text: string; subtext?: string; accent?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
  });

  const textStyle: React.CSSProperties = {
    fontFamily: '"M PLUS Rounded 1c", "Hiragino Sans", sans-serif',
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadow: "0px 8px 16px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.5)",
    transform: `scale(${entrance})`,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    background: "rgba(0,0,0,0.4)",
    padding: "40px",
    borderRadius: "20px",
    border: `4px solid ${accent}`,
  };

  return (
    <div style={textStyle}>
      <span style={{ fontSize: "80px", lineHeight: "1.2" }} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br />") }} />
      {subtext && <span style={{ fontSize: "50px", color: "#FFE200" }} dangerouslySetInnerHTML={{ __html: subtext.replace(/\n/g, "<br />") }} />}
    </div>
  );
};

export const YoutubeShortComposition = () => {
  const meta = storyMeta;

  // Timings conversion from ms to frames
  const msToFrames = (ms: number) => Math.floor((ms / 1000) * YOUTUBE_SHORT_FPS);

  const lines = meta.lines;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background Audio track (Optional, but user said "テンポが良く、ワクワクするSFチックな曲から、最後は壮大な曲へ") 
          Since we don't have bgm file, we will focus on voice. 
          If there was a bgm, we would use <Audio src={staticFile("bgm.mp3")} volume={0.2} />
       */}

      {/* Full Voice Track */}
      <Audio src={staticFile("audio/story.mp3")} />

      {/* Image and Scene generation based on the timing */}
      <AbsoluteFill>
        {/* 0. Hook: 0 - 5.0 (Line 0) */}
        <Sequence from={msToFrames(lines[0].startMs)} durationInFrames={msToFrames(lines[0].durationMs) + 10}>
          <KenBurnsImage src="images/image_splash.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="どうやって止まる？" accent="#FF4400" />
          </AbsoluteFill>
        </Sequence>

        {/* 1. Intro: 5.0 - 12.5 (Line 1) */}
        <Sequence from={msToFrames(lines[1].startMs)} durationInFrames={msToFrames(lines[1].durationMs) + 10}>
          <KenBurnsImage src="images/image_diagram.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="オリオン宇宙船" subtext="パラシュートは11個！" accent="#00BFFF" />
          </AbsoluteFill>
        </Sequence>

        {/* 2. Phase 1: 12.5 - 20.6 (Line 2) */}
        <Sequence from={msToFrames(lines[2].startMs)} durationInFrames={msToFrames(lines[2].durationMs) + 10}>
          <KenBurnsImage src="images/image_3.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="①蓋外し（3個）" accent="#FFD700" />
          </AbsoluteFill>
        </Sequence>

        {/* 3. Phase 2: 20.6 - 30.1 (Line 3) */}
        <Sequence from={msToFrames(lines[3].startMs)} durationInFrames={msToFrames(lines[3].durationMs) + 10}>
          <KenBurnsImage src="images/image_2.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="②落ち着かせる（2個）" subtext="(スピード：新幹線超え！)" accent="#FF8C00" />
          </AbsoluteFill>
        </Sequence>

        {/* 4. Phase 3: 30.1 - 36.65 (Line 4) */}
        <Sequence from={msToFrames(lines[4].startMs)} durationInFrames={msToFrames(lines[4].durationMs) + 10}>
          <KenBurnsImage src="images/image_4.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="③引っ張り役（3個）" accent="#FF1493" />
          </AbsoluteFill>
        </Sequence>

        {/* 5. Phase 4: 36.65 - 44.55 (Line 5) */}
        <Sequence from={msToFrames(lines[5].startMs)} durationInFrames={msToFrames(lines[5].durationMs) + 10}>
          <KenBurnsImage src="images/image_6.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="④超巨大傘（3個）" subtext="(サッカー場サイズ！)" accent="#FF3366" />
          </AbsoluteFill>
        </Sequence>

        {/* 5. Ending: 44.5 - 51.9 (Line 6) */}
        <Sequence from={msToFrames(lines[6].startMs)} durationInFrames={msToFrames(lines[6].durationMs) + 10}>
          <KenBurnsImage src="images/image_0.png" />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <TitleText text="安全に着水！<br />チームワークの勝利！" accent="#32CD32" />
          </AbsoluteFill>
        </Sequence>

        {/* 6. CTA: 51.9 - End (Line 7) */}
        <Sequence from={msToFrames(lines[7].startMs)} durationInFrames={YOUTUBE_SHORT_DURATION_IN_FRAMES - msToFrames(lines[7].startMs)}>
          <AbsoluteFill style={{ backgroundColor: "#111", justifyContent: "flex-end", alignItems: "center", paddingBottom: "250px" }}>
             <KenBurnsImage src="images/image_recovery.png" />
             <TitleText text="アルテミス計画" subtext="チャンネル登録してね！" accent="#ffffff" />
          </AbsoluteFill>
        </Sequence>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
