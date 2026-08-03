import { SITE_DESCRIPTION, SITE_NAME } from "@/config";
import { ImageResponse } from "next/og";

// https://vercel.com/docs/og-image-generation#runtime-support
export const runtime = "edge";

// https://vercel.com/docs/og-image-generation#technical-details
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 160;

// https://vercel.com/docs/og-image-generation/examples#custom-font
async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+)\) format\('(?:opentype|truetype)'\)/);

  if (!match?.[1]) {
    throw new Error(`Failed to load font data for ${font}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // https://vercel.com/docs/og-image-generation/examples#dynamic-title
  const title = truncate(
    searchParams.get("title") ?? SITE_NAME,
    TITLE_MAX_LENGTH,
  );
  const description = truncate(
    searchParams.get("description") ?? SITE_DESCRIPTION,
    DESCRIPTION_MAX_LENGTH,
  );

  const [fontRegular, fontBold] = await Promise.all([
    loadGoogleFont("Inter", 400),
    loadGoogleFont("Inter", 700),
  ]);

  // https://vercel.com/docs/og-image-generation?framework=nextjs-app#getting-started
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle at center, rgba(16,185,129,0.35) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#34d399",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "9999px",
              backgroundColor: "#10b981",
            }}
          />
          {SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              color: "#d4d4d4",
            }}
          >
            {description}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          fontSize: 24,
          color: "#a3a3a3",
        }}
      >
        <span>jsoc-grid.vercel.app</span>
        <span>JSON Structure Oriented Components</span>
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    },
  );
}
