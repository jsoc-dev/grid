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
      <table className="w-max border-collapse">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-1 py-1.5 text-center font-semibold"
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
            <tr key={row.id} className="border-b border-border">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-1 py-1.5 text-center">
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
