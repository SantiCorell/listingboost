import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const runtime = "edge";

export const alt = `${APP_NAME} — optimización de fichas con IA y SEO para marketplaces`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1033 0%, #4c1d95 45%, #5b21b6 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: 32,
            background: "linear-gradient(145deg, #7c3aed, #4f46e5)",
            boxShadow: "0 24px 80px rgba(124, 58, 237, 0.45)",
            marginBottom: 36,
          }}
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              fill="#faf5ff"
              d="M13 2 4 14h6l-2 8 9-12h-6l1-8z"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#faf5ff",
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span>Listing</span>
          <span style={{ color: "#c4b5fd" }}>Boost</span>
        </div>
        <p
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "rgba(233, 213, 255, 0.92)",
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          IA para fichas Wallapop, eBay y Shopify · hashtags · auditoría SEO de URL
        </p>
      </div>
    ),
    { ...size },
  );
}
