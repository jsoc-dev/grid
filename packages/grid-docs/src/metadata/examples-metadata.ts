import type { FrameworkId, PluginId } from "#types.ts";

import type { StringKeysOf } from "@jsoc/utils";

export type ExampleMetadata = {
  name: string;
  description?: string;
};

export type ExampleMetadataMap = {
  [exampleId: string]: ExampleMetadata;
};

export type ExampleMetadataMapByPlugin<F extends FrameworkId> = {
  [id in PluginId<F>]: ExampleMetadataMap;
};

export type ExampleMetadataMapByPluginByFramework = {
  [F in FrameworkId]: ExampleMetadataMapByPlugin<F>;
};

export type ExampleId<
  F extends FrameworkId,
  P extends PluginId<F>,
> = StringKeysOf<(typeof EXAMPLES_METADATA_BY_FRAMEWORK)[F][P]>;

export type ExampleOptions<F extends FrameworkId, P extends PluginId<F>> = {
  frameworkId: F;
  pluginId: P;
  exampleId: ExampleId<F, P>;
};

/** Default URL for remote-data examples. */
export const REMOTE_DATA_EXAMPLE_URL =
  "https://jsonplaceholder.typicode.com/users";

const SHARED_EXAMPLE_METADATA_MAP = {
  basic: {
    name: "Basic Example",
    description: "Minimal example to get you started.",
  },
  "local-data": {
    name: "Local Data Example",
    description:
      "This example reads the JSON string from local broadcast channel.",
  },
  "remote-data": {
    name: "Remote Data Example",
    description: `This example reads the JSON string from remote URL: ${REMOTE_DATA_EXAMPLE_URL}.`,
  },
} as const satisfies Record<string, ExampleMetadata>;

const REACT_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
  ant: { ...SHARED_EXAMPLE_METADATA_MAP },
  mantine: { ...SHARED_EXAMPLE_METADATA_MAP },
  mui: { ...SHARED_EXAMPLE_METADATA_MAP },
  prime: { ...SHARED_EXAMPLE_METADATA_MAP },
  tanstack: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"react-grid">;

const VANILLA_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
  tanstack: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"vanilla-grid">;

const VUE_GRID_EXAMPLES_METADATA_MAP = {
  ag: { ...SHARED_EXAMPLE_METADATA_MAP },
} as const satisfies ExampleMetadataMapByPlugin<"vue-grid">;

const EXAMPLES_METADATA_BY_FRAMEWORK: ExampleMetadataMapByPluginByFramework = {
  "react-grid": REACT_GRID_EXAMPLES_METADATA_MAP,
  "vue-grid": VUE_GRID_EXAMPLES_METADATA_MAP,
  "vanilla-grid": VANILLA_GRID_EXAMPLES_METADATA_MAP,
};

export function getExampleIds<F extends FrameworkId, P extends PluginId<F>>(
  frameworkId: F,
  pluginId: P,
): ExampleId<F, P>[] {
  return Object.keys(
    EXAMPLES_METADATA_BY_FRAMEWORK[frameworkId][pluginId],
  ) as ExampleId<F, P>[];
}

export function isValidExampleId<F extends FrameworkId, P extends PluginId<F>>(
  frameworkId: F,
  pluginId: P,
  exampleId: string,
): exampleId is ExampleId<F, P> {
  return getExampleIds(frameworkId, pluginId).includes(
    exampleId as ExampleId<F, P>,
  );
}

export function getExampleMetadata<
  F extends FrameworkId,
  P extends PluginId<F>,
  E extends ExampleId<F, P>,
>(frameworkId: F, pluginId: P, exampleId: E) {
  return EXAMPLES_METADATA_BY_FRAMEWORK[frameworkId][pluginId][exampleId];
}
