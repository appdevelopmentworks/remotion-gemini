---
name: automatic-japanese-subtitles
description: How to automatically process Japanese audio into synchronized subtitles using Whisper and Remotion
metadata:
  tags: subtitles, captions, remotion, whisper, japanese, sync, transcription
---

# Automatic Japanese Subtitles with Whisper

Transcribing and synchronizing Japanese content correctly requires handling cases where words do not have spacing (unlike English). Here is the best practice for creating automatic synchronized Japanese subtitles from audio/video files.

## 1. Using Whisper.cpp for True Token Timestamps

First, ensure you have `@remotion/install-whisper-cpp` and `@remotion/captions` installed.

Create a transcription script (e.g. `scripts/transcribe.mjs`). For Japanese, the `splitOnWord` parameter **must** be set to `false` to avoid Unicode parsing errors (like `\uFFFD`), and `language: "ja"` should be set explicitly.

```javascript
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
// Note: npm install -D ffmpeg-static
import ffmpegStatic from "ffmpeg-static"; 
import { downloadWhisperModel, installWhisperCpp, transcribe, toCaptions } from "@remotion/install-whisper-cpp";

const processJapaneseAudio = async (inputPath, outputJsonName) => {
  const whisperDir = path.join(process.cwd(), "whisper.cpp");
  await installWhisperCpp({ to: whisperDir, version: "1.5.5" });
  await downloadWhisperModel({ model: "small", folder: whisperDir });

  const outputWav = path.join(process.cwd(), "public", "temp.wav");
  
  // 1. Convert any input to 16kHz WAV format required by Whisper
  execSync(`"${ffmpegStatic}" -i "${inputPath}" -ar 16000 "${outputWav}" -y`, { stdio: 'inherit' });

  // 2. Transcribe with Japanese optimization
  const whisperOutput = await transcribe({
    model: "small",
    whisperPath: whisperDir,
    whisperCppVersion: "1.5.5",
    inputPath: outputWav,
    language: "ja",             // Force Japanese
    tokenLevelTimestamps: true, // Crucial for karaoke-style sync
    splitOnWord: false,         // CRITICAL: Prevent Japanese character corruption
  });

  const { captions } = toCaptions({ whisperCppOutput });

  // 3. Save JSON to public folder
  const jsonPath = path.join(process.cwd(), "public", outputJsonName);
  fs.writeFileSync(jsonPath, JSON.stringify(captions, null, 2));
};
```

## 2. Paging Japanese Subtitles Correctly

Because Japanese lacks spaces, `@remotion/captions`' builtin `createTikTokStyleCaptions` sometimes combines the entire video into a single page. 

You should implement a custom grouping logic to paginate Japanese text based on **pauses in speech** (e.g. gaps > 800ms) or **maximum on-screen duration** (e.g. 2500ms).

```tsx
import { useMemo } from "react";
import type { TikTokPage, Caption } from "@remotion/captions";

const MAX_DURATION_MS = 2500;
const MAX_GAP_MS = 800;

export const useJapanesePages = (captions: Caption[] | null): TikTokPage[] => {
  return useMemo(() => {
    if (!captions) return [];
    
    const customPages: TikTokPage[] = [];
    let currentTokens: any[] = [];
    let currentStartMs = 0;
    
    captions.forEach((cap, i) => {
      // Clean any potential garbage tokens
      const text = cap.text.replace(/\uFFFD/g, '').trim();
      if (!text) return; 
      
      const token = { text, fromMs: cap.startMs, toMs: cap.endMs };
      
      if (currentTokens.length === 0) {
        currentStartMs = cap.startMs;
        currentTokens.push(token);
      } else {
        const lastToken = currentTokens[currentTokens.length - 1];
        // Break into a new page if the speaker paused, or if the text block is on screen too long
        if (cap.startMs - lastToken.toMs > MAX_GAP_MS || cap.endMs - currentStartMs > MAX_DURATION_MS) {
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
      
      // Ensure the very last token gets added
      if (i === captions.length - 1 && currentTokens.length > 0) {
        customPages.push({
            text: currentTokens.map(t => t.text).join(''),
            startMs: currentStartMs,
            tokens: currentTokens,
            durationMs: currentTokens[currentTokens.length - 1].toMs - currentStartMs,
        });
      }
    });

    return customPages;
  }, [captions]);
};
```

## 3. Rendering Perfect Subtitle Timings

Map over the filtered `pages` inside your React Component, wrapping your `CaptionPage` child component inside a Remotion `<Sequence>`.

```tsx
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
// ... (import useJapanesePages)

export const CaptionedVideo: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const pages = useJapanesePages(captions);
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        
        // Disappear ~500ms after the spoken word ends, OR immediately when the next line begins
        const lastToken = page.tokens[page.tokens.length - 1];
        const idealEndMs = lastToken ? lastToken.toMs + 500 : page.startMs + 1000;
        
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          (idealEndMs / 1000) * fps,
        );
        const durationForCaption = endFrame - startFrame;

        if (durationForCaption <= 0) return null;

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
```
