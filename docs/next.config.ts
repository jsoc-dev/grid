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
  },

  // mirror turbopack configs for webpack, so that next dev --webpack works too
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
});
