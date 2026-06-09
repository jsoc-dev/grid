import type { AdapterId, PluginId } from "@jsoc/grid-docs";
import AgIcon from "./aggrid.svg";
import AntIcon from "./antd.svg";
import MantineIcon from "./mantine-react-table.svg";
import MuiIcon from "./mui.svg";
import PrimeIcon from "./primereact.svg";
// import ShadcnIcon from "./shadcn.svg";
import TanStackIcon from "./tanstack.svg";
import type { SvgIcon } from "@/types/svg";

type PluginIconsByAdapter = {
  [A in AdapterId]: {
    [P in PluginId<A>]: SvgIcon;
  };
};

const PLUGIN_ICONS_BY_ADAPTER = {
  "react-grid": {
    ag: AgIcon,
    ant: AntIcon,
    mantine: MantineIcon,
    mui: MuiIcon,
    prime: PrimeIcon,
    // shadcn: ShadcnIcon,
    tanstack: TanStackIcon,
  },
  "vue-grid": {
    ag: AgIcon,
    tanstack: TanStackIcon,
  },
  "vanilla-grid": {
    ag: AgIcon,
    tanstack: TanStackIcon,
  },
} satisfies PluginIconsByAdapter;

export function getPluginIcon<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
): SvgIcon {
  return (PLUGIN_ICONS_BY_ADAPTER as PluginIconsByAdapter)[adapterId][pluginId];
}
