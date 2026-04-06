import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type LayoutVariant = "portrait" | "landscape";

type VideoFileName = keyof typeof VIDEO_DURATION_IN_SECONDS;

type ClipDefinition = {
  label: string;
  src: VideoFileName;
};

type SectionDefinition = {
  accent: string;
  title: string;
  clips: ClipDefinition[];
};

type LayoutPreset = {
  counterLabelFontSize: number;
  counterMinWidth: number;
  counterPadding: string;
  counterValueFontSize: number;
  eyebrowFontSize: number;
  filenameFontSize: number;
  filenamePadding: string;
  headingMaxWidth: number;
  sceneBadgeFontSize: number;
  sceneBadgePadding: string;
  scenePadding: string;
  sceneTitleFontSize: number;
  subtitleFontSize: number;
  subtitleMaxWidth: number;
  titleCardMaxWidth: number;
  titleCardPadding: string;
  videoPanelMaxWidth: number;
};

export const COMPOSITION_PORTRAIT_ID = "AIVideoCompare";
export const COMPOSITION_LANDSCAPE_ID = "AIVideoCompareLandscape";
export const COMPOSITION_FPS = 30;
export const COMPOSITION_PORTRAIT_WIDTH = 1080;
export const COMPOSITION_PORTRAIT_HEIGHT = 1920;
export const COMPOSITION_LANDSCAPE_WIDTH = 1920;
export const COMPOSITION_LANDSCAPE_HEIGHT = 1080;

const INTRO_DURATION_IN_FRAMES = 2 * COMPOSITION_FPS;
const SECTION_TITLE_DURATION_IN_FRAMES = Math.round(1.5 * COMPOSITION_FPS);
const QUESTION_DURATION_IN_FRAMES = 2 * COMPOSITION_FPS;

const MAIN_TITLE =
  "\u0041\u0049\u751f\u6210\u52d5\u753b\u4f5c\u308a\u6bd4\u3079\u3066\u307f\u305f";
const SECTION_BADGE =
  "\u0041\u0049\u751f\u6210\u52d5\u753b\u4f5c\u308a\u6bd4\u3079";
const INTRO_COPY =
  "\u4eca\u56de\u306f Seedance2.0 / Klling3.0 / Sora2 / Veo3.1 \u3092\u4f7f\u3063\u3066\u751f\u6210\u52d5\u753b\u3092\u4f5c\u308a\u6bd4\u3079\u3066\u307f\u307e\u3057\u305f\u3002";
const QUESTION_TITLE =
  "\u3055\u3066\u8cb4\u65b9\u306f\u3069\u308c\u304c\u3044\u3044\u3068\u601d\u3044\u307e\u3057\u305f\u304b\uff1f";

const VIDEO_DURATION_IN_SECONDS = {
  "seedance20-2.mp4": 15.066666,
  "Seedance2.0.mp4": 15.066666,
  "klling3-2.mp4": 15.041667,
  "Kling3.0.mp4": 15.041667,
  "sora2-2.mp4": 15,
  "sora2Free.mp4": 9.533333,
  "sora2Pro.mp4": 14.533333,
  "sora2standerd.mp4": 14.533333,
  "veo31.mp4": 8,
  "Veo3.1.mp4": 8,
  "veo31-2.mp4": 8,
  "LBCMTITLE.mp4": 3.041667,
} as const;

