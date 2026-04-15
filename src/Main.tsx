import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHORTS_ID = "QuantumRealmShort";
export const SHORTS_FPS = 30;
export const SHORTS_WIDTH = 1080;
export const SHORTS_HEIGHT = 1920;
export const SHORTS_DURATION_IN_FRAMES = 1530;

type SceneClip = {
  durationInFrames: number;
  from: number;
  src: string;
};

type Subtitle = {
  endFrame: number;
  startFrame: number;
  text: string;
};

type NarrationClip = Subtitle & {
  src: string;
};

type SubtitleVariant = "default" | "impact" | "closing";

const SUBTITLE_FONT_PRESETS = {
  readable:
    '"Aptos Display", "Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  balanced: '"Trebuchet MS", "Verdana", "Segoe UI", Arial, sans-serif',
  condensed:
    '"Bahnschrift", "Arial Narrow", "Segoe UI", "Helvetica Neue", sans-serif',
} as const;

const FONT_FAMILY = SUBTITLE_FONT_PRESETS.readable;

const sceneClips: SceneClip[] = [
  { src: "videos/S1.mp4", from: 0, durationInFrames: 300 },
  { src: "videos/S2.mp4", from: 300, durationInFrames: 240 },
  { src: "videos/S3.mp4", from: 540, durationInFrames: 300 },
  { src: "videos/S4.mp4", from: 840, durationInFrames: 450 },
  { src: "videos/S5.mp4", from: 1290, durationInFrames: 240 },
];

const subtitles: Subtitle[] = [
  { text: "What happens when you smash", startFrame: 0, endFrame: 90 },
  { text: "invisible particles", startFrame: 90, endFrame: 150 },
  { text: "at the speed of light?", startFrame: 150, endFrame: 210 },
  { text: "Welcome to the Quantum Realm!", startFrame: 210, endFrame: 300 },

  { text: "Everything around us is made of", startFrame: 300, endFrame: 390 },
  { text: "tiny dots called 'Quantum'.", startFrame: 390, endFrame: 450 },
  { text: "But they are WAY too small", startFrame: 450, endFrame: 510 },
  { text: "for any microscope.", startFrame: 510, endFrame: 540 },

  { text: "Enter the Cyclotron!", startFrame: 540, endFrame: 630 },
  { text: "Think of it as a massive,", startFrame: 630, endFrame: 720 },
  { text: "super-fast rollercoaster", startFrame: 720, endFrame: 780 },
  { text: "for atoms.", startFrame: 780, endFrame: 840 },

  {
    text: "We spin them faster and faster...",
    startFrame: 840,
    endFrame: 1000,
  },
  { text: "and...", startFrame: 1000, endFrame: 1080 },
  { text: "BOOM! They smash!", startFrame: 1080, endFrame: 1150 },
  { text: "Spitting out brand new,", startFrame: 1150, endFrame: 1220 },
  { text: "secret particles.", startFrame: 1220, endFrame: 1290 },

  { text: "That's how we unlock", startFrame: 1290, endFrame: 1350 },
  {
    text: "the universe's tiniest secrets.",
    startFrame: 1350,
    endFrame: 1440,
  },
  { text: "Happy World Quantum Day!", startFrame: 1440, endFrame: 1530 },
];

const narrationClips: NarrationClip[] = subtitles.map((subtitle, index) => ({
  ...subtitle,
  src: `audio/quantum/line${String(index).padStart(2, "0")}.wav`,
}));

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const textShadow = [
  "0 2px 0 rgba(0, 0, 0, 0.95)",
  "0 0 10px rgba(0, 0, 0, 0.85)",
  "0 10px 26px rgba(0, 0, 0, 0.55)",
  "0 0 34px rgba(0, 0, 0, 0.32)",
].join(", ");

const getSubtitleVariant = (text: string): SubtitleVariant => {
  if (text === "BOOM! They smash!") {
    return "impact";
  }

  if (text === "Happy World Quantum Day!") {
    return "closing";
  }

  return "default";
};

const getFontSize = (text: string, variant: SubtitleVariant) => {
  if (variant === "impact") {
    return 88;
  }

  if (variant === "closing") {
    return 72;
  }

  if (text.length > 34) {
    return 58;
  }

  if (text.length > 28) {
    return 64;
  }

  return 70;
};

const BackgroundClip = ({ src }: { src: string }) => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 8], [0.9, 1], clamp);
  const scale = interpolate(frame, [0, 18], [1.035, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: reveal }}>
      <OffthreadVideo
        src={staticFile(src)}
        volume={0.45}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0.04) 34%, rgba(0, 0, 0, 0.46) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 255, 255, 0) 46%, rgba(0, 0, 0, 0.22) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const SubtitleCard = ({
  durationInFrames,
  text,
}: {
  durationInFrames: number;
  text: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const variant = getSubtitleVariant(text);

  const pop = spring({
    fps,
    frame,
    durationInFrames: 18,
    config:
      variant === "impact"
        ? { damping: 12, stiffness: 220, mass: 0.75 }
        : { damping: 14, stiffness: 180, mass: 0.85 },
  });

  const scale = interpolate(pop, [0, 1], [0.84, 1], clamp);
  const translateY = interpolate(
    pop,
    [0, 1],
    [variant === "closing" ? 34 : 48, 0],
    clamp,
  );
  const enterOpacity = interpolate(frame, [0, 6], [0, 1], clamp);
  const exitOpacity = interpolate(
    frame,
    [Math.max(durationInFrames - 8, 0), durationInFrames],
    [1, 0],
    clamp,
  );

  const containerStyle: CSSProperties = {
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "120px 60px 208px",
  };

  const transform = `translateY(${translateY}px) scale(${scale})`;

  return (
    <AbsoluteFill style={containerStyle}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          opacity: enterOpacity * exitOpacity,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 980,
            padding: "28px 40px",
            borderRadius: 32,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.74) 100%)",
            border: "2px solid rgba(255, 255, 255, 0.22)",
            boxShadow: "0 22px 64px rgba(0, 0, 0, 0.46)",
            backdropFilter: "blur(16px)",
            transform,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: getFontSize(text, variant),
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              textAlign: "center",
              color: "#fff",
              WebkitTextFillColor: "#fff",
              textTransform: variant === "impact" ? "uppercase" : undefined,
              WebkitTextStroke:
                variant === "impact"
                  ? "6px rgba(0, 0, 0, 0.95)"
                  : "4px rgba(0, 0, 0, 0.95)",
              textShadow,
              textWrap: "balance",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Main = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {sceneClips.map((clip) => (
        <Sequence
          key={clip.src}
          from={clip.from}
          durationInFrames={clip.durationInFrames}
        >
          <BackgroundClip src={clip.src} />
        </Sequence>
      ))}

      {subtitles.map((subtitle) => (
        <Sequence
          key={`${subtitle.startFrame}-${subtitle.text}`}
          from={subtitle.startFrame}
          durationInFrames={subtitle.endFrame - subtitle.startFrame}
        >
          <SubtitleCard
            text={subtitle.text}
            durationInFrames={subtitle.endFrame - subtitle.startFrame}
          />
        </Sequence>
      ))}

      {narrationClips.map((clip) => (
        <Sequence
          key={`${clip.startFrame}-${clip.src}`}
          from={clip.startFrame}
          durationInFrames={clip.endFrame - clip.startFrame}
        >
          <Audio src={staticFile(clip.src)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
