import "./index.css";
import { Composition } from "remotion";
import {
  YoutubeShortComposition,
  YOUTUBE_SHORT_DURATION_IN_FRAMES,
  YOUTUBE_SHORT_FPS,
  YOUTUBE_SHORT_HEIGHT,
  YOUTUBE_SHORT_ID,
  YOUTUBE_SHORT_WIDTH,
} from "./YoutubeShortComposition";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id={YOUTUBE_SHORT_ID}
        component={YoutubeShortComposition}
        durationInFrames={YOUTUBE_SHORT_DURATION_IN_FRAMES}
        fps={YOUTUBE_SHORT_FPS}
        width={YOUTUBE_SHORT_WIDTH}
        height={YOUTUBE_SHORT_HEIGHT}
      />
    </>
  );
};
