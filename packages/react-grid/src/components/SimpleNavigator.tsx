import { useGridStoreContext, useGridStoreSelector } from "#hooks/index.ts";

import type { ReactNode } from "react";

export type SimpleNavigatorRenderer = (params: {
  canRemove: boolean;
  removeActiveSchema: () => void;
}) => ReactNode;

export type SimpleNavigatorProps = {
  /**
   * Custom Renderer for the SimpleNavigator
   */
  children?: SimpleNavigatorRenderer;
};

export function SimpleNavigator({
  children: customRenderer,
}: SimpleNavigatorProps) {
  const gridStore = useGridStoreContext();
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
