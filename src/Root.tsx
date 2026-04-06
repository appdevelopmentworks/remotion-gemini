import "./index.css";
import { Composition } from "remotion";
import {
  COMPOSITION_FPS,
  COMPOSITION_LANDSCAPE_HEIGHT,
  COMPOSITION_LANDSCAPE_ID,
  COMPOSITION_LANDSCAPE_WIDTH,
  COMPOSITION_PORTRAIT_HEIGHT,
  COMPOSITION_PORTRAIT_ID,
  COMPOSITION_PORTRAIT_WIDTH,
  MyComposition,
  MyLandscapeComposition,
  TOTAL_DURATION_IN_FRAMES,
} from "./Composition";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id={COMPOSITION_PORTRAIT_ID}
        component={MyComposition}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_PORTRAIT_WIDTH}
        height={COMPOSITION_PORTRAIT_HEIGHT}
      />
      <Composition
        id={COMPOSITION_LANDSCAPE_ID}
        component={MyLandscapeComposition}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={COMPOSITION_FPS}
        width={COMPOSITION_LANDSCAPE_WIDTH}
        height={COMPOSITION_LANDSCAPE_HEIGHT}
      />
    </>
  );
};
