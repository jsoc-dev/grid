import {
  COLUMN_DATA_TYPE_SEQUENTIAL_RESOLVERS,
  COLUMN_DATA_TYPES,
} from "#constants.ts";
import { isFallbackPrimaryColumn } from "#helpers/primary-column.ts";
import type {
  ColumnDataType,
  ColumnDataTypeMap,
  ColumnGeneratorByType,
  ColumnKeyValueMap,
  ColumnValue,
  CustomColumnGeneratorByType,
} from "#types/column.ts";
import type { InferColumnType, PluginConfig } from "#types/plugin.ts";
import type { GridRows } from "#types/rows.ts";
import type { GridSchema } from "#types/schema.ts";

/**
 * Generates column definitions/configurations for the particular Grid plugin.
 * @template C - Type of the Grid plugin configuration
 * @param gridSchema - Base schema of the grid
 * @param defaultColumnGeneratorByType - Mapping of {@link ColumnDataType} to {@link ColumnGenerator}
 * @param customColumnGeneratorByType - Mapping of {@link ColumnDataType} to {@link CustomColumnGenerator}
 * @returns Array of column definitions/configurations
 */
export function generateColumns<C extends PluginConfig>(
  gridSchema: GridSchema,
  defaultColumnGeneratorByType: ColumnGeneratorByType<C>,
  customColumnGeneratorByType?: CustomColumnGeneratorByType<C>,
): InferColumnType<C>[] {
  const columnKeyValueMap = createColumnKeyValueMap(gridSchema.meta.rows);
  const columnDataTypeMap = createColumnDataTypeMap(columnKeyValueMap);
  const columnDataTypeEntries = Object.entries(columnDataTypeMap);

  const columns = [];

  for (const [columnKey, columnDataType] of columnDataTypeEntries) {
    const params = {
      columnKey,
      columnDataType,
      gridSchema,
    };

    const defaultColGenerator = defaultColumnGeneratorByType[columnDataType];
    const customColGenerator = customColumnGeneratorByType?.[columnDataType];

    // merge default and custom column definitions
    const generatedColumn = {
      ...defaultColGenerator(params),
      ...customColGenerator?.(params),
    };

    columns.push(generatedColumn);
  }

  return columns;
}

/**
 * Creates a map from each {@link ColumnKey} to the list of {@link ColumnValue}s observed in the
 * provided {@link GridRows}.
 */
function createColumnKeyValueMap(plainRows: GridRows): ColumnKeyValueMap {
  const columnKeyValueMapper: ColumnKeyValueMap = {};

  /**
   * This approach ensures all ColumnValue[] arrays are have equal length === number of rows
   * CAVAETS:
   * 1. If there is even one missing value of a ColumnKey in rows, then the column data type
   * 	will become unresolved, this is due to implementation of `ColumnDataTypeResolverMethod`
   * 	as to resolve only if all values are of same type.
   * 2. First Row decides the order of column keys. Remaining rows only adds the column keys
   * 	that were not present in the previous rows.
   */
  const allColumnKeys = new Set<string>();
  for (const row of plainRows) {
    for (const key in row) {
      allColumnKeys.add(key);
    }
  }

  for (const row of plainRows) {
    for (const key of allColumnKeys) {
      columnKeyValueMapper[key] = columnKeyValueMapper[key] ?? [];
      columnKeyValueMapper[key].push(row[key]);
    }
  }

  // old method, doesn't include a undefined value if the key doesn't have value in a row but other row has
  // for (const row of plainRows) {
  // 	for (const [columnKey, columnValue] of Object.entries(row)) {
  // 		columnKeyValueMapper[columnKey] =
  // 			columnKeyValueMapper[columnKey] ?? [];
  // 		columnKeyValueMapper[columnKey].push(columnValue);
  // 	}
  // }

  return columnKeyValueMapper;
}

/**
 * Builds the {@link ColumnDataTypeMap} for the given {@link ColumnKeyValueMap}.
 */
function createColumnDataTypeMap(
  columnKeyValueMap: ColumnKeyValueMap,
): ColumnDataTypeMap {
  const columnSchemaMap: ColumnDataTypeMap = {};

  for (const [columnKey, columnValues] of Object.entries(columnKeyValueMap)) {
    if (isFallbackPrimaryColumn(columnKey)) {
      continue; // skip this column as data of this column is not part of actual GridDataReadonly
    }

    columnSchemaMap[columnKey] = resolveColumnDataType(columnValues);
  }

  return columnSchemaMap;
}

/**
 * Resolves the {@link ColumnDataType} for a particular {@link ColumnKey} based on its
 * {@link ColumnValue}s.
 */
function resolveColumnDataType(columnValues: ColumnValue[]): ColumnDataType {
  for (const resolver of COLUMN_DATA_TYPE_SEQUENTIAL_RESOLVERS) {
    const resolved = resolver(columnValues);
    if (resolved) {
      return resolved;
    }
  }

  return COLUMN_DATA_TYPES.ujsonValue;
}
