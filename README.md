# Remotion Japanese Captioned Video

This is a Remotion project configured for generating vertical (TikTok/Reels/Shorts format) videos synchronized with Japanese audio and dynamic captions.

## Overview
- Uses **Remotion** to programmatically generate video from React components.
- Auto-generates captions using **Whisper.cpp** (`@remotion/install-whisper-cpp`), optimized specially for Japanese text output.
- Custom logic to render **Karaoke/TikTok style glowing text** synced to the word-level for languages without spaces (like Japanese).

## Folder Structure

- `src/` - React components containing the video UI (`CaptionedVideo.tsx`, `CaptionPage.tsx`).
- `public/audio/`- Place your input audio files (`.mp3` or `.wav`) here. This folder also stores the output `JSON` subtitle files.
- `public/images/` - Place slideshow background images here.
- `scripts/` - Node.js scripts for processing audio into subtitle data.
- `.agents/skills/` - Integrated AI Agent Skills to serve as guidelines for AI coding assistants on how to write Remotion code.

## How to Use

### 1. Transcribe Audio (Generate Subtitles)

Put your target audio file into `public/audio/` (e.g. `技術のうち.mp3`).

If you've added new audio, run the transcription script to generate the Whisper JSON:
```console
node scripts/transcribe.mjs
```
*(Note: The script is currently configured to parse `技術のうち.mp3` and output `技術のうち.json`. If you want to use a different file, adjust the paths inside `scripts/transcribe.mjs` first.)*

### 2. Preview the Video

Start the Remotion Studio in your browser:
```console
npm run dev
```
In the browser, select the `CaptionedVideo` composition. It will automatically load the audio, background images, and synchronize the text to the timings produced by the JSON file.

### 3. Render the Video to MP4

Once you are satisfied with the preview, render it out to an MP4 file:
```console
npm run build
```

## AI Agent Integration

This project is enhanced with **Remotion Agent Skills**. Any connected AI agent (Cursor, Claude Code, GitHub Copilot, Gemini, etc.) checking this repository will refer to `.agents/skills/remotion-best-practices` for the latest rules. Included is a custom rule specifically for Japanese parsing: `automatic-japanese-subtitles.md`.

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
