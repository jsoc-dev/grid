import type { GridIndex } from "@jsoc/grid-core";
import { useNavigation } from "@jsoc/react-grid";
import { toPascalCase } from "@jsoc/utils";
import { Chip, Tooltip } from "@mui/material";

export type NavigatorItemProps = {
  index: GridIndex;
};

export function NavigatorItem({ index }: NavigatorItemProps) {
  const { gridSchema, gridStore, activateGrid, removeGrid } =
    useNavigation(index);
  const { options } = gridSchema;
  const { id, name } = options;
  const isActiveGrid = gridStore.isActiveSchema(gridSchema);
  const label = toPascalCase(name || id);

  return (
    <>
      <Tooltip title={label}>
        <Chip
          label={label}
          // size='small'
          // variant={isActiveGrid ? 'filled' : 'outlined'}
          color={isActiveGrid ? "primary" : "default"}
          clickable={!isActiveGrid}
          aria-pressed={isActiveGrid}
          onClick={activateGrid}
          onDelete={removeGrid}
          sx={{ maxWidth: 120 }}
        />
      </Tooltip>
    </>
  );
}
