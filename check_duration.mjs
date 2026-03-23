import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";

try {
    const out = execSync(`"${ffmpegStatic}" -i public/audio/story.mp3 2>&1`).toString();
    const duration = out.match(/Duration: (\d+:\d+:\d+.\d+)/)?.[1];
    console.log(`Duration: ${duration}`);
    process.exit(0);
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
