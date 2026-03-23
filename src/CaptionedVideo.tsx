import { useCallback, useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useDelayRender, useVideoConfig, spring, useCurrentFrame, interpolate } from "remotion";

interface Caption {
  text: string;
  startMs: number;
  endMs: number;
}

// Slide 1: Timeline
const Timeline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const progress = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 100px" }}>
      <div style={{ fontSize: 90, fontWeight: "bold", color: "white", marginBottom: 120 }}>南極条約の歴史</div>
      <div style={{ position: "relative", width: 8, height: 800 * progress, background: "rgba(255,255,255,0.3)", borderRadius: 4 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 800 * progress, background: "white", borderRadius: 4 }} />
        
        {/* 1959 */}
        <div style={{ position: "absolute", top: 150, left: 60, opacity: progress, width: 600 }}>
          <div style={{ fontSize: 60, color: "#99f6ff", fontWeight: "bold", whiteSpace: "nowrap" }}>1959年12月1日</div>
          <div style={{ fontSize: 45, color: "white", marginTop: 10, whiteSpace: "nowrap" }}>ワシントンで採択</div>
        </div>
        <div style={{ position: "absolute", top: 165, left: -16, width: 40, height: 40, background: "#99f6ff", borderRadius: "50%", border: "6px solid #050a10" }} />
        
        {/* 1961 */}
        {progress > 0.6 && (
          <>
            <div style={{ position: "absolute", top: 550, left: 60, opacity: (progress - 0.6) / 0.4, width: 600 }}>
              <div style={{ fontSize: 60, color: "#99f6ff", fontWeight: "bold", whiteSpace: "nowrap" }}>1961年6月23日</div>
              <div style={{ fontSize: 45, color: "white", marginTop: 10, whiteSpace: "nowrap" }}>条約が正式に発効</div>
            </div>
            <div style={{ position: "absolute", top: 565, left: -16, width: 40, height: 40, background: "#99f6ff", borderRadius: "50%", border: "6px solid #050a10" }} />
          </>
        )}
      </div>
    </div>
  );
};


// Slide 2: Purpose
const Purpose: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = (d: number) => spring({ frame, fps, delay: d, config: { damping: 200 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 100, width: "100%" }}>
      <div style={{ fontSize: 90, fontWeight: "bold", color: "white" }}>主な目的</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 80, width: "90%" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "50px 40px", borderRadius: 30, border: "3px solid #99f6ff", opacity: spr(0), transform: `translateY(${(1-spr(0))*50}px)` }}>
          <div style={{ fontSize: 55, color: "#99f6ff", fontWeight: "bold", marginBottom: 15 }}>🕊️ 平和的利用</div>
          <div style={{ fontSize: 40, color: "white", lineHeight: 1.4 }}>軍事目的の使用を全面禁止</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "50px 40px", borderRadius: 30, border: "3px solid #99f6ff", opacity: spr(10), transform: `translateY(${(1-spr(10))*50}px)` }}>
          <div style={{ fontSize: 55, color: "#99f6ff", fontWeight: "bold", marginBottom: 15 }}>🧪 科学的調査の自由</div>
          <div style={{ fontSize: 40, color: "white", lineHeight: 1.4 }}>国際協力とデータの公開を推進</div>
        </div>
      </div>
    </div>
  );
};

// Slide 3: Prohibited
const Prohibited: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = (d: number) => spring({ frame, fps, delay: d, config: { damping: 200 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 80, width: "100%" }}>
      <div style={{ fontSize: 90, fontWeight: "bold", color: "#ff4d4d" }}>禁止事項</div>
      <div style={{ width: "90%", background: "rgba(255,255,255,0.05)", borderRadius: 30, padding: "20px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "white", fontSize: 45 }}>
          <tbody>
            {["軍事基地の設営", "核実験の実施", "放射性廃棄物の処分"].map((item, i) => (
              <tr key={item} style={{ borderBottom: i < 2 ? "2px solid rgba(255,255,255,0.1)" : "none", opacity: spr(i * 5) }}>
                <td style={{ padding: "40px 0 40px 40px", color: "#ff4d4d", fontSize: 60, width: 100 }}>❌</td>
                <td style={{ padding: "40px 40px 40px 20px", fontWeight: "bold" }}>{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: "rgba(255,77,77,0.15)", padding: "30px 60px", borderRadius: 20, border: "2px solid #ff4d4d", opacity: spr(20) }}>
        <div style={{ fontSize: 40, textAlign: "center", color: "#ff4d4d", fontWeight: "bold" }}>※領土権の主張を凍結</div>
      </div>
    </div>
  );
};

// Slide 4: Protection
const Protection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
       <div style={{ position: "relative", width: 400, height: 400 }}>
         {/* Simple Antarctica Circle */}
         <div style={{ position: "absolute", width: 400, height: 400, border: "8px solid #99f6ff", borderRadius: "50%", opacity: spr }} />
         <div style={{ position: "absolute", width: 300, height: 300, background: "white", borderRadius: "50%", left: 50, top: 50, opacity: spr * 0.8 }} />
         <div style={{ position: "absolute", fontSize: 100, width: "100%", textAlign: "center", top: 150, left: 0 }}>🌏</div>
       </div>
       <div style={{ textAlign: "center", opacity: spr }}>
         <div style={{ fontSize: 70, fontWeight: "bold", color: "white" }}>環境保護の拠点</div>
         <div style={{ fontSize: 40, color: "#99f6ff", marginTop: 20 }}>未来の科学と自然のために</div>
       </div>
    </div>
  );
};

export const CaptionedVideo: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("audio/story.json"));
      const data = await response.json();
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const { pages } = useMemo(() => {
    if (!captions) return { pages: [] };
    const pageData: { startMs: number; endMs: number }[] = [];
    let currentStartMs = 0;
    
    captions.forEach((cap, i) => {
      if (i === 0) currentStartMs = cap.startMs;
      
      const isPeriod = cap.text.includes("。");

      if (isPeriod || i === captions.length - 1) {
        // Prevent creating tiny pages or too many pages
        if (cap.endMs - currentStartMs > 3000 || i === captions.length - 1) {
          pageData.push({ startMs: currentStartMs, endMs: cap.endMs });
          currentStartMs = cap.endMs;
        }
      }
    });
    
    return { pages: pageData };
  }, [captions]);


  if (!captions || pages.length === 0) return null;

  return (
    <AbsoluteFill style={{ background: "#050a10" }}>
      <Audio src={staticFile("audio/story.mp3")} />
      {pages.map((page, index) => {
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = (page.endMs / 1000) * fps;
        const localFrame = frame - Math.round(startFrame);
        const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

        return (
          <Sequence key={index} from={Math.round(startFrame)} durationInFrames={Math.round(endFrame - startFrame) + 1}>
            <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", opacity }}>
               {index === 0 && <Timeline frame={localFrame} fps={fps} />}
               {index === 1 && <Purpose frame={localFrame} fps={fps} />}
               {index === 2 && <Prohibited frame={localFrame} fps={fps} />}
               {index === 3 && <Protection frame={localFrame} fps={fps} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};




