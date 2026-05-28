import type { ColumnKey } from "#types/column.ts";
import type {
  PluginConfig,
  PluginConfigGenerator,
  PluginConfigGeneratorOptions,
} from "#types/plugin.ts";
import type { GridRow } from "#types/rows.ts";
import type {
  GridData,
  GridSchemaIndex,
  GridSchemaNative,
  GridSchemaOrigin,
} from "#types/schema.ts";

export type GridStoreId = string;

export interface GridStoreOptions<C extends PluginConfig = PluginConfig> {
  data: GridData;
  configGenerator: PluginConfigGenerator<C>;
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>;
  listener?: GridStoreListener<C>;
}

export type PluginGridStoreOptions<C extends PluginConfig = PluginConfig> =
  Omit<GridStoreOptions<C>, "configGenerator">;

/**
 * GridStore API.
 */
export interface GridStore<C extends PluginConfig = PluginConfig> {
  readonly id: GridStoreId;
  readonly options: GridStoreOptions<C>;

  /**
   * Adds a new child grid schema to the store.
   * @throws `BaseGridStoreError` if no root grid schema is present in the store.
   */
  addChildSchema(origin: GridSchemaOrigin): void;
  /**
   * Destroys the store.
   */
  destroy(): void;
  /**
   * Gets the active index.
   */
  getActiveIndex(): GridSchemaIndex;
  /**
   * Gets the currently active grid schema.
   */
  getActiveSchema(): GridSchemaNative<C>;
  /**
   * Builds a {@link GridSchemaOrigin} for a cell on the given parent schema (active schema by default).
   */
  getChildSchemaOrigin(
    row: GridRow,
    columnKey: ColumnKey,
    parentSchema?: GridSchemaNative<C>,
  ): GridSchemaOrigin;
  /**
   * Gets the child grid schema opened from the given cell on the parent schema.
   */
  getChildSchema(origin: GridSchemaOrigin): GridSchemaNative<C> | undefined;
  /**
   * Gets the grid schema at the given index.
   * @param index index of the grid schema
   * @throws `BaseGridStoreError` if the index is invalid
   */
  getSchema(index: GridSchemaIndex): GridSchemaNative<C>;
  /**
   * Gets all grid schemas on the current navigation path.
   */
  getSchemas(): ReadonlyArray<GridSchemaNative<C>>;
  /**
   * Gets the number of grid schemas in the store.
   */
  getTotalSchemas(): number;
  /**
   * Gets the number of child grid schemas in the store.
   */
  getTotalChildSchemas(): number;
  /**
   * Returns whether a child schema exists on the navigation path for the given parent cell.
   */
  hasChildSchema(origin: GridSchemaOrigin): boolean;
  /**
   * Checks if the given grid schema is the active schema.
   */
  isActiveSchema(gridSchema: GridSchemaNative<C>): boolean;
  /**
   * Removes the given child schema.
   * If no child schema is provided, it removes the active child schema.
   * @throws `BaseGridStoreError` if the store has no child schemas.
   */
  removeChildSchema(childSchema?: GridSchemaNative<C>): void;
  /**
   * Sets the active index.
   * @param index new active index
   * @throws `BaseGridStoreError` if the index is invalid.
   */
  setActiveIndex(index: GridSchemaIndex): void;
  /**
   * Opens a child schema for the given cell, or closes it when already open.
   */
  toggleChildSchema(origin: GridSchemaOrigin): void;
  /**
   * Adds a listener to the store. Listener is called on every state change.
   * @param listener listener to add
   * @returns function that removes the listener from store when invoked
   */
  subscribe(listener: GridStoreListener<C>): () => void;
}

/**
 * Internal state of {@link GridStore}.
 */
export type GridStoreState<C extends PluginConfig> = Readonly<{
  activeIndex: GridSchemaIndex;
  schemas: ReadonlyArray<GridSchemaNative<C>>;
}>;

/**
 * Params object passed to a {@link GridStoreListener}.
 */
export type GridStoreListenerParams<C extends PluginConfig = PluginConfig> = {
  gridStore: GridStore<C>;
  previousState: GridStoreState<C>;
  state: GridStoreState<C>;
};

/**
 * Listener which gets called when the state of the bound {@link GridStore} changes.
 */
export type GridStoreListener<C extends PluginConfig = PluginConfig> = (
  params: GridStoreListenerParams<C>,
) => void;
