import type { PluginConfig, PluginOptions } from "#types/plugin.ts";
import type {
  GridId,
  GridIndex,
  GridOptionsWithId,
  GridSchemaWithConfig,
} from "#types/schema.ts";

export type GridStoreInternals<C extends PluginConfig> = {
  activeIndex: GridIndex;
  schemas: Array<GridSchemaWithConfig<C>>;
  pluginOptions: PluginOptions<C>;
};

export type GridStore<C extends PluginConfig> = {
  get activeIndex(): GridIndex;
  get schemas(): ReadonlyArray<GridSchemaWithConfig<C>>;
  get pluginOptions(): PluginOptions<C>;

  addSchema(options: GridOptionsWithId): void;
  clone(): GridStore<C>;
  findIndex(id: GridId): GridIndex;
  getActiveIndex(): GridIndex;
  getActiveSchema(): GridSchemaWithConfig<C>;
  getSchema(index: GridIndex): GridSchemaWithConfig<C>;
  getSchemas(): ReadonlyArray<GridSchemaWithConfig<C>>;
  isActiveSchema(gridSchema: GridSchemaWithConfig<C>): boolean;
  /**
   * Removes the schema at the given index.
   * @param index index of the schema to remove. Defaults to the active index.
   * @throws `GridError` if the index is invalid or if the store only has one schema.
   */
  removeSchema(index?: GridIndex): void;
  setActiveIndex(index: GridIndex): void;
};
