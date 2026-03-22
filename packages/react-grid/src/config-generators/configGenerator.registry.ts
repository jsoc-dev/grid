import {
  configGeneratorAg,
  type PluginConfigAg,
} from "#config-generators/configGeneratorAg.ts";
import {
  configGeneratorMantine,
  type PluginConfigMantine,
} from "#config-generators/configGeneratorMantine.ts";
import {
  configGeneratorMui,
  type PluginConfigMui,
} from "#config-generators/configGeneratorMui.ts";
import {
  configGeneratorTanstack,
  type PluginConfigTanstack,
} from "#config-generators/configGeneratorTanstack.ts";

import type { PluginConfig, PluginConfigGenerator } from "@jsoc/grid-core";

export type GridPlugin = "ag" | "mantine" | "mui" | "tanstack";

export interface ConfigByPlugin extends Record<GridPlugin, PluginConfig> {
  ag: PluginConfigAg;
  mantine: PluginConfigMantine;
  mui: PluginConfigMui;
  tanstack: PluginConfigTanstack;
}

export const CONFIG_GENERATOR_BY_PLUGIN: {
  [P in GridPlugin]: PluginConfigGenerator<ConfigByPlugin[P]>;
} = {
  ag: configGeneratorAg,
  mantine: configGeneratorMantine,
  mui: configGeneratorMui,
  tanstack: configGeneratorTanstack,
};
