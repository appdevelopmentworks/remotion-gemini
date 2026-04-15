import "./index.css";
import { Composition } from "remotion";
import {
  Main,
  SHORTS_DURATION_IN_FRAMES,
  SHORTS_FPS,
  SHORTS_HEIGHT,
  SHORTS_ID,
  SHORTS_WIDTH,
} from "./Main";

export const RemotionRoot = () => {
  return (
    <Composition
      id={SHORTS_ID}
      component={Main}
      durationInFrames={SHORTS_DURATION_IN_FRAMES}
      fps={SHORTS_FPS}
      width={SHORTS_WIDTH}
      height={SHORTS_HEIGHT}
    />
  );
};
