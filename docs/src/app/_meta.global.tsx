import { PluginDropdown } from "@/components/docs/PluginDropdown";
import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    display: "hidden",
  },
  "react-grid": {
    type: "page",
    title: "Documentation",
    // @ts-expect-error - items property errors when used along with type: "page" but it is supported
    items: {
      "--": {
        type: "separator",
        title: <PluginDropdown />,
      },
    },
  },
  examples: {
    type: "page",
    href: "/examples",
  },
  playground: {
    type: "page",
    href: "/playground",
  },
  packages: {
    type: "page",
    href: "https://www.npmjs.com/org/jsoc",
  },
};

export default meta;
