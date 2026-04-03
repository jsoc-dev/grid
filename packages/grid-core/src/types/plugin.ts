import type { CustomColumnGeneratorByType } from "#types/column.ts";
import type { GridSchema } from "#types/schema.ts";

/**
 * Base type for any grid plugin config.
 */
export interface PluginConfig<TColumn = unknown> {
  /**
   * Internal property used to store the column definition type of the grid plugin.
   * This is solely for type inference and not a valid property of the plugin config.
   */
  __columnType?: TColumn;
}

/**
 * Plugin related options
 */
export type PluginOptions<C extends PluginConfig> = {
  configGenerator: PluginConfigGenerator<C>;
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>;
};

/**
 * Column type inferred from the `PluginConfig`
 */
// https://chatgpt.com/share/69bd22d8-d75c-800c-8b2f-2f4708cd06a7
export type InferColumnType<C extends PluginConfig> =
  C["__columnType"] extends infer T ? NonNullable<T> : never;

/**
 * Options for the `PluginConfigGenerator`
 */
export type PluginConfigGeneratorOptions<
  C extends PluginConfig = PluginConfig,
> = {
  customColumnGeneratorByType?: CustomColumnGeneratorByType<C>;
};

/**
 * Method that will be used to generate the `PluginConfig` for the grid plugin
 */
export type PluginConfigGenerator<C extends PluginConfig = PluginConfig> = (
  gridSchema: GridSchema,
  options?: PluginConfigGeneratorOptions<C>,
) => C;
