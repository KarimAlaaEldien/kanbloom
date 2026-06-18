import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Soft circular badge background */}
        <div
          style={{
            position: "absolute",
            width: "32px",
            height: "32px",
            borderRadius: "16px",
            background: "rgba(34, 197, 94, 0.15)",
          }}
        />
        {/* Inline SVG rendering simplified petals */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: "22px", height: "22px" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Petal */}
          <path
            d="M20,40 C20,30 30,20 40,20 L50,20 L50,50 L20,50 Z"
            fill="#22C55E"
            opacity="0.9"
            transform="rotate(-20 50 50)"
          />
          {/* Right Petal */}
          <path
            d="M50,20 L60,20 C70,20 80,30 80,40 L80,50 L50,50 Z"
            fill="#F472B6"
            opacity="0.9"
            transform="rotate(20 50 50)"
          />
          {/* Center Petal */}
          <path
            d="M35,25 L65,25 L65,55 L35,55 Z"
            fill="#22C55E"
            opacity="0.95"
          />
          {/* Bud Center */}
          <circle cx="50" cy="48" r="8" fill="#F472B6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
