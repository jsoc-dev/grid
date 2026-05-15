import type { InferColumnType, PluginConfig } from "#types/plugin.ts";
import type { RowProperty, RowPropertyValue } from "#types/rows.ts";
import type { GridSchema } from "#types/schema.ts";

import type { UJSONObject, UJSONObjectArray, UJSONValue } from "@jsoc/utils";

/**
 * Property in a GridRow. Alias of {@link RowProperty} for column-specific helpers.
 */
export type ColumnKey = RowProperty;

/**
 * Value of a property in a GridRow. Alias of {@link RowPropertyValue} for column-specific helpers.
 */
export type ColumnValue = RowPropertyValue;

export type ColumnValueByDataType = {
  boolean: boolean;
  number: number;
  string: string;
  stringDate: string;
  ujsonObject: UJSONObject;
  ujsonObjectArray: UJSONObjectArray;
  ujsonValue: UJSONValue;
}

/**
 * Mapping of each {@link ColumnKey} to the collected array of {@link ColumnValue}s gathered by
 * {@link createColumnKeyValueMap}.
 */
export type ColumnKeyValueMap = Record<ColumnKey, ColumnValue[]>;

/**
 * Data type resolved for a particular {@link ColumnKey} based on the {@link GridRows} that
 * contain that column.
 */
export type ColumnDataType = keyof ColumnValueByDataType;

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
export type ColumnGeneratorParams<D extends ColumnDataType> = {
  /**
   * `ColumnKey` of the column for which the column definition needs to be generated
   */
  columnKey: ColumnKey;
  /**
   * `ColumnDataType` of the column
   */
  columnDataType: D;
  /**
   * {@link GridSchema} that this column belongs to.
   */
  gridSchema: GridSchema;
};

/**
 * Generates a column definition for a particular {@link ColumnDataType}.
 */
export type ColumnGenerator<C extends PluginConfig, D extends ColumnDataType> = (
  params: ColumnGeneratorParams<D>,
) => InferColumnType<C>;

/**
 * Consumer-provided column generator to override the defaults for a specific {@link ColumnDataType}.
 * NOTE: It doesn't require to return the full column definition, only the properties that need to be overridden.
 */
export type CustomColumnGenerator<C extends PluginConfig, D extends ColumnDataType> = (
  params: ColumnGeneratorParams<D>,
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
export type ColumnGeneratorByType<C extends PluginConfig> = {
  [D in ColumnDataType]: ColumnGenerator<C, D>;
}

/**
 * Consumer overrides used by {@link generateColumns} to replace the default {@link ColumnGenerator}s for specific {@link ColumnDataType}s.
 * Each key maps to a {@link CustomColumnGenerator}.
 */
export type CustomColumnGeneratorByType<C extends PluginConfig> = {
  [D in ColumnDataType]?: CustomColumnGenerator<C, D>;
}

/**
 * Property that has a unique value for all the {@link GridRows}.
 */
export type PrimaryColumnKey = ColumnKey;
