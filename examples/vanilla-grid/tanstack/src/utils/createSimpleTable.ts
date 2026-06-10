import "@jsoc/grid-examples-core/css/tanstack-table.css";

import type { GridRow } from "@jsoc/grid-core";

import type { Table } from "@tanstack/table-core";

/**
 * Creates a HTML table from given TanStack Table instance
 * @param table - TanStack Table instance.
 */
export function createSimpleTable(table: Table<GridRow>): HTMLElement {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const hasRows = rows.length > 0;
  const hasHeaders = headerGroups.some((group) => group.headers.length > 0);

  if (!hasRows) return createMessageBox("No rows");
  if (!hasHeaders) return createMessageBox("No columns");

  const wrapper = document.createElement("div");
  const tableElement = document.createElement("table");
  const theadElement = document.createElement("thead");
  const tbodyElement = document.createElement("tbody");
  const tfootElement = document.createElement("tfoot");

  wrapper.className = "table-wrapper";
  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);
  tableElement.appendChild(tfootElement);
  wrapper.appendChild(tableElement);

  for (const headerGroup of headerGroups) {
    const trElement = document.createElement("tr");

    for (const header of headerGroup.headers) {
      const thElement = document.createElement("th");
      const content = header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext());
      renderElement(thElement, content);
      trElement.appendChild(thElement);
    }

    theadElement.appendChild(trElement);
  }

  for (const row of rows) {
    const trElement = document.createElement("tr");

    for (const cell of row.getVisibleCells()) {
      const tdElement = document.createElement("td");
      const content = cell.column.columnDef.cell
        ? flexRender(cell.column.columnDef.cell, cell.getContext())
        : cell.getValue();
      renderElement(tdElement, content);
      trElement.appendChild(tdElement);
    }

    tbodyElement.appendChild(trElement);
  }

  return wrapper;
}

/**
 * Use this method to render headers, cells, or footers with custom markup,
 * instead of using `cell.getValue()` or `cell.renderValue()`.
 *
 * Copied from the official TanStack Table Vanilla example: {@link https://tanstack.com/table/latest/docs/framework/vanilla/examples/basic}
 */
function flexRender<TProps extends object>(comp: unknown, props: TProps) {
  if (typeof comp === "function") {
    return comp(props);
  }

  return comp;
}

function renderElement(el: HTMLElement, content: unknown) {
  // `vanilla-grid-tanstack` cell renderers return an `HTMLElement` (e.g. the
  // child-grid toggle). Plain columns return strings/numbers. Anything else
  // is coerced to a text node.
  if (content == null || content === false) return;
  if (content instanceof Node) {
    el.appendChild(content);
    return;
  }

  el.textContent = String(content);
}

/**
 * Creates a message box element with given message.
 * @param message - The message to display in the message box.
 */
function createMessageBox(message: string) {
  const div = document.createElement("div");
  div.textContent = message;
  return div;
}
