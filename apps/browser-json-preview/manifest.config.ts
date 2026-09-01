import pkg from "#package.json" with { type: "json" };

import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "JSON Preview",
  version: pkg.version,
  description: "Preview JSON documents as a table in the browser",
  action: {
    default_title: "JSON Preview",
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
