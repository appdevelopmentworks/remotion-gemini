import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Series,
  staticFile,
  Video,
} from "remotion";
import { z } from "zod";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

// CM動画のリスト（順番：LBCM001～006、最後にLBCMTITLE）
const CM_VIDEO_FILES = [
  "videos/LBCM001.mp4",
  "videos/LBCM002.mp4",
  "videos/LBCM003.mp4",
  "videos/LBCM004.mp4",
  "videos/LBCM005.mp4",
  "videos/LBCM006.mp4",
  "videos/LBCMTITLE.mp4",
];

const videoItemSchema = z.object({
  src: z.string(),
  durationInFrames: z.number(),
});

const combinedCMSchema = z.object({
  videoFiles: z.array(videoItemSchema),
});

type CombinedCMProps = z.infer<typeof combinedCMSchema>;

export const combinedCMCalculateMetadata: CalculateMetadataFunction<
  CombinedCMProps
> = async ({ props }) => {
  const fps = 30;

  const videoFiles = await Promise.all(
    CM_VIDEO_FILES.map(async (src) => {
      const url = staticFile(src);
      const input = new Input({
        formats: ALL_FORMATS,
        source: new UrlSource(url, { getRetryDelay: () => null }),
      });
      const durationInSeconds = await input.computeDuration();
      return { src, durationInFrames: Math.round(durationInSeconds * fps) };
    })
  );

  const totalDurationInFrames = videoFiles.reduce(
    (sum, v) => sum + v.durationInFrames,
    0
  );

  return {
    durationInFrames: totalDurationInFrames,
    props: { ...props, videoFiles },
  };
};

export const CombinedCM: React.FC<CombinedCMProps> = ({ videoFiles }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {videoFiles.map(({ src, durationInFrames }) => (
          <Series.Sequence key={src} durationInFrames={durationInFrames}>
            <Video
              src={staticFile(src)}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

export const combinedCMDefaultProps: CombinedCMProps = {
  videoFiles: CM_VIDEO_FILES.map((src) => ({ src, durationInFrames: 0 })),
};
