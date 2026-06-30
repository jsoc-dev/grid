import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  getExamplesRelativePath,
  EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
  type AdapterId,
  type PluginId,
  type ExampleSourceManifest,
} from "@jsoc/grid-docs";

export const getCachedExampleManifest = cache(
  <A extends AdapterId, P extends PluginId<A>>(adapterId: A, pluginId: P) => {
    const manifestPath = path.join(
      process.cwd(),
      "public",
      getExamplesRelativePath(adapterId, pluginId),
      EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
    );

    if (!fs.existsSync(manifestPath)) {
      throw new Error("Example source manifest file not found");
    }

    return JSON.parse(
      fs.readFileSync(manifestPath, "utf-8"),
    ) as ExampleSourceManifest;
  },
);
