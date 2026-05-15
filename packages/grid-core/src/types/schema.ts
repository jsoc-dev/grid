import type {
  ColumnDataType,
  ColumnKey,
  ColumnValueByDataType,
  PrimaryColumnKey,
} from "#types/column.ts";
import type { PluginConfig } from "#types/plugin.ts";
import type { GridRowId, GridRows } from "#types/rows.ts";
import type { GridStore } from "#types/store.ts";

import type { UJSONObject, UJSONObjectArray } from "@jsoc/utils";

/**
 * `GridSchema` with the bound {@link GridStore} and {@link PluginConfig}.
 */
export type GridSchemaNative<C extends PluginConfig> = GridSchema & {
  readonly store: GridStore<C>;
  readonly config: C;
};

/**
 * Schema definition exposed to grid plugins.
 */
export interface GridSchema {
  id: GridId;
  rows: GridRows;
  primaryColumnKey: PrimaryColumnKey;
  origin?: GridSchemaOrigin;
  /**
   * Gets the cell value for the given {@link GridCellLocation}.
   */
  getCellValue<D extends ColumnDataType>(
    cell: GridCellLocation,
  ): ColumnValueByDataType[D];
}

/**
 * Unique id of a `GridSchema` inside the `GridStore`
 */
export type GridId = string;

/**
 * Index of a `GridSchema` inside the `GridStore`
 */
export type GridSchemaIndex = number;

/**
 * Type of the data that can be used to generate a grid
 */
export type GridData = Readonly<string | UJSONObject | UJSONObjectArray>;

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
 * Describes where a child {@link GridSchema} was opened from.
 */
export type GridSchemaOrigin = {
  parent: GridSchema;
  cell: GridCellLocation;
};

