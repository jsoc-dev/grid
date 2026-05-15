import { useGridStoreContext } from "#hooks/useGridStoreContext.ts";
import { useGridStoreSelector } from "#hooks/useGridStoreSelector.ts";

import type { ColumnKey, GridRow } from "@jsoc/grid-core";
import type { ReactNode } from "react";

export type ChildGridToggleRenderer = (
  toggle: () => void,
  toggleStatus: boolean,
) => ReactNode;

export type ChildGridToggleProps = {
  /**
   * Custom renderer for the toggle action.
   * Defaults to {@link DefaultRenderer}.
   */
  children?: ChildGridToggleRenderer;
  /**
   * `ColumnKey` of the column that renders this component.
   */
  columnKey: ColumnKey;
  /**
   * The GridRow that contains the cell in which this component will be rendered.
   */
  row: GridRow;
};

export function ChildGridToggle({
  children: renderer = DefaultRenderer,
  columnKey,
  row,
}: ChildGridToggleProps) {
  const gridStore = useGridStoreContext();
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
