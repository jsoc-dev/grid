import type { ColumnKey, GridRow, GridStoreId } from "@jsoc/grid-core";
import { ChildGridToggle } from "@jsoc/vanilla-grid";
import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";
import { html, render } from "lit-html";

export type ChildGridToggleCellRendererParams = ICellRendererParams<GridRow> & {
  columnKey: ColumnKey;
  storeId: GridStoreId;
};

/**
 * AG Grid cell renderer for {@link ChildGridToggle}.
 * Pass {@link ChildGridToggleCellRendererParams} via `cellRendererParams`.
 *
 * @see https://www.ag-grid.com/javascript-data-grid/component-cell-renderer/
 */
export class ChildGridToggleCellRenderer implements ICellRendererComp<GridRow> {
  /** Root element for this cell; created once and reused across refreshes. */
  private eGui = document.createElement("div");

  init(params: ChildGridToggleCellRendererParams): void {
    // First paint uses the same path as later updates (see `refresh`).
    this.refresh(params);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  /**
   * Called when AG Grid can reuse this renderer instance (e.g. row data changed).
   * Update `eGui` in place instead of rebuilding DOM in `init`.
   *
   * @returns `true` if this instance was updated and should be kept;
   *          `false` if the grid should destroy this renderer and call `init` again.
   * @see https://www.ag-grid.com/javascript-data-grid/component-cell-renderer/#creating-custom-components
   */
  refresh(params: ChildGridToggleCellRendererParams): boolean {
    const { data: row, columnKey, storeId } = params;
    const template = row
      ? ChildGridToggle({ row, columnKey, storeId })
      : html``;
    render(template, this.eGui);
    return true;
  }
}
