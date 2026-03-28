import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  Series,
  staticFile,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { z } from "zod";
import { Input, ALL_FORMATS, UrlSource } from "mediabunny";

const FPS = 30;

// タイトルスライドのスタイル
const TitleSlide: React.FC<{
  text: string;
  color?: string;
  emoji?: string;
  subtext?: string;
  showCat?: boolean;
}> = ({
  text,
  color = "#ffffff",
  emoji,
  subtext,
  showCat = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // フェードイン（15フレーム）
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // フェードアウト（最後の15フレーム）
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      easing: Easing.in(Easing.ease),
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // スケールアニメーション（少し拡大しながら登場）
  const scale = interpolate(frame, [0, 20], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  // ネコのふわふわ浮遊アニメーション
  const catFloat = Math.sin((frame / FPS) * Math.PI * 1.2) * 12;
  // ネコの登場アニメーション（下からスライドイン）
  const catSlideIn = interpolate(frame, [0, 20], [120, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  // 絵文字のバウンスアニメーション
  const emojiBounce = interpolate(frame, [0, 8, 16], [0, -18, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 40%, #0d2060 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 背景の装飾グロー */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(100,120,255,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ネコ画像（右下に配置）mix-blend-mode: multiplyで白背景を消す */}
      {showCat && (
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: catFloat + catSlideIn - 10,
            opacity: opacity * 0.95,
            transition: "none",
          }}
        >
          <Img
            src={staticFile("images/cutcatsc.png")}
            style={{
              width: 280,
              height: 280,
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {/* メインコンテンツ（絵文字＋テキスト） */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          padding: "0 80px",
          paddingRight: showCat ? 200 : 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* 絵文字 */}
        {emoji && (
          <div
            style={{
              fontSize: 80,
              transform: `translateY(${emojiBounce}px)`,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>
        )}

        {/* メインタイトル */}
        <div
          style={{
            fontFamily:
              '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif',
            fontSize: 68,
            fontWeight: 900,
            color,
            textShadow: `0 0 40px rgba(150,170,255,0.8), 0 4px 20px rgba(0,0,0,0.8)`,
            lineHeight: 1.3,
            letterSpacing: "0.02em",
          }}
        >
          {text}
        </div>

        {/* サブテキスト */}
        {subtext && (
          <div
            style={{
              fontFamily:
                '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif',
              fontSize: 32,
              fontWeight: 400,
              color: "rgba(200,210,255,0.75)",
              letterSpacing: "0.05em",
            }}
          >
            {subtext}
          </div>
        )}
      </div>

      {/* 下部のラインアクセント */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: 200,
          height: 3,
          background: "linear-gradient(90deg, transparent, #6678ff, transparent)",
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ビデオアイテムのスキーマ
const videoItemSchema = z.object({
  src: z.string(),
  durationInFrames: z.number(),
});

// ソラバイの動画構成スキーマ
const soraByeSchema = z.object({
  videoFiles: z.array(videoItemSchema),
});

type SoraByeProps = z.infer<typeof soraByeSchema>;

// 実際の動画ファイルリスト（タイトルスライドはコンポーネント内で処理）
const VIDEO_SOURCES = [
  "videos/sora2Free.mp4",
  "videos/sora2standerd.mp4",
  "videos/sora2Pro.mp4",
  "videos/sora2Free2.mp4",
  "videos/LBCMTITLE.mp4",
];

// タイトルスライドの定義（フレーム数固定）
const TITLE_SLIDES = [
  {
    text: "サヨナラSoraお別れ動画",
    durationInFrames: 3 * FPS,
    color: "#e0e8ff",
    emoji: "🎬",
    subtext: "Goodbye, Sora...",
  },
  {
    text: "感謝を込めて！",
    durationInFrames: 2 * FPS,
    color: "#ffd700",
    emoji: "🙏",
    subtext: "Thank you, Sora!",
  },
  {
    text: "Sora2無料版",
    durationInFrames: 3 * FPS,
    color: "#88ccff",
    emoji: "🆓",
    subtext: "Free Plan",
  },
  {
    text: "Sora2スタンダード",
    durationInFrames: 3 * FPS,
    color: "#aaffaa",
    emoji: "⭐",
    subtext: "Standard Plan",
  },
  {
    text: "Sora2 Pro",
    durationInFrames: 3 * FPS,
    color: "#ffaa44",
    emoji: "👑",
    subtext: "Pro Plan",
  },
  {
    text: "Sora2無料版で\n十分だったかも",
    durationInFrames: 3 * FPS,
    color: "#ff9999",
    emoji: "😅",
    subtext: "Maybe Free was enough...",
  },
];

const TITLE_DURATION = TITLE_SLIDES.reduce(
  (sum, s) => sum + s.durationInFrames,
  0
);

export const soraByeCalculateMetadata: CalculateMetadataFunction<
  SoraByeProps
> = async ({ props }) => {
  const videoFiles = await Promise.all(
    VIDEO_SOURCES.map(async (src) => {
      const url = staticFile(src);
      const input = new Input({
        formats: ALL_FORMATS,
        source: new UrlSource(url, { getRetryDelay: () => null }),
      });
      const durationInSeconds = await input.computeDuration();
      return { src, durationInFrames: Math.round(durationInSeconds * FPS) };
    })
  );

  const videoDuration = videoFiles.reduce(
    (sum, v) => sum + v.durationInFrames,
    0
  );
  const totalDurationInFrames = TITLE_DURATION + videoDuration;

  return {
    durationInFrames: totalDurationInFrames,
    props: { ...props, videoFiles },
  };
};

export const SoraBye: React.FC<SoraByeProps> = ({ videoFiles }) => {
  // videoFiles の順番は VIDEO_SOURCES と同じ:
  // [0] sora2Free.mp4
  // [1] sora2standerd.mp4
  // [2] sora2Pro.mp4
  // [3] sora2Free2.mp4
  // [4] LBCMTITLE.mp4

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {/* 1. サヨナラSoraお別れ動画（3秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[0].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[0].text}
            color={TITLE_SLIDES[0].color}
            emoji={TITLE_SLIDES[0].emoji}
            subtext={TITLE_SLIDES[0].subtext}
          />
        </Series.Sequence>

        {/* 2. 感謝を込めて！（2秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[1].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[1].text}
            color={TITLE_SLIDES[1].color}
            emoji={TITLE_SLIDES[1].emoji}
            subtext={TITLE_SLIDES[1].subtext}
          />
        </Series.Sequence>

        {/* 3. Sora2無料版 タイトル（3秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[2].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[2].text}
            color={TITLE_SLIDES[2].color}
            emoji={TITLE_SLIDES[2].emoji}
            subtext={TITLE_SLIDES[2].subtext}
          />
        </Series.Sequence>

        {/* 4. sora2Free.mp4 */}
        <Series.Sequence durationInFrames={videoFiles[0]?.durationInFrames ?? 1}>
          <Video
            src={staticFile(videoFiles[0]?.src ?? "")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Series.Sequence>

        {/* 5. Sora2スタンダード タイトル（3秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[3].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[3].text}
            color={TITLE_SLIDES[3].color}
            emoji={TITLE_SLIDES[3].emoji}
            subtext={TITLE_SLIDES[3].subtext}
          />
        </Series.Sequence>

        {/* 6. sora2standerd.mp4 */}
        <Series.Sequence durationInFrames={videoFiles[1]?.durationInFrames ?? 1}>
          <Video
            src={staticFile(videoFiles[1]?.src ?? "")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Series.Sequence>

        {/* 7. Sora2 Pro タイトル（3秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[4].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[4].text}
            color={TITLE_SLIDES[4].color}
            emoji={TITLE_SLIDES[4].emoji}
            subtext={TITLE_SLIDES[4].subtext}
          />
        </Series.Sequence>

        {/* 8. sora2Pro.mp4 */}
        <Series.Sequence durationInFrames={videoFiles[2]?.durationInFrames ?? 1}>
          <Video
            src={staticFile(videoFiles[2]?.src ?? "")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Series.Sequence>

        {/* 9. Sora2無料版で十分だったかも タイトル（3秒） */}
        <Series.Sequence durationInFrames={TITLE_SLIDES[5].durationInFrames}>
          <TitleSlide
            text={TITLE_SLIDES[5].text}
            color={TITLE_SLIDES[5].color}
            emoji={TITLE_SLIDES[5].emoji}
            subtext={TITLE_SLIDES[5].subtext}
          />
        </Series.Sequence>

        {/* 10. sora2Free2.mp4 */}
        <Series.Sequence durationInFrames={videoFiles[3]?.durationInFrames ?? 1}>
          <Video
            src={staticFile(videoFiles[3]?.src ?? "")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Series.Sequence>

        {/* 11. LBCMTITLE.mp4 */}
        <Series.Sequence durationInFrames={videoFiles[4]?.durationInFrames ?? 1}>
          <Video
            src={staticFile(videoFiles[4]?.src ?? "")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const soraByeDefaultProps: SoraByeProps = {
  videoFiles: VIDEO_SOURCES.map((src) => ({ src, durationInFrames: 0 })),
};
