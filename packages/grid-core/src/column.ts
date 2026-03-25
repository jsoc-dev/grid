import { isFallbackPrimaryColumn } from "#primary-column.ts";
import type { GridRows, RowProperty, RowPropertyValue } from "#rows.ts";
import type { GridSchema, InferColumnType, PluginConfig } from "#schema.ts";

import {
  isArrayOfObjects,
  isBoolean,
  isISODateString,
  isNumber,
  isPlainObject,
  isString,
} from "@jsoc/utils";

/**
 * Property in a GridRow. Alias of {@link RowProperty} for column-specific helpers.
 */
export type ColumnKey = RowProperty;
/**
 * Value of a property in a GridRow. Alias of {@link RowPropertyValue} for column-specific helpers.
 */
export type ColumnValue = RowPropertyValue;
/**
 * Mapping of each {@link ColumnKey} to the collected array of {@link ColumnValue}s gathered by
 * {@link createColumnKeyValueMap}.
 */
export type ColumnKeyValueMap = Record<ColumnKey, ColumnValue[]>;
/**
 * Data type resolved for a particular {@link ColumnKey} based on the {@link GridRows} that
 * contain that column.
 */
export type ColumnDataType =
  | "arrayOfObjects"
  | "boolean"
  | "number"
  | "object"
  | "stringDate"
  | "string"
  | "unresolved";
/**
 * Method that will be used to resolve the {@link ColumnDataType} for a particular {@link ColumnKey}.
 * It receives the recorded list of {@link ColumnValue}s, and it should return `false` if the
 * {@link ColumnDataType} cannot be resolved.
 */
export type ColumnDataTypeResolverMethod = (
  columnValues: ColumnValue[],
) => ColumnDataType | false;
/**
 * Parameters supplied to a {@link ColumnGenerator}.
 */
export type ColumnGeneratorParams = {
  /**
   * `ColumnKey` of the column for which the column definition needs to be generated
   */
  columnKey: ColumnKey;
  /**
   * `ColumnDataType` of the column
   */
  columnDataType: ColumnDataType;
  /**
   * Schema of the grid that will contain the column
   */
  gridSchema: GridSchema;
};
/**
 * Generates a column definition for a particular {@link ColumnDataType}.
 */
export type ColumnGenerator<C extends PluginConfig> = (
  params: ColumnGeneratorParams,
) => InferColumnType<C>;
/**
 * Consumer-provided column generator to override the defaults for a specific {@link ColumnDataType}.
 * NOTE: It doesn't require to return the full column definition, only the properties that need to be overridden.
 */
export type CustomColumnGenerator<C extends PluginConfig> = (
  params: ColumnGeneratorParams,
) => Partial<InferColumnType<C>>;
/**
 * Mapping of `ColumnKey` and the resolved {@link ColumnDataType} for the `ColumnKey` generated
 * by {@link createColumnDataTypeMap}.
 */
export type ColumnDataTypeMap = Record<ColumnKey, ColumnDataType>;
/**
 * Mapper that contains {@link ColumnGenerator}s for all {@link ColumnDataType}s supported by the Grid UI Component.
 * Used by {@link generateColumns} to turn the {@link ColumnDataTypeMap} into column definitions.
 */
export type ColumnGeneratorByType<C extends PluginConfig> = Record<
  ColumnDataType,
  ColumnGenerator<C>
>;
/**
 * Consumer overrides used by {@link generateColumns} to replace the default {@link ColumnGenerator}s for specific {@link ColumnDataType}s.
 * Each key maps to a {@link CustomColumnGenerator}.
 */
export type CustomColumnGeneratorByType<C extends PluginConfig> = Partial<
  Record<ColumnDataType, CustomColumnGenerator<C>>
>;

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
 * Ordered list of {@link ColumnDataTypeResolverMethod}s used to determine each
 * {@link ColumnDataType}.
 */
const COLUMN_DATA_TYPE_RESOLVER_LIST: ColumnDataTypeResolverMethod[] = [
  (colValues) => colValues.every(isArrayOfObjects) && "arrayOfObjects",
  (colValues) => colValues.every(isBoolean) && "boolean",
  (colValues) => colValues.every(isNumber) && "number",
  (colValues) => colValues.every(isPlainObject) && "object",
  (colValues) => colValues.every(isISODateString) && "stringDate", // DO NOT PLACE THIS BELOW string resolver
  (colValues) => colValues.every(isString) && "string",
];

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

    let resolvedDataType: ColumnDataType = "unresolved";
    for (const method of COLUMN_DATA_TYPE_RESOLVER_LIST) {
      const returnVal = method(columnValues);
      if (returnVal) {
        resolvedDataType = returnVal;
        break;
      }
    }

    columnSchemaMap[columnKey] = resolvedDataType;
  }

  return columnSchemaMap;
}
