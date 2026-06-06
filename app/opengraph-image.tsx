import { ImageResponse } from "next/og";

// Default Open Graph / social-share image, applied site-wide. Generated as a
// branded card — swap for a designed image later by replacing this file with a
// static opengraph-image.png if preferred.

export const alt =
  "ABS Educational Solution — D.Pharm, Nursing & Paramedical Admissions, Mumbai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d7c84, #0a5f66)",
          color: "white",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "44px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "96px",
              height: "96px",
              borderRadius: "20px",
              background: "white",
              color: "#0d7c84",
              fontSize: "44px",
              fontWeight: 800,
            }}
          >
            ABS
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700 }}>ABS Educational Solution</div>
        </div>
        <div style={{ fontSize: "62px", fontWeight: 800, lineHeight: 1.1 }}>
          D.Pharm, Nursing & Paramedical Admissions
        </div>
        <div style={{ fontSize: "40px", marginTop: "24px", opacity: 0.9 }}>
          Mumbai · Since 2009 · 6 Branches
        </div>
        <div style={{ fontSize: "30px", marginTop: "44px", opacity: 0.85 }}>
          Free admission counselling · abscareer.com
        </div>
      </div>
    ),
    { ...size },
  );
}
