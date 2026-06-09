import type {
  ColumnGeneratorParams,
  GridRow,
  PluginConfig,
} from "@jsoc/grid-core";

export type ChildGridToggleOptions<C extends PluginConfig> = {
  row: GridRow;
  columnParams: ColumnGeneratorParams<C, "ujsonObject" | "ujsonObjectArray">;
};

/**
 * Creates a ChildGridToggle button element.
 */
export function ChildGridToggle<C extends PluginConfig>({
  row,
  columnParams,
}: ChildGridToggleOptions<C>): HTMLButtonElement {
  const { columnKey, gridSchema } = columnParams;
  const gridStore = gridSchema.store;
  const origin = gridStore.getChildSchemaOrigin(row, columnKey);
  const toggleStatus = gridStore.hasChildSchema(origin);
  const toggle = () => gridStore.toggleChildSchema(origin);

  return (
    <button type="button" onClick={toggle}>
      {toggleStatus ? "Close" : "View"}
    </button>
  ) as HTMLButtonElement;
}

/**
 * Alias for {@link ChildGridToggle}.
 */
export const createChildGridToggle = ChildGridToggle;
