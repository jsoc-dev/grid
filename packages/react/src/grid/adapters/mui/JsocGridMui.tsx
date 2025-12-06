import { JsocGridContext } from "../../JsocGrid";
import { COLUMN_FACTORY_MUI } from "./";
import { JsocGridError } from "@jsoc/core/errors";
import { SubsetKeysOf } from "@jsoc/core/utils";
import {
  generateColumns,
  CustomColumnFactory,
  GridId,
  searchGridSchema,
} from "@jsoc/core/grid";
import { useContext, useMemo } from "react";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  type GridRowIdGetter,
} from "@mui/x-data-grid";

//#region props
/**
 * Props that customise the `JsocGrid` features
 * These props are not part of DataGridProps as they don't exist in MUI DataGrid
 */
export type JsocGridMuiCustomProps = {
  /**
   * Name for the root grid. This is used by the default navigator to indicate whether
   * root grid is active or not.
   * - Note: This prop is managed by `JsocGrid` and always has a value even if you don't
   * 	provide any value.
   */
  gridId?: GridId;
  /**
   * Object containing 0 or more custom `ColumnDefinitionProvider`s to override the
   * corresponding default `ColumnDefinitionProvider`s for the `ColumnDataType`.
   */
  columnFactory?: CustomColumnFactory<GridColDef>;
};

/**
 * Props that are dynamically injected by the adapter `JsocGridMui` into the `DataGrid`
 * These props are subset of `DataGridProps` but not required to be supplied by the consumer.
 * If provided, will be overridden by the dynamically injected values. (The API reference
 * used to be injected here as well but was removed because it was causing React warnings.)
 */
export type JsocGridMuiInjectedPropNames = SubsetKeysOf<
  DataGridProps,
  "rows" | "columns" | "getRowId"
>;
export type JsocGridMuiInjectedProps = Pick<
  DataGridProps,
  JsocGridMuiInjectedPropNames
>;

/**
 * The public adapter component props that will be supplied by the consumer.
 */
export type JsocGridMuiProps = {
  native?: Omit<DataGridProps, JsocGridMuiInjectedPropNames>;
  custom?: JsocGridMuiCustomProps;
};
//#endregion

/**
 * Adapter component for MUI DataGrid
 */
export function JsocGridMui({ native = {}, custom = {} }: JsocGridMuiProps) {
  if (!custom.gridId) {
    throw new JsocGridError(
      "An internal error occured. JsocGrid didn't provide the gridId to the adapter.",
    );
  }

  const { gridSchemaStore } = useContext(JsocGridContext);
  const { gridSchema } = searchGridSchema(gridSchemaStore, custom.gridId);
  const { gridRows, gridIdColumnKey } = gridSchema;
  const getRowId: GridRowIdGetter = (row) => row[gridIdColumnKey];

  /**
   * Memoising col defs to persist column states. Also suggested at official docs:
   * https://mui.com/x/react-data-grid/column-definition/#:~:text=The%20columns%20prop%20should,function%20or%20memoize%20it.
   */
  const columns = useMemo(
    () => generateColumns(gridSchema, COLUMN_FACTORY_MUI, custom.columnFactory),
    // re-generate only when current gridSchema or columnFactory prop changes
    [gridSchema, custom.columnFactory],
  );

  return (
    <DataGrid
      {...native}
      rows={gridRows}
      getRowId={getRowId}
      columns={columns}
    />
  );
}

