import type { ColumnKey, PrimaryColumnKey } from "#types/column.ts";
import type { PluginConfig } from "#types/plugin.ts";
import type { GridRowId, GridRows } from "#types/rows.ts";

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
export type GridOptions = {
  /**
   * Readonly grid payload that {@link generateRows} will normalize.
   */
  data: GridDataReadonly;
  /** Optional human-friendly grid name. */
  name?: GridName;
};

/**
 * Grid options that include the assigned {@link GridId} that uniquely identifies the schema.
 */
export type GridOptionsWithId = GridOptions & {
  id: GridId;
};

/**
 * Computed metadata for a grid schema such as the generated {@link GridRows} and resolved
 * {@link PrimaryColumnKey}.
 */
export type GridMeta = {
  rows: GridRows;
  primaryColumnKey: PrimaryColumnKey;
};

/**
 * Schema definition exposed to grid plugins.
 */
export type GridSchema = {
  meta: GridMeta;
  options: GridOptionsWithId;
};

/**
 * `GridSchema` with the `PluginConfig`
 */
export type GridSchemaWithConfig<C extends PluginConfig> = GridSchema & {
  config: C;
};
