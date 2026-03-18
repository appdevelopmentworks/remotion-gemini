import { useCallback, useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useDelayRender, useVideoConfig } from "remotion";
import type { Caption, TikTokPage } from "@remotion/captions";
import { CaptionPage } from "./CaptionPage";

const SWITCH_CAPTIONS_EVERY_MS = 2500; // Combine into comfortable readable blocks
const TIGER_IMAGES = Array.from({ length: 7 }, (_, i) => `images/tiger${i + 1}.jpeg`);

export const CaptionedVideo: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps, durationInFrames } = useVideoConfig();

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("audio/技術のうち.json"));
      const data = await response.json();
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const { pages } = useMemo(() => {
    if (!captions) return { pages: [] };
    
    // Custom logic to handle Japanese words without spaces properly
    const customPages: TikTokPage[] = [];
    let currentTokens: any[] = [];
    let currentStartMs = 0;
    
    captions.forEach((cap, i) => {
      const text = cap.text.replace(/\uFFFD/g, '').trim();
      if (!text) return; // Skip empty tokens (like ♪ or ~)
      
      const token = {
        text,
        fromMs: cap.startMs,
        toMs: cap.endMs,
      };
      
      if (currentTokens.length === 0) {
        currentStartMs = cap.startMs;
        currentTokens.push(token);
      } else {
        const lastToken = currentTokens[currentTokens.length - 1];
        // Break into a new page if gap > 800ms OR total duration > SWITCH_CAPTIONS_EVERY_MS
        if (cap.startMs - lastToken.toMs > 800 || cap.endMs - currentStartMs > SWITCH_CAPTIONS_EVERY_MS) {
          customPages.push({
            text: currentTokens.map(t => t.text).join(''),
            startMs: currentStartMs,
            tokens: currentTokens,
            durationMs: lastToken.toMs - currentStartMs,
          });
          currentStartMs = cap.startMs;
          currentTokens = [token];
        } else {
          currentTokens.push(token);
        }
      }
      
      // Ensure the last token gets added
      if (i === captions.length - 1 && currentTokens.length > 0) {
        customPages.push({
            text: currentTokens.map(t => t.text).join(''),
            startMs: currentStartMs,
            tokens: currentTokens,
            durationMs: currentTokens[currentTokens.length - 1].toMs - currentStartMs,
        });
      }
    });

    return { pages: customPages };
  }, [captions]);

  if (!captions) {
    return null;
  }

  // Assign images evenly across the total video duration
  const imageDurationFrames = Math.ceil(durationInFrames / TIGER_IMAGES.length);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Play Audio in background */}
      <Audio src={staticFile("audio/技術のうち.mp3")} />

      {/* Background Images loop */}
      {TIGER_IMAGES.map((imgSrc, i) => (
        <Sequence
          key={imgSrc}
          from={i * imageDurationFrames}
          durationInFrames={imageDurationFrames}
        >
          <Img 
            src={staticFile(imgSrc)} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              filter: "brightness(0.35) contrast(1.1)", // Darken the background to make captions readable
            }} 
          />
        </Sequence>
      ))}

      {/* Render the specific synchronized words */}
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const lastToken = page.tokens[page.tokens.length - 1];
        // The block should disappear 500ms after the last token is sung, or immediately if the next page starts
        const idealEndMs = lastToken ? lastToken.toMs + 500 : page.startMs + 1000;
        
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          (idealEndMs / 1000) * fps,
        );
        const durationForCaption = endFrame - startFrame;

        if (durationForCaption <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={Math.round(durationForCaption)}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
