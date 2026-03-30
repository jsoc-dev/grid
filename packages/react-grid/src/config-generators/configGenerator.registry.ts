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
  configGeneratorPrime,
  type PluginConfigPrime,
} from "#config-generators/configGeneratorPrime.ts";
import {
  configGeneratorTanstack,
  type PluginConfigTanstack,
} from "#config-generators/configGeneratorTanstack.ts";
import type { GridPlugin } from "#constants/plugins.ts";

import type { PluginConfig, PluginConfigGenerator } from "@jsoc/grid-core";

export interface ConfigByPlugin extends Record<GridPlugin, PluginConfig> {
  ag: PluginConfigAg;
  mantine: PluginConfigMantine;
  mui: PluginConfigMui;
  prime: PluginConfigPrime;
  tanstack: PluginConfigTanstack;
}

export const CONFIG_GENERATOR_BY_PLUGIN: {
  [P in GridPlugin]: PluginConfigGenerator<ConfigByPlugin[P]>;
} = {
  ag: configGeneratorAg,
  mantine: configGeneratorMantine,
  mui: configGeneratorMui,
  tanstack: configGeneratorTanstack,
  prime: configGeneratorPrime,
};
