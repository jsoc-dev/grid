import type {
  GridCellLocation,
  GridDataReadonly,
  GridId,
} from "@jsoc/grid-core";
import { useToggleSubGrid } from "@jsoc/react-grid";
import { GridOff, GridOn } from "@mui/icons-material";
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
