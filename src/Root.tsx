import "./index.css";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={4350} // Approx 145s based on the transcription json
        fps={30}
        width={1080}
        height={1920} // Vertical video format
      />
    </>
  );
};
