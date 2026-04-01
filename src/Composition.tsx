import { AbsoluteFill } from "remotion";

export const MyComposition = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #07111f 0%, #0d2037 55%, #132a45 100%)",
        color: "#f6fbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 780,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(214, 235, 255, 0.72)",
          }}
        >
          Remotion Template
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          Local video source files belong in `src/private/`
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.6,
            color: "rgba(235, 245, 255, 0.88)",
          }}
        >
          Files in that folder stay on your machine and are not pushed to Git.
        </div>
      </div>
    </AbsoluteFill>
  );
};
