import type { PluginMetadataValue } from "@jsoc/grid-docs";
import { isPlainObject } from "@jsoc/utils";

export function formatValue(rawValue: PluginMetadataValue) {
  // stringify objects (e.g. plugin.exampleMetadataMap)
  if (isPlainObject(rawValue)) {
    return JSON.stringify(rawValue, null, 2);
  }

  // joining array values (e.g. plugin.peerDeps)
  if (Array.isArray(rawValue)) {
    return rawValue.join(", ");
  }

  return rawValue;
}
