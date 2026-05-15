import type { FrameworkId, PluginId } from "@jsoc/grid-docs";
import AgIcon from "./aggrid.svg";
import AntIcon from "./antd.svg";
import MantineIcon from "./mantine-react-table.svg";
import MuiIcon from "./mui.svg";
import PrimeIcon from "./primereact.svg";
// import ShadcnIcon from "./shadcn.svg";
import TanStackIcon from "./tanstack.svg";
import type { SvgIcon } from "@/types/svg";

type PluginIconsByFramework = {
  [F in FrameworkId]: {
    [P in PluginId<F>]: SvgIcon;
  };
};

const PLUGIN_ICONS_BY_FRAMEWORK = {
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
  },
  "vanilla-grid": {
    ag: AgIcon,
    tanstack: TanStackIcon,
  },
} satisfies PluginIconsByFramework;

export function getPluginIcon<F extends FrameworkId, P extends PluginId<F>>(
  frameworkId: F,
  pluginId: P,
): SvgIcon {
  return (PLUGIN_ICONS_BY_FRAMEWORK as PluginIconsByFramework)[frameworkId][
    pluginId
  ];
}
