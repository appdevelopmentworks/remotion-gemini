import { execSync } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import path from "path";

const videoPath = path.join(process.cwd(), "public", "videos", "nankyokufudousan.mp4");
try {
    const out = execSync(`"${ffmpegStatic}" -i "${videoPath}" 2>&1`).toString();
    const durationMatch = out.match(/Duration: (\d+:\d+:\d+\.\d+)/);
    const videoMatch = out.match(/Video: .*? (\d+)x(\d+) /);
    const fpsMatch = out.match(/(\d+(?:\.\d+)?) fps/);
    console.log("Duration:", durationMatch ? durationMatch[1] : "not found");
    console.log("Dimensions:", videoMatch ? `${videoMatch[1]}x${videoMatch[2]}` : "not found");
    console.log("FPS:", fpsMatch ? fpsMatch[1] : "not found");
} catch (e) {
    console.log(e.message);
    if (e.stdout) console.log(e.stdout.toString());
}
