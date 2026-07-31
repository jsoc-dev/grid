// keep this server-only so a client import fails at build time instead of pulling the large JSON artifact into the client bundle at runtime
import "server-only";

import EXAMPLE_MANIFESTS from "@/artifacts/generated/example-manifests.json";
import { resolvePackageName } from "@/utils/api/api-packages";
import {
  type AdapterId,
  type ExampleSourceManifest,
  type PluginId,
} from "@jsoc/grid-docs";

export function getExampleManifest<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
): ExampleSourceManifest {
  const manifest = EXAMPLE_MANIFESTS[resolvePackageName(adapterId, pluginId)];

  if (!manifest) {
    throw new Error(
      `Example source manifest not found for "${resolvePackageName(adapterId, pluginId)}". Run "pnpm generate-artifacts" after building examples.`,
    );
  }

  return manifest;
}
