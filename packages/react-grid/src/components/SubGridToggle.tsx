import { useToggleSubGrid } from "#hooks/useToggleSubGrid.ts";

import type {
  GridCellLocation,
  GridDataReadonly,
  GridId,
} from "@jsoc/grid-core";

export type SubGridToggleProps = {
  /**
   * data of the sub grid, is actually the `ColumnValue` of the `GridRow[rowId][ColumnKey]`
   * using which the rows and columns will be generated.
   */
  subGridData: GridDataReadonly;
  /**
   * `GridId` of the grid that will render this button
   */
  parentGridId: GridId;
  /**
   * Location of the `GridCell` that will render this button
   */
  parentGridCellLocation: GridCellLocation;
};
export function SubGridToggle({
  subGridData,
  parentGridId,
  parentGridCellLocation,
}: SubGridToggleProps) {
  const { toggleText, toggleSubGrid } = useToggleSubGrid(
    subGridData,
    parentGridId,
    parentGridCellLocation,
  );

  return <button onClick={toggleSubGrid}>{toggleText}</button>;
}
