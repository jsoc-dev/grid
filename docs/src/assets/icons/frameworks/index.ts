import ReactIcon from "./react.svg";
import AngularIcon from "./angular.svg";
import VueIcon from "./vue.svg";
import JavaScript2Icon from "./javascript2.svg";
import type { SvgIcon } from "@/types/svg";

const FRAMEWORKS_ICONS_MAP = {
  "react-grid": ReactIcon,
  "angular-grid": AngularIcon,
  "vue-grid": VueIcon,
  "javascript-grid": JavaScript2Icon,
  "vanilla-grid": JavaScript2Icon,
} as const;

export function getFrameworkIcon(
  frameworkId: keyof typeof FRAMEWORKS_ICONS_MAP,
): SvgIcon {
  return FRAMEWORKS_ICONS_MAP[frameworkId];
}
