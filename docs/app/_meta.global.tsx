import type { MetaRecord } from "nextra";

const gridItems: MetaRecord = {
  start: { title: "Get Started" },
  props: { title: "Props" },
  adapters: { title: "Adapters" },
};

const documentationItems: MetaRecord = {
  index: { title: "Introduction" },
  grid: {
    // @ts-expect-error - items is supported for all types in _meta.global file
    items: gridItems,
  },
};

const meta: MetaRecord = {
  index: { type: "page", display: "hidden" },

  documentation: {
    type: "page",
    title: "Documentation",
    // @ts-expect-error - items is supported for all types in _meta.global file
    // https://nextra.site/docs/file-conventions/meta-file#_metaglobal-file
    items: documentationItems,
  },

  playground: {
    type: "page",
    title: "Playground",

    theme: {
      copyPage: false,
      layout: "full",
      timestamp: false,
      sidebar: false,
      breadcrumb: false,
      pagination: false,
      toc: false,
    },

    // @ts-expect-error - items is supported for all types in _meta.global file
    items: {
      grid: { title: "Grid" },
    },
  },
};

export default meta;
