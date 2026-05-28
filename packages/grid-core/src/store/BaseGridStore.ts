import { BaseGridStoreError } from "#internals/BaseGridStoreError.ts";
import { BaseGridSchema } from "#store/BaseGridSchema.ts";
import type { ColumnKey } from "#types/column.ts";
import type { PluginConfig } from "#types/plugin.ts";
import type { GridRow } from "#types/rows.ts";
import type {
  GridSchema,
  GridSchemaIndex,
  GridSchemaNative,
  GridSchemaOrigin,
} from "#types/schema.ts";
import type {
  GridStore,
  GridStoreId,
  GridStoreListener,
  GridStoreOptions,
  GridStoreState,
} from "#types/store.ts";
import { getRowIdString } from "#utils/rows.ts";

import { assertIsValidIndex, uuid } from "@jsoc/utils";

export class BaseGridStore<C extends PluginConfig> implements GridStore<C> {
  public readonly id: GridStoreId;
  public readonly options: GridStoreOptions<C>;
  #listeners = new Set<GridStoreListener<C>>();
  #state: GridStoreState<C> = {
    activeIndex: -1,
    schemas: [],
  };

  public constructor(options: GridStoreOptions<C>) {
    this.options = Object.freeze(options);
    this.id = uuid();

    if (options.listener) this.subscribe(options.listener);

    this.beforeInit();
    this.init();
  }

  /**
   * Hook invoked before the store is initialized.
   * Ovveride this to perform any custom logic that must run before the init() method.
   */
  protected beforeInit() {}

  /**
   * Initializes the store with a root schema.
   */
  protected init() {
    const rootSchema = this.newSchema();

    this.#setState({
      activeIndex: 0,
      schemas: [rootSchema],
    });
  }

  /**
   * Creates a new schema. This method has protected access modifier to allow
   * subclasses to override it and provide a custom schema implementation if needed.
   * @param origin - The origin of the schema.
   * @returns A new schema.
   */
  protected newSchema(origin?: GridSchemaOrigin) {
    return new BaseGridSchema<C>(this, origin);
  }

  protected getSchemaIndex(schema: GridSchema) {
    return this.getSchemas().findIndex((s) => s.id === schema.id);
  }

  public addChildSchema(origin: GridSchemaOrigin) {
    if (this.getTotalSchemas() === 0) {
      throw new BaseGridStoreError(
        "Invalid Operation",
        "Root schema must be added before adding a child schema.",
      );
    }

    const currentSchemas = this.getSchemas();
    const currentActiveIndex = this.getActiveIndex();
    const childSchema = this.newSchema(origin);

    const schemas = currentSchemas
      .slice(0, currentActiveIndex + 1)
      .concat(childSchema);

    this.#setState({
      activeIndex: currentActiveIndex + 1,
      schemas,
    });
  }

  // TODO: Make the store unusable after destruction.
  public destroy() {
    this.#listeners.clear();
  }

  public getActiveIndex() {
    return this.#state.activeIndex;
  }

  public getActiveSchema() {
    return this.getSchema(this.getActiveIndex());
  }

  public getChildSchemaOrigin(
    row: GridRow,
    columnKey: ColumnKey,
    parentSchema: GridSchemaNative<C> = this.getActiveSchema(),
  ): GridSchemaOrigin {
    BaseGridSchema.assertInstance(parentSchema);

    return {
      parent: parentSchema,
      cell: {
        rowId: getRowIdString(row, parentSchema.primaryColumnKey),
        columnKey,
      },
    };
  }

  public getChildSchema(origin: GridSchemaOrigin) {
    const targetId = BaseGridSchema.generateId(origin);
    return this.getSchemas().find((schema) => schema.id === targetId);
  }

  public getSchema(index: GridSchemaIndex) {
    const schemas = this.getSchemas();

    assertIsValidIndex(
      schemas,
      index,
      new BaseGridStoreError(
        "Invalid Operation",
        `Given index ${index} is out of bounds.`,
      ),
    );

    return schemas[index];
  }

  public getSchemas() {
    return this.#state.schemas;
  }

  public getTotalSchemas() {
    return this.getSchemas().length;
  }

  public getTotalChildSchemas() {
    return this.getTotalSchemas() - 1;
  }

  public isActiveSchema(schema: GridSchemaNative<C>) {
    return this.getActiveSchema().id === schema.id;
  }

  public hasChildSchema(origin: GridSchemaOrigin) {
    return this.getChildSchema(origin) !== undefined;
  }

  public removeChildSchema(childSchema?: GridSchemaNative<C>) {
    if (this.getTotalSchemas() <= 1) {
      throw new BaseGridStoreError(
        "Invalid Operation",
        "There are no child grid schemas present in the store.",
      );
    }

    if (childSchema === undefined) {
      childSchema = this.getActiveSchema();
    }

    const currentSchemas = this.getSchemas();
    const index = this.getSchemaIndex(childSchema);

    assertIsValidIndex(
      currentSchemas,
      index,
      new BaseGridStoreError(
        "Invalid Action",
        `Invalid index ${index} for removing schema`,
      ),
    );

    const schemas = currentSchemas.toSpliced(index, 1);

    if (index <= this.getActiveIndex()) {
      const nextIndex = index - 1;
      const activeIndex = nextIndex >= 0 ? nextIndex : 0;

      this.#setState({ activeIndex, schemas });
    } else {
      this.#setState({ schemas });
    }
  }

  public setActiveIndex(activeIndex: number) {
    if (this.getActiveIndex() === activeIndex) {
      return;
    }

    assertIsValidIndex(
      this.getSchemas(),
      activeIndex,
      new BaseGridStoreError(
        "Invalid Operation",
        `Given active index ${activeIndex} is out of bounds.`,
      ),
    );

    this.#setState({ activeIndex });
  }

  public subscribe(listener: GridStoreListener<C>) {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  public toggleChildSchema(origin: GridSchemaOrigin) {
    const childSchema = this.getChildSchema(origin);

    if (childSchema) {
      this.removeChildSchema(childSchema);
    } else {
      this.addChildSchema(origin);
    }
  }

  #notify(previousState: GridStoreState<C>, state: GridStoreState<C>) {
    for (const listener of this.#listeners) {
      listener({
        gridStore: this,
        previousState,
        state,
      });
    }
  }

  #setState(state: Partial<GridStoreState<C>>) {
    const previousState = this.#state;
    this.#state = {
      ...previousState,
      ...state,
    };

    this.#notify(previousState, this.#state);
  }
}
