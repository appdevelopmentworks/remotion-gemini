import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Template"
      component={MyComposition}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