const modelSections: SectionDefinition[] = [
  {
    accent: "#35e0ff",
    title: "Seedance2.0",
    clips: [
      { label: "seedance20-2.mp4", src: "seedance20-2.mp4" },
      { label: "Seedance2.0.mp4", src: "Seedance2.0.mp4" },
    ],
  },
  {
    accent: "#ff8a2d",
    title: "Klling3.0",
    clips: [
      { label: "klling3-2.mp4", src: "klling3-2.mp4" },
      { label: "Kling3.0.mp4", src: "Kling3.0.mp4" },
    ],
  },
  {
    accent: "#7cff66",
    title: "Sora2",
    clips: [
      { label: "sora2-2.mp4", src: "sora2-2.mp4" },
      { label: "sora2Free.mp4", src: "sora2Free.mp4" },
      { label: "sora2Pro.mp4", src: "sora2Pro.mp4" },
      { label: "sora2standerd.mp4", src: "sora2standerd.mp4" },
    ],
  },
  {
    accent: "#ffd84e",
    title: "Veo3.1",
    clips: [
      { label: "veo31.mp4", src: "veo31.mp4" },
      { label: "Veo3.1.mp4", src: "Veo3.1.mp4" },
      { label: "veo31-2.mp4", src: "veo31-2.mp4" },
    ],
  },
];

const endingClip: ClipDefinition = {
  label: "LBCMTITLE.mp4",
  src: "LBCMTITLE.mp4",
};

const layoutPresets: Record<LayoutVariant, LayoutPreset> = {
  portrait: {
    counterLabelFontSize: 20,
    counterMinWidth: 176,
    counterPadding: "16px 20px",
    counterValueFontSize: 42,
    eyebrowFontSize: 26,
    filenameFontSize: 22,
    filenamePadding: "14px 18px",
    headingMaxWidth: 760,
    sceneBadgeFontSize: 23,
    sceneBadgePadding: "16px 20px",
    scenePadding: "84px 54px 72px",
    sceneTitleFontSize: 92,
    subtitleFontSize: 32,
    subtitleMaxWidth: 720,
    titleCardMaxWidth: 900,
    titleCardPadding: "64px 56px",
    videoPanelMaxWidth: 972,
  },
  landscape: {
    counterLabelFontSize: 16,
    counterMinWidth: 164,
    counterPadding: "14px 18px",
    counterValueFontSize: 34,
    eyebrowFontSize: 20,
    filenameFontSize: 18,
    filenamePadding: "12px 16px",
    headingMaxWidth: 1160,
    sceneBadgeFontSize: 18,
    sceneBadgePadding: "13px 18px",
    scenePadding: "44px 64px 34px",
    sceneTitleFontSize: 80,
    subtitleFontSize: 34,
    subtitleMaxWidth: 980,
    titleCardMaxWidth: 1320,
    titleCardPadding: "54px 56px",
    videoPanelMaxWidth: 1440,
  },
};

const framesFromSeconds = (seconds: number) =>
  Math.ceil(seconds * COMPOSITION_FPS);

const getClipDurationInFrames = (src: VideoFileName) =>
  framesFromSeconds(VIDEO_DURATION_IN_SECONDS[src]);

export const TOTAL_DURATION_IN_FRAMES =
  INTRO_DURATION_IN_FRAMES +
  modelSections.reduce((total, section) => {
    const clipFrames = section.clips.reduce(
      (sectionTotal, clip) => sectionTotal + getClipDurationInFrames(clip.src),
      0,
    );

    return total + SECTION_TITLE_DURATION_IN_FRAMES + clipFrames;
  }, 0) +
  QUESTION_DURATION_IN_FRAMES +
  getClipDurationInFrames(endingClip.src);

const fontFamily =
  '"Aptos Display", "Yu Gothic UI", "Hiragino Sans", "Meiryo", sans-serif';

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => part + part)
          .join("")
      : normalized;

  const channelValues = [0, 2, 4].map((index) =>
    Number.parseInt(value.slice(index, index + 2), 16),
  );

  return `rgba(${channelValues.join(", ")}, ${alpha})`;
};

const backgroundStyle = (accent: string) =>
  ({
    backgroundColor: "#050816",
    backgroundImage: `
      radial-gradient(circle at 16% 18%, ${toRgba(accent, 0.34)} 0%, rgba(0, 0, 0, 0) 34%),
      radial-gradient(circle at 83% 12%, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0) 24%),
      radial-gradient(circle at 72% 82%, ${toRgba(accent, 0.2)} 0%, rgba(0, 0, 0, 0) 32%),
      linear-gradient(180deg, #09111f 0%, #050816 58%, #02040b 100%)
    `,
  }) as const;

