import "./index.css";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={1040} // Updated based on story.json (approx 34.6s)
        fps={30}
        width={1080}
        height={1920} // Vertical video format
      />
    </>
  );
};
