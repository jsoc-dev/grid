import type { GridRow } from "@jsoc/grid-core";
import { flexRender, type Table } from "@tanstack/react-table";

export function SimpleTable({ table }: { table: Table<GridRow> }) {
  return (
    // wrapping in <div> with overflow: auto to handle horizontal scrolling,
    // because standard HTML tables do not support overflow properties directly
    <div className="table-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
