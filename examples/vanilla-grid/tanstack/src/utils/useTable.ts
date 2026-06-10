import {
  createTable,
  type RowData,
  type Table,
  type TableOptions,
  type TableOptionsResolved,
} from "@tanstack/table-core";
import { atom } from "nanostores";

/**
 * Creates a TanStack Table instance from given options.
 *
 * Copied from the official TanStack Table Vanilla example: {@link https://tanstack.com/table/latest/docs/framework/vanilla/examples/basic}
 */
export const useTable = <TData extends RowData>(
  options: TableOptions<TData>,
): Table<TData> => {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...options,
  };

  // Create a new table
  const table = createTable<TData>(resolvedOptions);

  // By default, manage table state here using the table's initial state
  const state = atom(table.initialState);

  // Subscribe to state changes
  state.subscribe((currentState) => {
    table.setOptions((prev) => ({
      ...prev,
      ...options,
      state: {
        ...currentState,
        ...options.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided state
      onStateChange: (updater) => {
        if (typeof updater === "function") {
          const newState = updater(currentState);
          state.set(newState);
        } else {
          state.set(updater);
        }
        options.onStateChange?.(updater);
      },
    }));
  });

  return table;
};
