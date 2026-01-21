import { useState } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import type { OtherMaster } from "../schemas";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface OtherMasterTableProps {
  columnData: ColumnDef<OtherMaster>[];
  data: OtherMaster[];
  isLoading: boolean;
}

export const OtherMasterTable = ({
  data,
  isLoading,
  columnData,
}: OtherMasterTableProps) => {
  /* -----------------------------
     TanStack controlled state
  ------------------------------*/
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // NEW: Track which column filters are "open" (showing input)
  const [openFilters, setOpenFilters] = useState<Set<string>>(new Set());

  /* -----------------------------
     Table instance
  ------------------------------*/
  const table = useReactTable({
    data,
    columns: columnData,

    state: {
      columnFilters,
      sorting,
      pagination,
    },

    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  /* -----------------------------
     Render
  ------------------------------*/
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-sm">
      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-175 w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-muted text-muted-foreground">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const isFilterOpen = openFilters.has(header.column.id);

                  return (
                    <th
                      key={header.id}
                      className="border-b border-border px-3 py-2 align-top text-left"
                    >
                      {/* HEADER LINE */}
                      <div className="flex items-center gap-2">
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 font-medium hover:text-foreground"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUp className="h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}

                        {/* FILTER ICON */}
                        {header.column.getCanFilter() && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilters((prev) => {
                                const newSet = new Set(prev);
                                if (isFilterOpen) {
                                  newSet.delete(header.column.id);
                                } else {
                                  newSet.add(header.column.id);
                                }
                                return newSet;
                              });
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            title="Filter"
                          >
                            <Search className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* FILTER INPUT */}
                      {isFilterOpen && (
                        <div className="mt-2 flex items-center gap-1">
                          <input
                            autoFocus
                            value={
                              (header.column.getFilterValue() ?? "") as string
                            }
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                            placeholder="Search…"
                            className="h-8 w-full rounded border border-input bg-background px-2 text-sm"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              header.column.setFilterValue(undefined);
                              setOpenFilters((prev) => {
                                const newSet = new Set(prev);
                                newSet.delete(header.column.id);
                                return newSet;
                              });
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            title="Clear filter"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-accent transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-border px-3 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="py-6 text-center text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs">
        <div className="text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border border-border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border border-border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
