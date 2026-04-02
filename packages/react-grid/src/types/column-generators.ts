import type {
  PluginConfigAg,
  PluginConfigAnt,
  PluginConfigMantine,
  PluginConfigMui,
  PluginConfigPrime,
  PluginConfigTanstack,
} from "#types/plugin-config.ts";

import type { ColumnGenerator } from "@jsoc/grid-core";

export type ColumnGeneratorAg = ColumnGenerator<PluginConfigAg>;
export type ColumnGeneratorAnt = ColumnGenerator<PluginConfigAnt>;
export type ColumnGeneratorMantine = ColumnGenerator<PluginConfigMantine>;
export type ColumnGeneratorMui = ColumnGenerator<PluginConfigMui>;
export type ColumnGeneratorPrime = ColumnGenerator<PluginConfigPrime>;
export type ColumnGeneratorTanstack = ColumnGenerator<PluginConfigTanstack>;
