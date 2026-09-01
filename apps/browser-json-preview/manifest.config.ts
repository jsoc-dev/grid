import pkg from "#package.json" with { type: "json" };

import { defineManifest } from "@crxjs/vite-plugin";

const icons = {
  16: "icons/icon-16.png",
  32: "icons/icon-32.png",
  48: "icons/icon-48.png",
  128: "icons/icon-128.png",
};

export default defineManifest({
  manifest_version: 3,
  name: "JSON Preview",
  version: pkg.version,
  description: "Preview JSON documents as a table in the browser",
  icons,
  action: {
    default_title: "JSON Preview",
    default_icon: icons,
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      css: ["src/content.css"],
      js: ["src/content.tsx"],
      run_at: "document_start",
    },
  ],
});
