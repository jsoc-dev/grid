import "@jsoc/grid-examples-core/css/tanstack-table.css";

import type { GridRow } from "@jsoc/grid-core";
import { flexRender, type Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

export function TanstackTable({ table }: { table: Table<GridRow> }) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const hasRows = rows.length > 0;
  const hasHeaders = headerGroups.some((group) => group.headers.length > 0);

  if (!hasRows) return <TableWrapper>No rows</TableWrapper>;
  if (!hasHeaders) return <TableWrapper>No columns</TableWrapper>;

  return (
    // wrapping in <div> with overflow: auto to handle horizontal scrolling,
    // because standard HTML tables do not support overflow properties directly
    <TableWrapper>
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
    </TableWrapper>
  );
}

function TableWrapper({ children }: { children: ReactNode }) {
  return <div className="table-wrapper">{children}</div>;
}
