import type { AdapterId, PluginId } from "#types/plugins.ts";

export type PluginMetadata<id extends PluginId = PluginId> = {
  id: id;
  name: string;
  shortName: string;
  packageName: string;
};
export type PluginMetadataProperty = keyof PluginMetadata;
export type PluginMetadataValue = PluginMetadata[PluginMetadataProperty];

export type PluginMetadataMap<A extends AdapterId = AdapterId> = {
  [id in PluginId<A>]: PluginMetadata<id>;
};

export type PluginMetadataMapByAdapter = {
  [A in AdapterId]: PluginMetadataMap<A>;
};

const REACT_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    id: "ag",
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/react-grid-ag",
  },
  ant: {
    id: "ant",
    name: "Ant Design Table",
    shortName: "AntD",
    packageName: "@jsoc/react-grid-ant",
  },
  mantine: {
    id: "mantine",
    name: "Mantine React Table",
    shortName: "Mantine",
    packageName: "@jsoc/react-grid-mantine",
  },
  mui: {
    id: "mui",
    name: "MUI DataGrid",
    shortName: "MUI",
    packageName: "@jsoc/react-grid-mui",
  },
  prime: {
    id: "prime",
    name: "PrimeReact DataTable",
    shortName: "Prime",
    packageName: "@jsoc/react-grid-prime",
  },
  tanstack: {
    id: "tanstack",
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/react-grid-tanstack",
  },
} as const satisfies PluginMetadataMap<"react-grid">;

const VANILLA_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    id: "ag",
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/vanilla-grid-ag",
  },
  tanstack: {
    id: "tanstack",
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/vanilla-grid-tanstack",
  },
} as const satisfies PluginMetadataMap<"vanilla-grid">;

const VUE_GRID_PLUGINS_METADATA_MAP = {
  ag: {
    id: "ag",
    name: "AG Grid",
    shortName: "AG",
    packageName: "@jsoc/vue-grid-ag",
  },
  tanstack: {
    id: "tanstack",
    name: "TanStack Table",
    shortName: "TanStack",
    packageName: "@jsoc/vue-grid-tanstack",
  },
} as const satisfies PluginMetadataMap<"vue-grid">;

const PLUGIN_METADATA_MAP_BY_ADAPTER: PluginMetadataMapByAdapter = {
  "react-grid": REACT_GRID_PLUGINS_METADATA_MAP,
  "vue-grid": VUE_GRID_PLUGINS_METADATA_MAP,
  "vanilla-grid": VANILLA_GRID_PLUGINS_METADATA_MAP,
};

export function getPluginIds<A extends AdapterId>(adapterId: A): PluginId<A>[] {
  const pluginsMetadata = PLUGIN_METADATA_MAP_BY_ADAPTER[adapterId];
  return Object.keys(pluginsMetadata) as PluginId<A>[];
}

export function isValidPluginId<A extends AdapterId>(
  adapterId: A,
  pluginId: string,
): pluginId is PluginId<A> {
  return getPluginIds(adapterId).includes(pluginId as PluginId<A>);
}

export function getPluginMetadata<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
): PluginMetadataMap<A>[P] {
  return PLUGIN_METADATA_MAP_BY_ADAPTER[adapterId][
    pluginId
  ] as unknown as PluginMetadataMap<A>[P];
}

export function getAllPluginMetadata<A extends AdapterId>(
  adapterId: A,
): PluginMetadata<PluginId<A>>[] {
  return Object.values(PLUGIN_METADATA_MAP_BY_ADAPTER[adapterId]);
}
