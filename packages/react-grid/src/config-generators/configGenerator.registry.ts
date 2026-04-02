import { configGeneratorAg } from "#config-generators/configGeneratorAg.ts";
import { configGeneratorAnt } from "#config-generators/configGeneratorAnt.ts";
import { configGeneratorMantine } from "#config-generators/configGeneratorMantine.ts";
import { configGeneratorMui } from "#config-generators/configGeneratorMui.ts";
import { configGeneratorPrime } from "#config-generators/configGeneratorPrime.ts";
import { configGeneratorTanstack } from "#config-generators/configGeneratorTanstack.ts";
import type { GridPlugin } from "#constants/plugins.ts";
import type { ConfigByPlugin } from "#types/plugin-config.ts";

import type { PluginConfigGenerator } from "@jsoc/grid-core";

export const CONFIG_GENERATOR_BY_PLUGIN: {
  [P in GridPlugin]: PluginConfigGenerator<ConfigByPlugin[P]>;
} = {
  ag: configGeneratorAg,
  ant: configGeneratorAnt,
  mantine: configGeneratorMantine,
  mui: configGeneratorMui,
  tanstack: configGeneratorTanstack,
  prime: configGeneratorPrime,
};
