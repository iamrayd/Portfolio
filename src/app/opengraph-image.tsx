import { ImageResponse } from "next/og";

import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(circle at 80% 20%, #2a0a0a, #07070a 60%)",
        color: "#ededed",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#ff2d2d" }}
      >
        <div style={{ width: 48, height: 2, background: "#ff2d2d" }} />
        PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
          {profile.firstName.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {profile.lastName.toUpperCase()}
          <span style={{ color: "#ff2d2d" }}>.</span>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#8b8b94" }}
      >
        <span>{profile.role}</span>
        <span>{profile.focus.join(" · ")}</span>
      </div>
    </div>,
    size,
  );
}
