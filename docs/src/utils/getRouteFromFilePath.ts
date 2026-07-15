import { CONTENT_DIR_BASE_PATH } from "@/config";

const APP_DIR_RE = /^(?:src\/)?app\//;
const CONTENT_DIR_RE = /^(?:src\/)?content\//;

/**
 * Derives the Nextra page-map route from `metadata.filePath`.
 *
 * Supports both content-directory MDX (`src/content/...`) and app-router pages
 * (`src/app/.../page.mdx`).
 */
export function getRouteFromFilePath(
  filePath: string,
  basePath = CONTENT_DIR_BASE_PATH,
): string {
  if (APP_DIR_RE.test(filePath)) {
    const route =
      filePath.replace(/^(?:src\/)?app/, "").replace(/\/page\.mdx?$/, "") ||
      "/";

    return route;
  }

  if (CONTENT_DIR_RE.test(filePath)) {
    const routePath = filePath
      .replace(CONTENT_DIR_RE, "")
      .replace(/\.mdx?$/, "")
      .replace(/\/index$/, "");

    return [basePath, routePath].filter(Boolean).join("/");
  }

  throw new Error(
    `Cannot derive route from filePath "${filePath}". Expected a content or app directory path.`,
  );
}
