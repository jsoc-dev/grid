import type {
  PluginConfigAg,
  PluginConfigAnt,
  PluginConfigMantine,
  PluginConfigMui,
  PluginConfigPrime,
  PluginConfigTanstack,
} from "#types/plugin-config.ts";

import type { PluginConfigGenerator } from "@jsoc/grid-core";

export type ConfigGeneratorAg = PluginConfigGenerator<PluginConfigAg>;
export type ConfigGeneratorAnt = PluginConfigGenerator<PluginConfigAnt>;
export type ConfigGeneratorMantine = PluginConfigGenerator<PluginConfigMantine>;
export type ConfigGeneratorMui = PluginConfigGenerator<PluginConfigMui>;
export type ConfigGeneratorPrime = PluginConfigGenerator<PluginConfigPrime>;
export type ConfigGeneratorTanstack =
  PluginConfigGenerator<PluginConfigTanstack>;
