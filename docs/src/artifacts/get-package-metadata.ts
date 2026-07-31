import type { PackageMetadata } from "@/artifacts/artifacts-types";
import PACKAGE_METADATA from "@/artifacts/generated/package-metadata.json";
import { resolvePackageName } from "@/utils/api/api-packages";

import type { AdapterId, PluginId } from "@jsoc/grid-docs";

export function getPackageMetadata<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId?: P,
): PackageMetadata {
  const packageName = pluginId
    ? resolvePackageName(adapterId, pluginId)
    : resolvePackageName(adapterId);
  const metadata = PACKAGE_METADATA[packageName];

  if (!metadata) {
    throw new Error(
      `Package metadata not found for "${packageName}". Run "pnpm generate-artifacts".`,
    );
  }

  return metadata;
}
