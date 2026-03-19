import fs from "fs";

async function testTTS() {
  try {
    const text = "むかしむかし、あるところにウサギとカメがいました。"; // "Once upon a time, there were a tortoise and a hare."
    const speaker = 2; // 四国めたん(ノーマル)
    
    // api.tts.quest/v3/voicevox/synthesis
    const url = `https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(text)}&speaker=${speaker}`;
    console.log("Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("Response:", data);
    
    if (data.mp3DownloadUrl) {
      console.log("Audio URL:", data.mp3DownloadUrl);
      // Wait a bit and download?
      const audioRes = await fetch(data.mp3DownloadUrl);
      const buffer = await audioRes.arrayBuffer();
      fs.writeFileSync("test.mp3", Buffer.from(buffer));
      console.log("test.mp3 saved, size:", buffer.byteLength);
    }
  } catch(e) {
    console.error(e);
  }
}
testTTS();
