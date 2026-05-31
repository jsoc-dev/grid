import type { GridStore, PluginConfig } from "@jsoc/grid-core";

/**
 * Creates a SimpleNavigator button element.
 */
export function SimpleNavigator<C extends PluginConfig>(
  gridStore: GridStore<C>,
): HTMLButtonElement {
  const totalChildSchemas = gridStore.getTotalChildSchemas();

  const canRemove = totalChildSchemas > 0;
  const removeActiveSchema = () => gridStore.removeChildSchema();

  return (
    <button type="button" disabled={!canRemove} onClick={removeActiveSchema}>
      {canRemove ? "Back" : "Root"}
    </button>
  ) as HTMLButtonElement;
}

/**
 * Alias for {@link SimpleNavigator}.
 */
export const createSimpleNavigator = SimpleNavigator;
