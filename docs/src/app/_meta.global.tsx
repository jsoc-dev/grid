import { DocsSelectors } from "@/components/docs/sidebar/DocsSelectors";
import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    display: "hidden",
  },

  docs: {
    type: "page",
    title: "Documentation",
    // @ts-expect-error - items property errors when used along with type: "page" but it is supported
    items: {
      // index item must be first property in this object otherwise index page link doesn't become a clickable link in breadcrumbs
      // currently separator is the first property, as a result Documentation is not clickable in breadcrumbs "Documentation > Getting Started > ..."
      "--": {
        type: "separator",
        title: <DocsSelectors />,
      },
      index: {},
      adapters: {},
      plugins: {
        items: {
          "--plugin-separator-react": {
            type: "separator",
            title: "React",
          },
          "react-grid-ag": {},
          "react-grid-ant": {},
          "react-grid-mantine": {},
          "react-grid-mui": {},
          "react-grid-prime": {},
          "react-grid-tanstack": {},

          "--plugin-separator-vanilla": {
            type: "separator",
            title: "Vanilla",
          },
          "vanilla-grid-ag": {},
          "vanilla-grid-tanstack": {},

          "--plugin-separator-vue": {
            type: "separator",
            title: "Vue",
          },
          "vue-grid-ag": {},
          "vue-grid-tanstack": {},
        },
      },
      "getting-started": {},
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
