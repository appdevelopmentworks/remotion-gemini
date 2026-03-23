---
name: combine-videos
description: Combining multiple video files into one sequential video using Remotion Series and calculateMetadata
metadata:
  tags: combine, concatenate, merge, series, video, playlist, sequential
---

# Combining Multiple Videos into One

Use `<Series>` with `calculateMetadata` to dynamically concatenate multiple video files in sequence.
This avoids hardcoding frame counts by reading durations automatically at render time.

## Pattern: Dynamic Duration via calculateMetadata

The best approach is to use `calculateMetadata` to fetch all video durations at startup,
then pass them as props to the component so the composition's total `durationInFrames` is accurate.

### 1. Define Props and the component

```tsx
import { AbsoluteFill, CalculateMetadataFunction, Series, staticFile, Video } from "remotion";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";
import { z } from "zod";

const videoSchema = z.object({
  videoFiles: z.array(
    z.object({
      src: z.string(),
      durationInFrames: z.number(),
    })
  ),
});

type Props = z.infer<typeof videoSchema>;
```

### 2. calculateMetadata — fetch durations dynamically

```tsx
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const fps = 30;

  const videoFiles = await Promise.all(
    props.videoFiles.map(async ({ src }) => {
      const input = new Input({
        formats: ALL_FORMATS,
        source: new UrlSource(staticFile(src), { getRetryDelay: () => null }),
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
```

### 3. The Component

```tsx
export const CombinedVideos: React.FC<Props> = ({ videoFiles }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
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
```

### 4. Register in Root.tsx

```tsx
import { CombinedVideos, calculateMetadata } from "./CombinedVideos";

<Composition
  id="CombinedVideos"
  component={CombinedVideos}
  durationInFrames={1}        // overridden by calculateMetadata
  fps={30}
  width={1280}
  height={704}
  defaultProps={{
    videoFiles: [
      { src: "videos/clip1.mp4", durationInFrames: 0 },
      { src: "videos/clip2.mp4", durationInFrames: 0 },
    ],
  }}
  calculateMetadata={calculateMetadata}
/>
```

## Key Rules

- **Never hardcode frame counts** — always use `calculateMetadata` to read durations dynamically.
- **Use `staticFile()` when referencing files in `public/`**.
- **Use `mediabunny`** (`Input`, `ALL_FORMATS`, `UrlSource`) to get video duration.
- **Use `<Series>`** for sequential (non-overlapping) video playback.
- Each `<Series.Sequence>` must have `durationInFrames` set to the video's actual frame count.
- Use `objectFit: "contain"` or `"cover"` depending on whether you want letterboxing or cropping.

## Rendering

Add a script to `package.json`:

```json
"render-combined": "remotion render CombinedVideos out/combined.mp4"
```

Then run:

```bash
npm run render-combined
```
