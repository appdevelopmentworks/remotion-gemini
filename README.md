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

### 1. Auto Video Generation Workflow (Recommended)

You can ask the AI Assistant (e.g. Gemini, Cursor) to generate the video for you automatically by using the `/auto-video` workflow command:
`> /auto-video 「ウサギとカメ」の動画を作ってください`

The AI will:
1. Generate the narrative script
2. Synthesize audio using **VOICEVOX** (e.g., Shikoku Metan)
3. Transcribe and sync the audio perfectly using **Whisper.cpp** into JSON
4. Generate AI Background imagery
5. Configure the timeline automatically

*(Note: The generated audio (`story.mp3`), subtitles (`story.json`), and images are intentionally added to `.gitignore`. They are intermediate output files that can be regenerated on the fly and should not be checked into Git to keep the repository lightweight.)*

### 2. Manual Generation
If you want to manually generate the assets instead:
- Run the voice generation: `node scripts/generate_story_audio.mjs`
- Run the Whisper transcription script: `node scripts/transcribe.mjs`
- Start the Remotion Studio in your browser: `npm run dev`
- To export the video as an MP4: `npm run build`

## AI Agent Integration

This project is enhanced with **Remotion Agent Skills**. Any connected AI agent (Cursor, Claude Code, GitHub Copilot, Gemini, etc.) checking this repository will refer to `.agents/skills/remotion-best-practices` for the latest rules. Included is a custom rule specifically for Japanese parsing: `automatic-japanese-subtitles.md`.

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
