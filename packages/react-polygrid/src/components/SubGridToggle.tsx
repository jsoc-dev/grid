import { useToggleSubGrid } from "@jsoc/react-grid";
import {
  type GridId,
  type GridCellLocation,
  type GridDataReadonly,
} from "@jsoc/grid-core";
import { GridOn, GridOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export type SubGridToggleProps = {
  subGridData: GridDataReadonly;
  parentGridId: GridId;
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
