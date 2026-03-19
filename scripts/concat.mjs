import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const tempDir = path.join(process.cwd(), "public", "audio", "temp_story");
const finalOut = path.join(process.cwd(), "public", "audio", "story.mp3");

console.log("Emptying final out");
fs.writeFileSync(finalOut, Buffer.alloc(0));

for(let i=0; i<8; i++) {
  const buf = fs.readFileSync(path.join(tempDir, `line${i}.mp3`));
  fs.appendFileSync(finalOut, buf);
}
console.log("Concatenated using fs!");
