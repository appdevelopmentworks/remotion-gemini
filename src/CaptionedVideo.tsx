import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";



// -------------------------------------------------------
// Slide components (7 slides for iceberg video)
// -------------------------------------------------------

// Slide 0: タイトル「氷山は90%が水中に隠れている」
const SlideTitle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = spring({ frame, fps, config: { damping: 200 } });
  const titleY = interpolate(spr, [0, 1], [60, 0]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 160,
        gap: 40,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0,40,80,0.85) 0%, rgba(0,80,140,0.85) 100%)",
          border: "3px solid rgba(100,220,255,0.6)",
          borderRadius: 32,
          padding: "50px 70px",
          opacity: spr,
          transform: `translateY(${titleY}px)`,
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: "900", color: "#fff", lineHeight: 1.35, marginBottom: 20 }}>
          🧊 水面上はわずか
        </div>
        <div
          style={{
            fontSize: 130,
            fontWeight: "900",
            color: "#4de8ff",
            lineHeight: 1,
            textShadow: "0 0 40px rgba(77,232,255,0.8)",
          }}
        >
          10%
        </div>
        <div style={{ fontSize: 50, color: "rgba(200,240,255,0.9)", marginTop: 10 }}>
          残り90%は海中に眠る
        </div>
      </div>
    </div>
  );
};

// Slide 1: カービング
const SlideCalving: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = (delay: number) => spring({ frame, fps, delay, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 140,
        gap: 30,
      }}
    >
      <div
        style={{
          opacity: spr(0),
          transform: `scale(${interpolate(spr(0), [0, 1], [0.85, 1])})`,
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(80,0,0,0.8) 0%, rgba(140,20,20,0.8) 100%)",
          border: "3px solid rgba(255,80,80,0.7)",
          borderRadius: 28,
          padding: "40px 60px",
          maxWidth: "90%",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 60, fontWeight: "900", color: "#ff6b6b", marginBottom: 12 }}>
          「カービング」
        </div>
        <div style={{ fontSize: 44, color: "#fff", lineHeight: 1.5 }}>
          突然バランスを崩して<br />転覆する現象
        </div>
      </div>
    </div>
  );
};

