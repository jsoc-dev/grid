import { getPrimaryColumnKey } from "#helpers/primary-column.ts";
import { generateRows } from "#helpers/rows.ts";
import type { PluginConfig, PluginOptions } from "#types/plugin.ts";
import type {
  GridMeta,
  GridOptionsWithId,
  GridSchemaWithConfig,
} from "#types/schema.ts";

/**
 * Constructs a {@link GridSchemaWithConfig} from the provided options.
 */
export function newGridSchema<C extends PluginConfig>(
  options: GridOptionsWithId,
  pluginOptions: PluginOptions<C>,
): GridSchemaWithConfig<C> {
  const { configGenerator, configGeneratorOptions } = pluginOptions;
  const meta = generateMeta(options);
  const config = configGenerator({ meta, options }, configGeneratorOptions);

  return { options, meta, config };
}

function generateMeta(options: GridOptionsWithId): GridMeta {
  const rows = generateRows(options.data);
  const primaryColumnKey = getPrimaryColumnKey(rows);

  return { rows, primaryColumnKey };
}
