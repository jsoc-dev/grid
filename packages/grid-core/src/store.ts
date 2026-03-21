import { GridError } from "#errors.ts";
import type {
  GridCellLocation,
  GridId,
  GridIndex,
  GridOptions,
  GridOptionsWithId,
  GridSchemaWithConfig,
  PluginConfig,
  PluginOptions,
} from "#schema.ts";
import { DEFAULT_ROOT_GRID_NAME, newGridSchema } from "#schema.ts";

import { assertIsValidIndex } from "@jsoc/utils";

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
  removeSchema(index: GridIndex): void;
  setActiveIndex(index: GridIndex): void;
};

/**
 * TODO: Add docs
 */
export function newGridStore<C extends PluginConfig = PluginConfig>(
  gridOptions: GridOptions,
  pluginOptions: PluginOptions<C>,
): GridStore<C> {
  const rootGridSchema = newGridSchema<C>(
    { id: gridOptions.name || DEFAULT_ROOT_GRID_NAME, ...gridOptions },
    pluginOptions,
  );

  return createStoreWithInternals({
    activeIndex: 0,
    pluginOptions,
    schemas: [rootGridSchema],
  });
}

function createStoreWithInternals<C extends PluginConfig>(
  internals: GridStoreInternals<C>,
): GridStore<C> {
  const localSchemas = internals.schemas;
  let localActiveIndex = internals.activeIndex;
  const localPluginOptions = Object.freeze(internals.pluginOptions);

  const store: GridStore<C> = {
    get activeIndex() {
      return localActiveIndex;
    },

    get schemas() {
      return [...localSchemas];
    },

    get pluginOptions() {
      return localPluginOptions;
    },

    addSchema(options) {
      const schema = newGridSchema(options, localPluginOptions);
      // using the local schemas which is mutable
      localSchemas.splice(localActiveIndex + 1, localSchemas.length, schema);
      localActiveIndex++;
    },

    clone() {
      return createStoreWithInternals({
        activeIndex: localActiveIndex,
        schemas: [...localSchemas],
        pluginOptions: localPluginOptions,
      });
    },

    findIndex(id) {
      return localSchemas.findIndex((s) => s.options.id === id);
    },

    getActiveIndex() {
      return localActiveIndex;
    },

    getActiveSchema() {
      return localSchemas[localActiveIndex];
    },

    getSchema(index) {
      return localSchemas[index];
    },

    getSchemas() {
      return [...localSchemas];
    },

    isActiveSchema(schema) {
      const index = localSchemas.findIndex(
        (s) => s.options.id === schema.options.id,
      );
      return localActiveIndex === index;
    },

    removeSchema(removeIndex) {
      assertIsValidIndex(
        localSchemas,
        removeIndex,
        new GridError(
          "Something went wrong while rendering the grid.",
          `removeIndex is invalid - ${removeIndex}`,
        ),
      );

      localSchemas.splice(removeIndex);

      if (removeIndex <= localActiveIndex) {
        const nextIndex = removeIndex - 1;
        const newActiveIndex = nextIndex >= 0 ? nextIndex : 0;
        localActiveIndex = newActiveIndex;
      }
    },

    setActiveIndex(newActiveIndex) {
      assertIsValidIndex(
        localSchemas,
        newActiveIndex,
        new GridError(
          "Something went wrong while rendering the grid.",
          `newActiveIndex is invalid - ${newActiveIndex}`,
        ),
      );

      localActiveIndex = newActiveIndex;
    },
  };

  return store;
}

/**
 * Creates a unique id to uniquely identify a `GridSchema` inside the `GridStore`.
 * It uses combination of parentGridId and parentGridCellLocation to prevent name conflicts.
 * @param parentGridId id of the parent grid
 * @param parentGridCellLocation row id and column key from which the sub grid is created
 * @returns `SubGridId`
 */
export function createSubGridId(
  parentGridId: GridId,
  parentGridCellLocation: GridCellLocation,
) {
  const { rowId, columnKey } = parentGridCellLocation;
  const prefix = `${parentGridId}[${rowId}]`;

  return [prefix, columnKey].join(".");
}
