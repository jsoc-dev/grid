import type { GridIndex } from "@jsoc/grid-core";
import { useNavigation } from "@jsoc/react-grid";
import { toPascalCase } from "@jsoc/utils";
import { Typography } from "@mui/material";

export type NavigatorTitleProps = {
  index: GridIndex;
};

export function NavigatorTitle({ index }: NavigatorTitleProps) {
  const { gridSchema, gridStore, activateGrid } = useNavigation(index);
  const { options } = gridSchema;
  const { id, name } = options;
  const isActiveGrid = gridStore.isActiveGrid(gridSchema);
  const isOnlyItem = gridStore.length === 1;

  return (
    <Typography
      variant="subtitle1"
      onClick={!isActiveGrid ? activateGrid : undefined}
      sx={{
        userSelect: "none",
        cursor: !isActiveGrid ? "pointer" : "default",
        fontWeight: 700,
        color: isActiveGrid && !isOnlyItem ? "primary.main" : "text.primary",
        px: 0.5,
        py: 0.2,
        borderRadius: 1,
        transition: "all 0.15s ease",
        "&:hover": {
          textDecoration: isActiveGrid ? "none" : "underline",
        },
      }}
    >
      {toPascalCase(name || id)}
    </Typography>
  );
}
