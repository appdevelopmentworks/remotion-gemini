import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";

try {
    const out = execSync(`"${ffmpegStatic}" -i public/audio/temp_story/line0.mp3 2>&1`).toString();
    console.log(out);
} catch (e) {
    console.log(e.stderr?.toString() || e.stdout?.toString() || e.message);
}
