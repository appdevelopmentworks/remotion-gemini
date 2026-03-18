import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";

const HIGHLIGHT_COLOR = "#FFDD00"; // Bright yellow like Tiktok/Instagram classic

export const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time relative to the start of the sequence
  const currentTimeMs = (frame / fps) * 1000;
  // Convert to absolute time by adding the page start
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div 
        style={{ 
          fontSize: 100, 
          fontWeight: 900, 
          whiteSpace: "pre-wrap", 
          textAlign: "center",
          textShadow: "0px 6px 15px rgba(0,0,0,0.8), 0px 0px 4px rgba(0,0,0,1)", 
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          width: "90%",
          lineHeight: 1.2
        }}
      >
        {page.tokens
          .filter(token => token.text !== '\uFFFD' && !token.text.includes('\uFFFD'))
          .map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

          return (
            <span
              key={token.fromMs}
              style={{ 
                color: isActive ? HIGHLIGHT_COLOR : "white",
                display: "inline-block",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.1s ease-out",
                marginRight: "4px"
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
