// features/otherMaster/components/OtherMasterTable.tsx
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import type { OtherMaster } from "../schemas";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OtherMasterTableProps {
  columnData: ColumnDef<OtherMaster>[];
  data: OtherMaster[];
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
}

export const OtherMasterTable = ({
  data,
  pageIndex,
  pageSize,
  isLoading,
  columnData,
}: OtherMasterTableProps) => {
  const table = useReactTable({
    data,
    columns: columnData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden bg-card border border-border rounded-sm">
      {/* Horizontal scroll container */}
      <div className="h-full overflow-x-auto">
        {/* Vertical scroll container */}
        <div className="max-h-full overflow-y-auto">
          <table className="min-w-275 w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-muted text-muted-foreground">
              {table.getHeaderGroups().map((group) => {
                return (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`border-b border-border px-3 py-2 text-left select-none
    ${header.column.getCanSort() ? "cursor-pointer" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === "asc" && (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                );
              })}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => {
                // const status = row.original.status;
                // For value based Highlight , ie: inactive Yellow
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-accent transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border px-3 py-2"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
