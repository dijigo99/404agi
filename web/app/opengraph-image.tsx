import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "404AGI — AGI not found. Cope deployed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "monospace",
          color: "#f5f5f5",
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,255,65,0.04) 100%), repeating-linear-gradient(to bottom, rgba(0,255,65,0.05) 0, rgba(0,255,65,0.05) 1px, transparent 1px, transparent 4px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: "#888",
              textTransform: "uppercase",
            }}
          >
            {"// 404agi.fun"}
          </span>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontSize: 160, fontWeight: 800, color: "#00ff41" }}>
              404
            </span>
            <span style={{ fontSize: 160, fontWeight: 800, color: "#f5f5f5" }}>
              AGI
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span
            style={{ fontSize: 56, fontWeight: 700, color: "#f5f5f5" }}
          >
            AGI not found. Cope deployed.
          </span>
          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 22,
              color: "#888",
              borderTop: "1px solid #222",
              paddingTop: 20,
            }}
          >
            <span style={{ color: "#00ff41" }}>$404</span>
            <span>solana</span>
            <span>deprecated. not deleted.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