// Slide 2: 転覆の威力
const SlidePower: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = (delay: number) => spring({ frame, fps, delay, config: { damping: 200 } });
  const items = [
    { icon: "🌊", text: "巨大な波が発生" },
    { icon: "🚢", text: "船が一瞬で飲み込まれる" },
    { icon: "🧊", text: "氷塊が高速で飛散" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 120,
        gap: 28,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            opacity: spr(i * 8),
            transform: `translateX(${interpolate(spr(i * 8), [0, 1], [-80, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 30,
            background: "rgba(0,20,50,0.85)",
            border: "2px solid rgba(100,200,255,0.4)",
            borderRadius: 20,
            padding: "30px 50px",
            width: "88%",
          }}
        >
          <span style={{ fontSize: 64 }}>{item.icon}</span>
          <span style={{ fontSize: 50, color: "#e0f4ff", fontWeight: "700" }}>{item.text}</span>
        </div>
      ))}
    </div>
  );
};

// Slide 3: 水中の隠れた危険
const SlideHidden: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 130,
      }}
    >
      <div
        style={{
          opacity: spr,
          transform: `translateY(${interpolate(spr, [0, 1], [50, 0])}px)`,
          textAlign: "center",
          background: "linear-gradient(160deg, rgba(0,30,70,0.9) 0%, rgba(0,60,120,0.9) 100%)",
          border: "3px solid rgba(77,232,255,0.5)",
          borderRadius: 28,
          padding: "50px 60px",
          width: "88%",
        }}
      >
        <div style={{ fontSize: 70, marginBottom: 20 }}>🔱</div>
        <div style={{ fontSize: 52, fontWeight: "900", color: "#4de8ff", marginBottom: 18 }}>
          水中に潜む鋭い氷
        </div>
        <div style={{ fontSize: 42, color: "#cceeff", lineHeight: 1.6 }}>
          目には見えない突起が<br />船体を即座に貫通する
        </div>
      </div>
    </div>
  );
};

// Slide 4: タイタニック
const SlideTitanic: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 130,
      }}
    >
      <div
        style={{
          opacity: spr,
          transform: `scale(${interpolate(spr, [0, 1], [0.88, 1])})`,
          textAlign: "center",
          background: "rgba(10,0,30,0.88)",
          border: "3px solid rgba(255,180,0,0.6)",
          borderRadius: 28,
          padding: "50px 60px",
          width: "88%",
        }}
      >
        <div style={{ fontSize: 70, marginBottom: 20 }}>🚢</div>
        <div style={{ fontSize: 60, fontWeight: "900", color: "#ffd700", marginBottom: 16 }}>
          タイタニック号
        </div>
        <div style={{ fontSize: 42, color: "#ffe8a0", lineHeight: 1.6 }}>
          氷山の「見えない部分」に<br />衝突して沈没
        </div>
        <div
          style={{
            marginTop: 28,
            background: "rgba(255,200,0,0.15)",
            borderRadius: 16,
            padding: "18px 30px",
            fontSize: 38,
            color: "#ffc",
          }}
        >
          1912年の歴史的惨事
        </div>
      </div>
    </div>
  );
};

// Slide 5: 専門家の警告
const SlideWarning: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = (delay: number) => spring({ frame, fps, delay, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 120,
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: spr(0),
          textAlign: "center",
          background: "rgba(80,0,0,0.85)",
          border: "3px solid #ff4444",
          borderRadius: 24,
          padding: "36px 56px",
          width: "88%",
        }}
      >
        <div style={{ fontSize: 68, marginBottom: 16 }}>🚨</div>
        <div style={{ fontSize: 56, fontWeight: "900", color: "#ff6666", marginBottom: 12 }}>
          専門家の厳重警告
        </div>
        <div style={{ fontSize: 42, color: "#ffcccc", lineHeight: 1.6 }}>
          南極観光でも必ず<br />「安全距離」を保つこと
        </div>
      </div>
    </div>
  );
};

// Slide 6: まとめ
const SlideSummary: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const spr = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        paddingBottom: 130,
      }}
    >
      <div
        style={{
          opacity: spr,
          transform: `translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
          textAlign: "center",
          background: "linear-gradient(160deg, rgba(0,50,40,0.9) 0%, rgba(0,100,80,0.9) 100%)",
          border: "3px solid rgba(0,255,180,0.5)",
          borderRadius: 28,
          padding: "50px 60px",
          width: "88%",
        }}
      >
        <div style={{ fontSize: 70, marginBottom: 20 }}>🌊✨</div>
        <div style={{ fontSize: 52, fontWeight: "900", color: "#00ffba", marginBottom: 20 }}>
          美しさと危険は表裏一体
        </div>
        <div style={{ fontSize: 42, color: "#ccfff0", lineHeight: 1.7 }}>
          氷山は遠くから<br />眺めるのが最善
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------
// Slide mapping: index → component + image
// -------------------------------------------------------
const SLIDES = [
  { Component: SlideTitle, imageIndex: 1 },
  { Component: SlideCalving, imageIndex: 2 },
  { Component: SlidePower, imageIndex: 2 },
  { Component: SlideHidden, imageIndex: 1 },
  { Component: SlideTitanic, imageIndex: 3 },
  { Component: SlideWarning, imageIndex: 4 },
  { Component: SlideSummary, imageIndex: 5 },
];


// -------------------------------------------------------
// Main component (固定タイミング・テロップなし)
// -------------------------------------------------------

// 総尺（frames）と1スライドあたりの尺を定数で管理
// Root.tsx の durationInFrames に合わせて更新すること
const TOTAL_DURATION_FRAMES = 1496; // 春日部つむぎの音声に基づき更新 (48.85s * 30 + 30)
const SLIDE_DURATION = Math.floor(TOTAL_DURATION_FRAMES / SLIDES.length);

export const CaptionedVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#020d1a" }}>
      <Audio src={staticFile("audio/story.mp3")} />

      {SLIDES.map(({ Component, imageIndex }, index) => {
        const startFrame = index * SLIDE_DURATION;
        // 最後のスライドは残り全フレームを使う
        const durationFrames =
          index === SLIDES.length - 1
            ? TOTAL_DURATION_FRAMES - startFrame
            : SLIDE_DURATION;
        const localFrame = frame - startFrame;
        const opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
            <AbsoluteFill style={{ opacity }}>
              {/* 背景画像 */}
              <AbsoluteFill>
                <Img
                  src={staticFile(`images/${imageIndex}.png`)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* 暗めのオーバーレイ */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(2,10,25,0.45) 0%, rgba(2,10,25,0.70) 60%, rgba(2,10,25,0.88) 100%)",
                  }}
                />
              </AbsoluteFill>

              {/* タイトルバー */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 50px 30px",
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
                  fontSize: 36,
                  color: "rgba(150,220,255,0.9)",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🧊 南極で氷山に近づいてはいけない理由
              </div>

              {/* スライドコンテンツ */}
              <AbsoluteFill>
                <Component frame={localFrame} fps={fps} />
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
