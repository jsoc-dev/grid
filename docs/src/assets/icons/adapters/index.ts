import ReactIcon from "./react.svg";
import AngularIcon from "./angular.svg";
import VueIcon from "./vue.svg";
import JavaScript2Icon from "./javascript2.svg";
import type { SvgIcon } from "@/types/svg";
import type { AdapterId, UpcomingAdapterId } from "@jsoc/grid-docs";

const ADAPTERS_ICONS_MAP = {
  "react-grid": ReactIcon,
  "angular-grid": AngularIcon,
  "vue-grid": VueIcon,
  "vanilla-grid": JavaScript2Icon,
} as const satisfies Record<AdapterId | UpcomingAdapterId, SvgIcon>;

export function getAdapterIcon(
  adapterId: keyof typeof ADAPTERS_ICONS_MAP,
): SvgIcon {
  return ADAPTERS_ICONS_MAP[adapterId];
}
