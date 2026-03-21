import { NavigatorItem } from "#components/navigator/NavigatorItem.tsx";
import { NavigatorTitle } from "#components/navigator/NavigatorTitle.tsx";

import { useStoreContext } from "@jsoc/react-grid";
import { NavigateNext } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

export function Navigator() {
  const { gridStore } = useStoreContext();

  return (
    <Stack direction="row" spacing={1} alignItems="center" overflow="auto">
      {gridStore.getSchemas().map((_, index) => {
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
