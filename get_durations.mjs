import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import path from "path";

const files = ["line0.mp3", "line1.mp3", "line2.mp3", "line3.mp3"];
const base = path.join(process.cwd(), "public", "audio", "temp_story");

files.forEach(f => {
    const p = path.join(base, f);
    const out = execSync(`"${ffmpegStatic}" -i "${p}" 2>&1`).toString();
    const match = out.match(/Duration: (\d+:\d+:\d+.\d+)/);
    console.log(`${f}: ${match ? match[1] : "not found"}`);

});
