import {
  DefaultNavigatorItemMui,
  DefaultNavigatorTitleMui,
} from "#grid/components/navigator/components/index.ts";
import { useGridSchemaStore } from "#grid/hooks/useGridSchemaStore.ts";
import { Fragment } from "react/jsx-runtime";
import { Stack } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

export function DefaultNavigator() {
  const { gridSchemaStore } = useGridSchemaStore();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flex={1}
      overflow="auto"
    >
      {gridSchemaStore.map((_, index, __) => {
        const isFirstItem = index === 0;

        return (
          <Fragment key={index}>
            {isFirstItem ? (
              <DefaultNavigatorTitleMui index={index} />
            ) : (
              <>
                <NavigateNext fontSize="small" color="action" />
                <DefaultNavigatorItemMui index={index} />
              </>
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}
