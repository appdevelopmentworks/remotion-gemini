import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import fs from "fs";
import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";

const main = async () => {
  const to = path.join(process.cwd(), "whisper.cpp");

  await installWhisperCpp({
    to,
    version: "1.5.5",
  });

  await downloadWhisperModel({
    model: "small", // Using small for faster execution and decent Japanese support
    folder: to,
  });

  const inputAudio = path.join(process.cwd(), "public", "audio", "story.mp3");
  const outputWav = path.join(process.cwd(), "public", "audio", "story.wav");

  console.log("Converting mp3 to wav 16kHz using ffmpeg...");
  
  try {
    // using ffmpeg-static directly
    execSync(`"${ffmpegStatic}" -i "${inputAudio}" -ar 16000 "${outputWav}" -y`, { stdio: 'inherit' });
  } catch (e) {
    console.error("FFmpeg conversion failed:", e);
    process.exit(1);
  }

  const scriptPath = path.join(process.cwd(), "public", "audio", "story.txt");
  let additionalArgs = [];
  if (fs.existsSync(scriptPath)) {
    console.log("Found original script text! Using it as a prompt for highly accurate transcription.");
    const promptText = fs.readFileSync(scriptPath, "utf-8").replace(/\n/g, "");
    additionalArgs = ["--prompt", promptText];
  }

  console.log("Transcribing (this may take a minute depending on duration)...");
  
  const whisperCppOutput = await transcribe({
    model: "small",
    whisperPath: to,
    whisperCppVersion: "1.5.5",
    inputPath: outputWav,
    language: "ja",
    tokenLevelTimestamps: true,
    splitOnWord: false,
    additionalArgs,
  });

  const { captions } = toCaptions({
    whisperCppOutput,
  });

  const jsonPath = path.join(process.cwd(), "public", "audio", "story.json");
  fs.writeFileSync(jsonPath, JSON.stringify(captions, null, 2));
  
  console.log("Transcription successful! Saved to:", jsonPath);
};

main().catch(console.error);
