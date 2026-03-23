import "./index.css";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";
import {
  CombinedCM,
  combinedCMCalculateMetadata,
  combinedCMDefaultProps,
} from "./CombinedCM";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={1200} // Updated based on story.json (total ~39s + buffer)
        fps={30}
        width={1080}
        height={1920} // Vertical video format
      />
      <Composition
        id="CombinedCM"
        component={CombinedCM}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={704}
        defaultProps={combinedCMDefaultProps}
        calculateMetadata={combinedCMCalculateMetadata}
      />
    </>
  );
};
