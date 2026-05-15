import { GridCoreError } from "#internals/GridCoreError.ts";
import type { ColumnDataType, ColumnValueByDataType, PrimaryColumnKey } from "#types/column.ts";
import type { PluginConfig } from "#types/plugin.ts";
import type { GridRow, GridRowId, GridRows } from "#types/rows.ts";
import type {
  GridCellLocation,
  GridId,
  GridSchema,
  GridSchemaNative,
  GridSchemaOrigin,
} from "#types/schema.ts";
import type { GridStore } from "#types/store.ts";
import { generateRows } from "#utils/rows.ts";

export class BaseGridSchema<
  C extends PluginConfig,
> implements GridSchemaNative<C> {
  readonly id: GridId;
  readonly config: C;
  readonly primaryColumnKey: PrimaryColumnKey;
  readonly origin?: GridSchemaOrigin;
  readonly rows: GridRows;
  readonly store: GridStore<C>;

  readonly #rowsById: ReadonlyMap<GridRowId, GridRow>;

  constructor(store: GridStore<C>, origin?: GridSchemaOrigin) {
    const id = origin ? BaseGridSchema.generateId(origin) : "root";
    const data = origin
      ? origin.parent.getCellValue<"ujsonObject" | "ujsonObjectArray">(
          origin.cell,
        )
      : store.data;
    const { rows, primaryColumnKey, rowsById } = generateRows(data);

    this.id = id;
    this.store = store;
    this.origin = origin;

    this.rows = rows;
    this.primaryColumnKey = primaryColumnKey;
    this.#rowsById = rowsById;

    this.config = store.pluginOptions.configGenerator(
      this,
      store.pluginOptions.configGeneratorOptions,
    );
  }

  /**
   * Asserts that {@link gridSchema} is a {@link BaseGridSchema} instance.
   */
  public static assertInstance<C extends PluginConfig>(
    gridSchema: GridSchema,
  ): asserts gridSchema is BaseGridSchema<C> {
    if (!(gridSchema instanceof BaseGridSchema)) {
      throw new GridCoreError(
        "Invalid grid schema",
        "Not a valid grid schema instance.",
      );
    }
  }

  /**
   * Creates a unique id to uniquely identify a `GridSchema` inside the `GridStore`.
   * It uses combination of parent grid id and parent grid cell location to prevent name conflicts.
   */
  public static generateId(origin: GridSchemaOrigin): GridId {
    const { parent, cell } = origin;
    const { rowId, columnKey } = cell;

    return `${parent.id}[${rowId}].${columnKey}`;
  }

  public getCellValue<D extends ColumnDataType>(
    cell: GridCellLocation,
  ): ColumnValueByDataType[D] {
    const row = this.#rowsById.get(cell.rowId);

    if (!row) {
      throw new GridCoreError(
        "Invalid rowId",
        `Cannot find row with rowId ${cell.rowId} in schema ${this.id}.`,
      );
    }

    const value = row[cell.columnKey];
    return value as ColumnValueByDataType[D];
  }

}
