import type { GridRow } from "@jsoc/grid-core";
import { flexRender, type Table } from "@tanstack/react-table";

export function SimpleTable({ table }: { table: Table<GridRow> }) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const hasRows = rows.length > 0;
  const hasHeaders = headerGroups.some((group) => group.headers.length > 0);

  if (!hasRows) return <p>No rows</p>;
  if (!hasHeaders) return <p>No columns</p>;

  return (
    // wrapping in <div> with overflow: auto to handle horizontal scrolling,
    // because standard HTML tables do not support overflow properties directly
    <div className="table-container">
      <table>
        <thead>
          {headerGroups.map((hg) => (
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
          {rows.map((row) => (
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
