import { useToggleSubGrid } from "#grid/hooks/useToggleSubGrid.ts";
import {
  type GridId,
  type GridCellLocation,
  type GridDataReadonly,
} from "@jsoc/core/grid";
import { GridOn, GridOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

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
  const { isPresentInStore, toggleText, toggleSubGrid } = useToggleSubGrid(
    subGridData,
    parentGridId,
    parentGridCellLocation,
  );

  return (
    <IconButton
      title={toggleText}
      size="small"
      onClick={toggleSubGrid}
      sx={{
        "&:focus": {
          outline: "none",
        },
      }}
    >
      {isPresentInStore ? (
        <GridOff fontSize="small" />
      ) : (
        <GridOn fontSize="small" />
      )}
    </IconButton>
  );
}
