import fs from "fs";
import path from "path";

const images = [
  { src: "C:\\Users\\hartm\\.gemini\\antigravity\\brain\\d66134b1-edbf-4c9a-a732-961d285c9c0b\\rabbit_turtle_start_1773920985216.png", dest: "1.png" },
  { src: "C:\\Users\\hartm\\.gemini\\antigravity\\brain\\d66134b1-edbf-4c9a-a732-961d285c9c0b\\rabbit_turtle_run_1773920999595.png", dest: "2.png" },
  { src: "C:\\Users\\hartm\\.gemini\\antigravity\\brain\\d66134b1-edbf-4c9a-a732-961d285c9c0b\\rabbit_turtle_sleep_1773921014333.png", dest: "3.png" },
  { src: "C:\\Users\\hartm\\.gemini\\antigravity\\brain\\d66134b1-edbf-4c9a-a732-961d285c9c0b\\rabbit_turtle_win_1773921029773.png", dest: "4.png" }
];

const destDir = path.join(process.cwd(), "public", "images");

// Ensure directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

for (const img of images) {
  try {
    const data = fs.readFileSync(img.src);
    const destPath = path.join(destDir, img.dest);
    fs.writeFileSync(destPath, data);
    console.log(`Successfully wrote to ${destPath}`);
  } catch (e) {
    console.error(`Failed to copy ${img.dest}:`, e.message);
  }
}
