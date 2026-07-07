import type {
  AdapterId,
  PluginId,
  ReactGridPluginId,
  VanillaGridPluginId,
  VueGridPluginId,
} from "#types/plugins.ts";

export type ExampleMetadata = {
  name: string;
  description?: string;
};

export type ExampleMetadataMap = { [exampleId: string]: ExampleMetadata };

export type ExampleMetadataMapByPlugin<A extends AdapterId> = {
  [id in PluginId<A>]: ExampleMetadataMap;
};

export type ExampleMetadataMapByPluginByAdapter = {
  [A in AdapterId]: ExampleMetadataMapByPlugin<A>;
};

export type VanillaGridExampleIds<P extends VanillaGridPluginId> =
  keyof (typeof VANILLA_GRID_EXAMPLES_METADATA_MAP)[P];

export type ReactGridExampleIds<P extends ReactGridPluginId> =
  keyof (typeof REACT_GRID_EXAMPLES_METADATA_MAP)[P];

export type VueGridExampleIds<P extends VueGridPluginId> =
  keyof (typeof VUE_GRID_EXAMPLES_METADATA_MAP)[P];

type ExamplesMetadata = typeof EXAMPLES_METADATA_BY_ADAPTER;
type ExampleIdsForAdapter<A extends keyof ExamplesMetadata & AdapterId> = {
  [P in keyof ExamplesMetadata[A]]: Extract<
    keyof ExamplesMetadata[A][P],
    string
  >;
};
type ExampleIdsLookup = {
  [A in keyof ExamplesMetadata & AdapterId]: ExampleIdsForAdapter<A>;
};

export type ExampleId<A extends AdapterId, P extends PluginId<A>> = {
  [Ax in keyof ExampleIdsLookup]: {
    [Px in keyof ExampleIdsLookup[Ax]]: Ax extends A
      ? Px extends P
        ? ExampleIdsLookup[Ax][Px]
        : never
      : never;
  }[keyof ExampleIdsLookup[Ax]];
}[A];

export type ExampleLocator<A extends AdapterId, P extends PluginId<A>> = {
  adapterId: A;
  pluginId: P;
  exampleId: ExampleId<A, P>;
};

export const SHARED_EXAMPLE_METADATA_MAP = {
  basic: {
    name: "Basic Example",
    description: "Minimal example to get you started.",
  },
  localData: {
    name: "Local Data Example",
    description:
      "This example reads the JSON string from local broadcast channel.",
  },
  remoteData: {
    name: "Remote Data Example",
    description: `This example reads the JSON string from a remote URL.`,
  },
} as const satisfies ExampleMetadataMap;

export const REACT_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
  ant: { ...SHARED_EXAMPLE_METADATA_MAP },
  mantine: { ...SHARED_EXAMPLE_METADATA_MAP },
  mui: { ...SHARED_EXAMPLE_METADATA_MAP },
  prime: { ...SHARED_EXAMPLE_METADATA_MAP },
  tanstack: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"react-grid">;

export const VANILLA_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
  tanstack: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"vanilla-grid">;

export const VUE_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
  tanstack: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"vue-grid">;

export const EXAMPLES_METADATA_BY_ADAPTER = {
  "react-grid": REACT_GRID_EXAMPLES_METADATA_MAP,
  "vue-grid": VUE_GRID_EXAMPLES_METADATA_MAP,
  "vanilla-grid": VANILLA_GRID_EXAMPLES_METADATA_MAP,
} as const satisfies ExampleMetadataMapByPluginByAdapter;

export function getExampleIds<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
): ExampleId<A, P>[] {
  const examplesMetadata = (
    EXAMPLES_METADATA_BY_ADAPTER as ExampleMetadataMapByPluginByAdapter
  )[adapterId][pluginId];
  return Object.keys(examplesMetadata) as ExampleId<A, P>[];
}

export function isValidExampleId<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
  exampleId: string,
): exampleId is ExampleId<A, P> {
  return getExampleIds(adapterId, pluginId).includes(
    exampleId as ExampleId<A, P>,
  );
}

export function getExampleMetadata<
  A extends AdapterId,
  P extends PluginId<A>,
  E extends ExampleId<A, P>,
>(adapterId: A, pluginId: P, exampleId: E): ExampleMetadata {
  return (EXAMPLES_METADATA_BY_ADAPTER as ExampleMetadataMapByPluginByAdapter)[
    adapterId
  ][pluginId][exampleId];
}
