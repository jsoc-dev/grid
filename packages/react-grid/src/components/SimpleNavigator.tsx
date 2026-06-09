import { useGridStoreSelector } from "#hooks/useGridStoreSelector.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import type { ReactNode } from "react";

export type SimpleNavigatorRenderer = (params: {
  canRemove: boolean;
  removeActiveSchema: () => void;
}) => ReactNode;

export type SimpleNavigatorProps<C extends PluginConfig = PluginConfig> = {
  gridStore: GridStore<C>;
  /**
   * Custom Renderer for the SimpleNavigator
   */
  children?: SimpleNavigatorRenderer;
};

export function SimpleNavigator<C extends PluginConfig = PluginConfig>({
  gridStore,
  children: customRenderer,
}: SimpleNavigatorProps<C>) {
  const totalChildSchemas = useGridStoreSelector(gridStore, (store) =>
    store.getTotalChildSchemas(),
  );

  const canRemove = totalChildSchemas > 0;
  const removeActiveSchema = () => gridStore.removeChildSchema();

  if (customRenderer) {
    return customRenderer({ canRemove, removeActiveSchema });
  }

  return (
    <button disabled={!canRemove} onClick={removeActiveSchema}>
      {canRemove ? "Back" : "Root"}
    </button>
  );
}
