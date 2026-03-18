import {
  type PluginConfigAg,
  type PluginConfigMui,
  configGeneratorAg,
  configGeneratorMui,
} from "#grid/config-generators/index.ts";
import { type PluginConfig, type PluginConfigGenerator } from "@jsoc/core/grid";

export type GridPlugin = "ag" | "mui";

export interface ConfigByPlugin extends Record<GridPlugin, PluginConfig> {
  ag: PluginConfigAg;
  mui: PluginConfigMui;
}

export const CONFIG_GENERATOR_BY_PLUGIN: {
  [P in GridPlugin]: PluginConfigGenerator<ConfigByPlugin[P]>;
} = {
  ag: configGeneratorAg,
  mui: configGeneratorMui,
};
