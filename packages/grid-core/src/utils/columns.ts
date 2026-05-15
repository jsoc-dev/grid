import type {
  ColumnDataType,
  ColumnDataTypeMap,
  ColumnDataTypeResolverMethod,
  ColumnGenerator,
  ColumnGeneratorByType,
  ColumnKeyValueMap,
  ColumnValue,
  CustomColumnGenerator,
  CustomColumnGeneratorByType,
} from "#types/column.ts";
import type { InferColumnType, PluginConfig } from "#types/plugin.ts";
import type { GridRows } from "#types/rows.ts";
import type { GridSchema } from "#types/schema.ts";
import { isFallbackPrimaryColumn } from "#utils/primary-column.ts";

import {
  isBoolean,
  isISODateString,
  isNumber,
  isString,
  isUJSONObject,
  isUJSONObjectArray,
} from "@jsoc/utils";

export const COLUMN_DATA_TYPES: {
  [K in ColumnDataType]: K;
} = {
  boolean: "boolean",
  number: "number",
  string: "string",
  stringDate: "stringDate",
  ujsonObject: "ujsonObject",
  ujsonObjectArray: "ujsonObjectArray",
  ujsonValue: "ujsonValue",
} as const;

/**
 * Sequential list of {@link ColumnDataTypeResolverMethod}s used to determine each
 * {@link ColumnDataType}.
 */
const COLUMN_DATA_TYPE_SEQUENTIAL_RESOLVERS: ColumnDataTypeResolverMethod[] = [
  (cv) => cv.every(isBoolean) && COLUMN_DATA_TYPES.boolean,
  (cv) => cv.every(isNumber) && COLUMN_DATA_TYPES.number,
  (cv) => cv.every(isUJSONObject) && COLUMN_DATA_TYPES.ujsonObject,
  (cv) => cv.every(isUJSONObjectArray) && COLUMN_DATA_TYPES.ujsonObjectArray,
  (cv) => cv.every(isISODateString) && COLUMN_DATA_TYPES.stringDate, // DO NOT PLACE THIS BELOW string resolver as it will resolve all date strings as string
  (cv) => cv.every(isString) && COLUMN_DATA_TYPES.string,
] as const;

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
  const columnKeyValueMap = createColumnKeyValueMap(gridSchema.rows);
  const columnDataTypeMap = createColumnDataTypeMap(columnKeyValueMap);
  const columnDataTypeEntries = Object.entries(columnDataTypeMap);

  const columns = [];

  for (const [columnKey, columnDataType] of columnDataTypeEntries) {
    const params = {
      columnKey,
      columnDataType,
      gridSchema,
    };

    const defaultColGenerator = defaultColumnGeneratorByType[
      columnDataType
    ] as ColumnGenerator<C, ColumnDataType>;
    const customColGenerator = customColumnGeneratorByType?.[columnDataType] as
      | CustomColumnGenerator<C, ColumnDataType>
      | undefined;

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
      continue; // skip this column as data of this column is not part of actual GridData
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
