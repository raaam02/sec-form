import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Formu.AI - Premium AI-Powered Form Builder";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 75%, rgba(147, 51, 234, 0.25) 0%, transparent 50%)",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top header badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Logo Icon Mock */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 35px rgba(99, 102, 241, 0.5)",
            }}
          >
            <span
              style={{
                fontSize: "30px",
                fontWeight: "900",
                color: "#ffffff",
              }}
            >
              F
            </span>
          </div>

          <span
            style={{
              fontSize: "34px",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Formu<span style={{ color: "#818cf8" }}>.AI</span>
          </span>

          <div
            style={{
              marginLeft: "16px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(129, 140, 248, 0.3)",
              color: "#a5b4fc",
              fontSize: "16px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Powered by Google Gemini
          </div>
        </div>

        {/* Center / Hero Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              background: "linear-gradient(180deg, #ffffff 30%, #cbd5e1 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Build, Customize & Analyze Forms with Next-Gen AI
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: "400",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            Generate smart questionnaires in seconds. Customize themes live, embed
            anywhere with one script, and uncover automated sentiment insights.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "32px",
          }}
        >
          {[
            "Instant AI Generation",
            "Full Color & Theme Studio",
            "1-Click Embed Anywhere",
            "Sentiment Analysis",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "17px",
                fontWeight: "600",
                color: "#e2e8f0",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#34d399",
                  boxShadow: "0 0 10px #34d399",
                }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
