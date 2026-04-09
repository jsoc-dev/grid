import { DEFAULT_ROOT_GRID_NAME } from "#constants.ts";
import { GridError } from "#helpers/errors.ts";
import { newGridSchema } from "#helpers/schema.ts";
import type { PluginConfig, PluginOptions } from "#types/plugin.ts";
import type { GridCellLocation, GridId, GridOptions } from "#types/schema.ts";
import type { GridStore, GridStoreInternals } from "#types/store.ts";

import { assertIsValidIndex } from "@jsoc/utils";

/**
 * Creates a new {@link GridStore}.
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

// https://chatgpt.com/share/69c25775-a7d0-800c-817e-4aae4314b5fb
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

    removeSchema(index = localActiveIndex) {
      if (localSchemas.length === 1) {
        throw new GridError(
          "Invalid Grid Action",
          `Root grid schema is not allowed to remove.`,
        );
      }

      assertIsValidIndex(
        localSchemas,
        index,
        new GridError(
          "Invalid Grid Action",
          `Invalid index ${index} for removing schema`,
        ),
      );

      localSchemas.splice(index);

      if (index <= localActiveIndex) {
        const nextIndex = index - 1;
        const newActiveIndex = nextIndex >= 0 ? nextIndex : 0;
        localActiveIndex = newActiveIndex;
      }
    },

    setActiveIndex(newActiveIndex) {
      assertIsValidIndex(
        localSchemas,
        newActiveIndex,
        new GridError(
          "Invalid Grid Action",
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
