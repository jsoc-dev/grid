import { CONTENT_DIR_BASE_PATH } from "@/constants/docs";
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
});
