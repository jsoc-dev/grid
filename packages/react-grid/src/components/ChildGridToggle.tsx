import { useGridStoreSelector } from "#hooks/useGridStoreSelector.ts";

import type {
  ColumnGeneratorParams,
  GridRow,
  PluginConfig,
} from "@jsoc/grid-core";
import type { ReactNode } from "react";

export type ChildGridToggleRenderer = (
  toggle: () => void,
  toggleStatus: boolean,
) => ReactNode;

export type ChildGridToggleProps<C extends PluginConfig> = {
  /**
   * Custom renderer for the toggle action.
   * Defaults to {@link DefaultRenderer}.
   */
  children?: ChildGridToggleRenderer;
  /**
   * The GridRow that contains the cell in which this component will be rendered.
   */
  row: GridRow;
  columnParams: ColumnGeneratorParams<C, "ujsonObject" | "ujsonObjectArray">;
};

export function ChildGridToggle<C extends PluginConfig>({
  children: renderer = DefaultRenderer,
  row,
  columnParams,
}: ChildGridToggleProps<C>) {
  const { columnKey, gridSchema } = columnParams;
  const gridStore = gridSchema.store;
  const origin = gridStore.getChildSchemaOrigin(row, columnKey);
  const toggleStatus = useGridStoreSelector(gridStore, (store) =>
    store.hasChildSchema(origin),
  );
  const toggle = () => gridStore.toggleChildSchema(origin);

  return renderer(toggle, toggleStatus);
}

const DefaultRenderer: ChildGridToggleRenderer = (toggle, toggleStatus) => {
  return <button onClick={toggle}>{toggleStatus ? "Close" : "View"}</button>;
};
