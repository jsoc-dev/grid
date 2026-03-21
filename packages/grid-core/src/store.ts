import { GridError } from "#errors.ts";
import type {
  GridCellLocation,
  GridId,
  GridIndex,
  GridOptions,
  GridOptionsWithId,
  GridSchemaWithConfig,
  PluginConfig,
  PluginConfigGenerator,
  PluginConfigGeneratorOptions,
} from "#schema.ts";
import { DEFAULT_ROOT_GRID_NAME, newGridSchema } from "#schema.ts";

import { assertIsValidIndex } from "@jsoc/utils";

export type GridStoreInternals<C extends PluginConfig = PluginConfig> = {
  activeIndex: GridIndex;
  configGenerator: PluginConfigGenerator<C>;
};

export type GridStoreMethods<C extends PluginConfig = PluginConfig> = {
  addSchema(this: GridStore<C>, options: GridOptionsWithId): void;
  clone(this: GridStore<C>): GridStore<C>;
  getActiveIndex(this: GridStore<C>): GridIndex;
  getActiveSchema(this: GridStore<C>): GridSchemaWithConfig<C>;
  isActiveGrid(
    this: GridStore<C>,
    gridSchema: GridSchemaWithConfig<C>,
  ): boolean;
  removeSchema(this: GridStore<C>, index: GridIndex): void;
  setActiveIndex(this: GridStore<C>, index: GridIndex): void;
  search(
    this: GridStore<C>,
    id: GridId,
  ): {
    index: GridIndex;
    schema: GridSchemaWithConfig<C> | undefined;
  };
};

export type GridStore<C extends PluginConfig = PluginConfig> = Array<
  GridSchemaWithConfig<C>
> &
  GridStoreInternals<C> &
  GridStoreMethods<C>;

/**
 * TODO: Add docs
 */
export function newGridStore<C extends PluginConfig = PluginConfig>(
  gridOptions: GridOptions,
  configGenerator: PluginConfigGenerator<C>,
  configGeneratorOptions?: PluginConfigGeneratorOptions<C>,
): GridStore<C> {
  const rootGridSchema = newGridSchema<C>(
    {
      ...gridOptions,
      id: gridOptions.name || DEFAULT_ROOT_GRID_NAME,
    },
    configGenerator,
    configGeneratorOptions,
  );
  const schemas = [rootGridSchema];

  const internals: GridStoreInternals<C> = {
    activeIndex: 0,
    configGenerator,
  };

  const methods: GridStoreMethods<C> = {
    addSchema(options) {
      const gridSchema = newGridSchema(
        options,
        this.configGenerator,
        configGeneratorOptions,
      );
      this.splice(this.activeIndex + 1, this.length, gridSchema);
      this.setActiveIndex(this.length - 1);
    },
    clone() {
      return Object.assign([], this);
    },
    getActiveIndex() {
      return this.activeIndex;
    },
    getActiveSchema() {
      return this[this.activeIndex];
    },
    isActiveGrid(gridSchema) {
      const index = this.findIndex(
        (schema) => schema.options.id === gridSchema.options.id,
      );
      return this.activeIndex === index;
    },
    removeSchema(removeIndex) {
      assertIsValidIndex(
        this,
        removeIndex,
        new GridError(
          "Something went wrong while rendering the grid.",
          `removeIndex is invalid - ${removeIndex}`,
        ),
      );

      this.splice(removeIndex);

      if (removeIndex <= this.activeIndex) {
        this.setActiveIndex(removeIndex - 1);
      }
    },
    setActiveIndex(newActiveIndex) {
      assertIsValidIndex(
        this,
        newActiveIndex,
        new GridError(
          "Something went wrong while rendering the grid.",
          `newActiveIndex is invalid - ${newActiveIndex}`,
        ),
      );
      this.activeIndex = newActiveIndex;
    },
    search(id) {
      const index = this.findIndex((schema) => schema.options.id === id);
      const schema = this.at(index);

      return {
        isPresentInStore: index > -1,
        index,
        schema,
      };
    },
  };

  return Object.assign(schemas, { ...internals, ...methods });
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