const overlayGridStyle = {
  backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
  `,
  backgroundSize: "80px 80px",
  maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0))",
  opacity: 0.35,
} as const;

const getTitleFontSize = (title: string, variant: LayoutVariant) => {
  if (variant === "portrait") {
    if (title.length > 20) {
      return 68;
    }

    if (title.length > 14) {
      return 86;
    }

    return 104;
  }

  if (title.length > 20) {
    return 78;
  }

  if (title.length > 14) {
    return 92;
  }

  return 108;
};

const TitleCard = ({
  accent,
  durationInFrames,
  eyebrow,
  subtitle,
  title,
  variant,
}: {
  accent: string;
  durationInFrames: number;
  eyebrow: string;
  subtitle?: string;
  title: string;
  variant: LayoutVariant;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = layoutPresets[variant];
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 170,
      mass: 0.9,
    },
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const cardOpacity = entrance * fadeOut;
  const cardTranslate = interpolate(entrance, [0, 1], [40, 0]);
  const cardScale = interpolate(entrance, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill style={backgroundStyle(accent)}>
      <AbsoluteFill style={overlayGridStyle} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 6, 13, 0.08) 0%, rgba(3, 6, 13, 0.72) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: variant === "portrait" ? 70 : 54,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: layout.titleCardMaxWidth,
            borderRadius: variant === "portrait" ? 44 : 38,
            padding: layout.titleCardPadding,
            color: "#f9fcff",
            background: "rgba(10, 15, 26, 0.58)",
            border: `1px solid ${toRgba(accent, 0.44)}`,
            boxShadow: `0 28px 90px ${toRgba(accent, 0.18)}`,
            transform: `translateY(${cardTranslate}px) scale(${cardScale})`,
            opacity: cardOpacity,
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: layout.eyebrowFontSize,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: toRgba("#ffffff", 0.72),
              marginBottom: variant === "portrait" ? 26 : 22,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: getTitleFontSize(title, variant),
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: subtitle ? (variant === "portrait" ? 26 : 22) : 0,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontFamily,
                fontSize: layout.subtitleFontSize,
                lineHeight: 1.55,
                color: toRgba("#f5f9ff", 0.84),
                maxWidth: layout.subtitleMaxWidth,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const VideoScene = ({
  accent,
  clipCount,
  clipLabel,
  clipNumber,
  sectionTitle,
  src,
  variant,
}: {
  accent: string;
  clipCount: number;
  clipLabel: string;
  clipNumber: number;
  sectionTitle: string;
  src: VideoFileName;
  variant: LayoutVariant;
}) => {
  const frame = useCurrentFrame();
  const layout = layoutPresets[variant];
  const reveal = spring({
    fps: COMPOSITION_FPS,
    frame,
    config: {
      damping: 200,
      stiffness: 180,
      mass: 0.9,
    },
  });
  const panelTranslate = interpolate(reveal, [0, 1], [28, 0]);
  const panelScale = interpolate(reveal, [0, 1], [0.97, 1]);
  const panelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={backgroundStyle(accent)}>
      <AbsoluteFill style={overlayGridStyle} />
      <AbsoluteFill
        style={{
          padding: layout.scenePadding,
          color: "#f9fcff",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: layout.headingMaxWidth }}>
            <div
              style={{
                fontFamily,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: layout.sceneBadgePadding,
                borderRadius: 999,
                fontSize: layout.sceneBadgeFontSize,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: toRgba("#ffffff", 0.92),
                background: toRgba(accent, 0.18),
                border: `1px solid ${toRgba(accent, 0.34)}`,
                marginBottom: variant === "portrait" ? 26 : 18,
              }}
            >
              {SECTION_BADGE}
            </div>
            <div
              style={{
                fontFamily,
                fontSize: layout.sceneTitleFontSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
              }}
            >
              {sectionTitle}
            </div>
          </div>

          <div
            style={{
              fontFamily,
              minWidth: layout.counterMinWidth,
              padding: layout.counterPadding,
              borderRadius: 28,
              background: "rgba(8, 12, 20, 0.62)",
              border: `1px solid ${toRgba("#ffffff", 0.14)}`,
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: layout.counterLabelFontSize,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: toRgba("#ffffff", 0.56),
                marginBottom: 10,
              }}
            >
              Clip
            </div>
            <div
              style={{
                fontSize: layout.counterValueFontSize,
                fontWeight: 800,
              }}
            >
              {clipNumber} / {clipCount}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: layout.videoPanelMaxWidth,
              padding: variant === "portrait" ? 18 : 16,
              borderRadius: variant === "portrait" ? 42 : 34,
              background: "rgba(7, 11, 18, 0.62)",
              border: `1px solid ${toRgba(accent, 0.3)}`,
              boxShadow: `0 30px 90px ${toRgba(accent, 0.24)}`,
              transform: `translateY(${panelTranslate}px) scale(${panelScale})`,
              opacity: panelOpacity,
            }}
          >
            <OffthreadVideo
              src={staticFile(`videos/${src}`)}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "contain",
                borderRadius: variant === "portrait" ? 28 : 24,
                backgroundColor: "#000000",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontFamily,
          }}
        >
          <div
            style={{
              padding: layout.filenamePadding,
              borderRadius: 999,
              background: "rgba(8, 12, 20, 0.62)",
              border: `1px solid ${toRgba("#ffffff", 0.14)}`,
              fontSize: layout.filenameFontSize,
              color: toRgba("#ffffff", 0.76),
              whiteSpace: "nowrap",
            }}
          >
            {clipLabel}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CompareComposition = ({ variant }: { variant: LayoutVariant }) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={INTRO_DURATION_IN_FRAMES}>
        <TitleCard
          accent="#6cb8ff"
          durationInFrames={INTRO_DURATION_IN_FRAMES}
          eyebrow="AI Generated Video Comparison"
          subtitle={INTRO_COPY}
          title={MAIN_TITLE}
          variant={variant}
        />
      </Series.Sequence>

      {modelSections.flatMap((section) => [
        <Series.Sequence
          key={`${variant}-${section.title}-title`}
          durationInFrames={SECTION_TITLE_DURATION_IN_FRAMES}
        >
          <TitleCard
            accent={section.accent}
            durationInFrames={SECTION_TITLE_DURATION_IN_FRAMES}
            eyebrow="Model Showcase"
            title={section.title}
            variant={variant}
          />
        </Series.Sequence>,
        ...section.clips.map((clip, index) => (
          <Series.Sequence
            key={`${variant}-${section.title}-${clip.src}`}
            durationInFrames={getClipDurationInFrames(clip.src)}
          >
            <VideoScene
              accent={section.accent}
              clipCount={section.clips.length}
              clipLabel={clip.label}
              clipNumber={index + 1}
              sectionTitle={section.title}
              src={clip.src}
              variant={variant}
            />
          </Series.Sequence>
        )),
      ])}

      <Series.Sequence durationInFrames={QUESTION_DURATION_IN_FRAMES}>
        <TitleCard
          accent="#8f9fb4"
          durationInFrames={QUESTION_DURATION_IN_FRAMES}
          eyebrow="Your Pick"
          title={QUESTION_TITLE}
          variant={variant}
        />
      </Series.Sequence>

      <Series.Sequence durationInFrames={getClipDurationInFrames(endingClip.src)}>
        <VideoScene
          accent="#8f9fb4"
          clipCount={1}
          clipLabel={endingClip.label}
          clipNumber={1}
          sectionTitle="LBCM"
          src={endingClip.src}
          variant={variant}
        />
      </Series.Sequence>
    </Series>
  );
};

export const MyComposition = () => {
  return <CompareComposition variant="portrait" />;
};

export const MyLandscapeComposition = () => {
  return <CompareComposition variant="landscape" />;
};
