import { NavigatorItem } from "#grid/polygrid/navigator/NavigatorItem.tsx";
import { NavigatorTitle } from "#grid/polygrid/navigator/NavigatorTitle.tsx";
import { useStoreContext } from "#grid/hooks/useStoreContext.ts";
import { Stack } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { Fragment } from "react/jsx-runtime";

export function Navigator() {
  const { gridStore } = useStoreContext();

  return (
    <Stack direction="row" spacing={1} alignItems="center" overflow="auto">
      {gridStore.map((_, index) => {
        const isFirstItem = index === 0;

        return (
          <Fragment key={index}>
            {isFirstItem ? (
              <NavigatorTitle index={index} />
            ) : (
              <>
                <NavigateNext fontSize="small" color="action" />
                <NavigatorItem index={index} />
              </>
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}
