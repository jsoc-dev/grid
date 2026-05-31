import type { FrameworkId, PluginId } from "#types.ts";

export type PluginMetadata = {
  name: string;
  shortName: string;
  packageName: string;
  peerDeps: string[];
};
export type PluginMetadataProperty = keyof PluginMetadata;
export type PluginMetadataValue = PluginMetadata[PluginMetadataProperty];

export type PluginMetadataMap<F extends FrameworkId = FrameworkId> = {
  [id in PluginId<F>]: PluginMetadata;
};

export type PluginMetadataMapByFramework = {
  [F in FrameworkId]: PluginMetadataMap<F>;
};

const REACT_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/react-grid-ag",
    peerDeps: ["ag-grid-community", "ag-grid-react"],
  },
  ant: {
    name: "Ant Design Table",
    shortName: "AntD",
    packageName: "@jsoc/react-grid-ant",
    peerDeps: ["antd"],
  },
  mantine: {
    name: "Mantine React Table",
    shortName: "Mantine",
    packageName: "@jsoc/react-grid-mantine",
    peerDeps: ["mantine-react-table"],
  },
  mui: {
    name: "MUI DataGrid",
    shortName: "MUI",
    packageName: "@jsoc/react-grid-mui",
    peerDeps: ["@mui/x-data-grid"],
  },
  prime: {
    name: "PrimeReact DataTable",
    shortName: "Prime",
    packageName: "@jsoc/react-grid-prime",
    peerDeps: ["primereact"],
  },
  tanstack: {
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/react-grid-tanstack",
    peerDeps: ["@tanstack/react-table"],
  },
} as const satisfies PluginMetadataMap<"react-grid">;

const VANILLA_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/vanilla-grid-ag",
    peerDeps: ["ag-grid-community"],
  },
  tanstack: {
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/vanilla-grid-tanstack",
    peerDeps: ["@tanstack/table-core"],
  },
} as const satisfies PluginMetadataMap<"vanilla-grid">;

const VUE_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/vue-grid-ag",
    peerDeps: ["ag-grid-community", "ag-grid-vue3"],
  },
  tanstack: {
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/vue-grid-tanstack",
    peerDeps: ["@tanstack/vue-table"],
  },
} as const satisfies PluginMetadataMap<"vue-grid">;

const PLUGIN_METADATA_MAP_BY_FRAMEWORK: PluginMetadataMapByFramework = {
  "react-grid": REACT_GRID_PLUGINS_METADATA_MAP,
  "vue-grid": VUE_GRID_PLUGINS_METADATA_MAP,
  "vanilla-grid": VANILLA_GRID_PLUGINS_METADATA_MAP,
};

export function getPluginIds<F extends FrameworkId>(
  frameworkId: F,
): PluginId<F>[] {
  const pluginsMetadata = PLUGIN_METADATA_MAP_BY_FRAMEWORK[frameworkId];
  return Object.keys(pluginsMetadata) as PluginId<F>[];
}

export function isValidPluginId<F extends FrameworkId>(
  frameworkId: F,
  pluginId: string,
): pluginId is PluginId<F> {
  return getPluginIds(frameworkId).includes(pluginId as PluginId<F>);
}

export function getPluginMetadata<F extends FrameworkId, P extends PluginId<F>>(
  frameworkId: F,
  pluginId: P,
): PluginMetadataMap<F>[P] {
  return PLUGIN_METADATA_MAP_BY_FRAMEWORK[frameworkId][pluginId];
}
