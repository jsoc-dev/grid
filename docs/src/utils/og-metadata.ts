import { SITE_DESCRIPTION, SITE_NAME } from "@/config";
import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description?: string;
};

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
}: PageMetadataOptions): Metadata {
  const ogImagePath = getOgImagePath({ title, description });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
      // https://vercel.com/docs/og-image-generation#consume-the-og-route
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImagePath],
    },
  };
}

function getOgImagePath({ title, description }: PageMetadataOptions): string {
  const params = new URLSearchParams({ title });

  if (description) params.set("description", description);

  return `/og?${params.toString()}`;
}
