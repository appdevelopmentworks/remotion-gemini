import "./index.css";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";
import {
  CombinedCM,
  combinedCMCalculateMetadata,
  combinedCMDefaultProps,
} from "./CombinedCM";
import {
  SoraBye,
  soraByeCalculateMetadata,
  soraByeDefaultProps,
} from "./SoraBye";
import {
  NankyokuFudousan,
  nankyokuCalculateMetadata,
  nankyokuDefaultProps,
} from "./NankyokuFudousan";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={1496} // 氷山動画 (春日部つむぎ): duration=48.85s → 48.85*30+30Buffer = 1496f
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
      <Composition
        id="SoraBye"
        component={SoraBye}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={720}
        defaultProps={soraByeDefaultProps}
        calculateMetadata={soraByeCalculateMetadata}
      />
      <Composition
        id="NankyokuFudousan"
        component={NankyokuFudousan}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={720}
        defaultProps={nankyokuDefaultProps}
        calculateMetadata={nankyokuCalculateMetadata}
      />
    </>
  );
};
