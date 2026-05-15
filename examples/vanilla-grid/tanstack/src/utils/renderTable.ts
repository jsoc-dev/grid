import type { GridRow } from "@jsoc/grid-core";
import type { Table } from "@tanstack/table-core";

export function renderTable(table: Table<GridRow>, container: HTMLElement) {
  const tableElement = document.createElement("table");
  const theadElement = document.createElement("thead");
  const tbodyElement = document.createElement("tbody");
  const tfootElement = document.createElement("tfoot");

  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);
  tableElement.appendChild(tfootElement);

  for (const headerGroup of table.getHeaderGroups()) {
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

  for (const row of table.getRowModel().rows) {
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

  container.replaceChildren(tableElement);
}

/**
 * If rendering headers, cells, or footers with custom markup, use flexRender instead of `cell.getValue()` or `cell.renderValue()`.
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
