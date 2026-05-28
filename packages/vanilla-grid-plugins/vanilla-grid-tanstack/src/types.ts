import type {
  GridStore,
  PluginConfigGenerator,
  PluginGridStoreOptions,
} from "@jsoc/grid-core";
import type { PluginConfigTanstack } from "@jsoc/grid-tanstack-shared";

export type ConfigGeneratorTanstack =
  PluginConfigGenerator<PluginConfigTanstack>;
export type GridStoreTanstack = GridStore<PluginConfigTanstack>;
export type GridStoreOptionsTanstack =
  PluginGridStoreOptions<PluginConfigTanstack>;
