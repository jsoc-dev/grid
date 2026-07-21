import { CONTENT_DIR_BASE_PATH } from "@/config";
import nextra from "nextra";

const withNextra = nextra({
  contentDirBasePath: CONTENT_DIR_BASE_PATH,
  defaultShowCopyCode: true,
});

export default withNextra({
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "next-mdx-import-source-file": "./src/mdx-components.tsx",
    },
  },

  // mirror turbopack configs for webpack, so that next dev --webpack works too
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Suppress missing module warnings from ts-morph's internal typescript compiler
      "source-map-support": false,
    };

    return config;
  },
});
