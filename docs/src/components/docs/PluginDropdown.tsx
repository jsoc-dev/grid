"use client";

import { useRootContext } from "@/contexts/RootContext";
import {
  getPluginIds,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";

const FRAMEWORK_ID = "react-grid" as const;

export function PluginDropdown() {
  const { selectedPluginId, setSelectedPluginId } = useRootContext();

  return (
    <select
      value={selectedPluginId}
      onChange={(e) =>
        setSelectedPluginId(e.target.value as PluginId<typeof FRAMEWORK_ID>)
      }
    >
      {getPluginIds(FRAMEWORK_ID).map((pluginId) => (
        <option key={pluginId} value={pluginId}>
          {getPluginMetadata(FRAMEWORK_ID, pluginId).name}
        </option>
      ))}
    </select>
  );
}
