import type { ColumnKey, CustomColumnGeneratorByType } from "#column.ts";
import { getPrimaryColumnKey, type PrimaryColumnKey } from "#primary-column.ts";
import { generateRows, type GridRowId, type GridRows } from "#rows.ts";

import type { UJSONObject, UJSONObjectArray } from "@jsoc/utils";

/**
 * Unique id of a `GridSchema` inside the `GridStore`
 */
export type GridId = string;
/**
 * Name of a `GridSchema`. Multiple `GridSchema` can have same name.
 */
export type GridName = string;
/**
 * Index of a `GridSchema` inside the `GridStore`
 */
export type GridIndex = number;
/**
 * Type of the data that can be used to generate a grid
 */
export type GridData = string | UJSONObject | UJSONObjectArray;
/**
 * This type is used to prevent modification of the grid data.
 */
export type GridDataReadonly = Readonly<GridData>;
/**
 * Object representing the abstract location of a grid cell.
 * - `columnKey` refers to the {@link ColumnKey}.
 * - `rowId` is the {@link GridRowId} of the row containing the cell.
 */
export type GridCellLocation = {
  /**
   * `ColumnKey` which this cell corresponds to.
   */
  columnKey: ColumnKey;
  /**
   * Value of `PrimaryColumnKey` column in the row that contains this cell.
   * Instead of row index, row id is used here as it correctly identifies the row even if the rows are reordered.
   */
  rowId: GridRowId;
};
/**
 * Required inputs for constructing a grid schema.
 */
export interface GridOptions {
  /**
   * Readonly grid payload that {@link generateRows} will normalize.
   */
  data: GridDataReadonly;
  /** Optional human-friendly grid name. */
  name?: GridName;
}
/**
 * Grid options that include the assigned {@link GridId} that uniquely identifies the schema.
 */
export interface GridOptionsWithId extends GridOptions {
  id: GridId;
}
/**
 * Computed metadata for a grid schema such as the generated {@link GridRows} and resolved
 * {@link PrimaryColumnKey}.
 */
export interface GridMeta {
  rows: GridRows;
  primaryColumnKey: PrimaryColumnKey;
}
/**
 * Schema definition exposed to grid plugins.
 */
export interface GridSchema {
  meta: GridMeta;
  options: GridOptionsWithId;
}
/**
 * Base type for any grid plugin config.
 */
export interface PluginConfig<TColumn = unknown> {
  /**
   * Internal property used to store the column type for type inference. Actual property name varies based on the plugin.
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
/**
 * `GridSchema` with the `PluginConfig`
 */
export interface GridSchemaWithConfig<
  C extends PluginConfig,
> extends GridSchema {
  config: C;
}

// ------------------------------------------------------------------
// -------------------------- TYPES ENDED ---------------------------
// ------------------------------------------------------------------

/**
 * Default name that is used if the consumer didn't provide any name for the the root grid.
 */
export const DEFAULT_ROOT_GRID_NAME = "Grid";

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
