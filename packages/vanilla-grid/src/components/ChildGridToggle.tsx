import {
  BaseGridSchema,
  type ColumnGeneratorParams,
  type GridRow,
} from "@jsoc/grid-core";

export type ChildGridToggleOptions = {
  row: GridRow;
  columnParams: ColumnGeneratorParams<"ujsonObject" | "ujsonObjectArray">;
};

/**
 * Creates a ChildGridToggle button element.
 */
export function ChildGridToggle({
  row,
  columnParams,
}: ChildGridToggleOptions): HTMLButtonElement {
  const { columnKey, gridSchema } = columnParams;
  BaseGridSchema.assertInstance(gridSchema);
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
