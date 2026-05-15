import {
  createTable,
  type RowData,
  type Table,
  type TableOptions,
  type TableOptionsResolved,
} from "@tanstack/table-core";

/**
 * Vanilla equivalent of {@link useReactTable}: `createTable` alone treats
 * `options.state` as the **entire** `getState()` return value. An empty
 * `state: {}` therefore omits every feature slice (e.g. `columnPinning`),
 * which breaks `getHeaderGroups()` (`columnPinning.left` is undefined).
 *
 * React’s adapter merges `initialState` into `state` on every update; we do
 * the same once after construction for this static example.
 */
export function useTable<TData extends RowData>(
  options: TableOptions<TData>,
): Table<TData> {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  };

  const table = createTable<TData>(resolvedOptions);

  table.setOptions((prev) => ({
    ...prev,
    state: {
      ...table.initialState,
      ...prev.state,
    },
  }));

  return table;
}
