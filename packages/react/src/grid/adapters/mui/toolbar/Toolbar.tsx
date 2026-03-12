import { DefaultNavigator } from "#grid/components/navigator/DefaultNavigator.tsx";
import { InbuiltToolbarButtonsMui } from "#grid/adapters/mui/toolbar/components/index.ts";
import { Toolbar } from "@mui/x-data-grid";

export function DefaultToolbarMui() {
  return (
    <Toolbar>
      <DefaultNavigator />
      <InbuiltToolbarButtonsMui />
    </Toolbar>
  );
}
