import "#ui/components/preview/table.css";
import type { GridRow } from "@jsoc/grid-core";
import { flexRender, type Table } from "@tanstack/react-table";

export function Table({ table }: { table: Table<GridRow> }) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const hasRows = rows.length > 0;
  const hasHeaders = headerGroups.some((group) => group.headers.length > 0);

  if (!hasRows) return <p className="message">No rows</p>;
  if (!hasHeaders) return <p className="message">No columns</p>;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
