import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // https://vercel.com/docs/og-image-generation#usage
      allow: ["/", "/og/"],
    },
  };
}
