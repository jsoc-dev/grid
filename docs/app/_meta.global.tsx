import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: { type: "page", display: "hidden" },

  docs: {
    type: "page",
    title: "Docs",
    // @ts-expect-error - items is supported for all types in _meta.global file
    // https://nextra.site/docs/file-conventions/meta-file#_metaglobal-file
    items: {
      index: { title: "Introduction" },
      "react-grid": { title: "React Grid" },
    },
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
  },
};

export default meta;
