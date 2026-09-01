import type { GridRow } from "@jsoc/grid-core";
import { flexRender, type Table as ReactTable } from "@tanstack/react-table";

export function Table({ table }: { table: ReactTable<GridRow> }) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  const hasHeaders = headerGroups.some((group) => group.headers.length > 0);

  return (
    <div className="h-full overflow-auto border border-border">
      {!hasHeaders && (
        <div className="w-full py-16 italic text-center">No columns</div>
      )}
      <table className="w-max border-separate border-spacing-0">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="sticky top-0 z-10 bg-canvas px-1 py-1.5 text-center font-semibold border-b border-border"
                >
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
                <td
                  key={cell.id}
                  className="px-1 py-1.5 text-center border-b border-border"
                >
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
