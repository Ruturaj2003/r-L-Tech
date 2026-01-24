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

import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/components/data-table/TablePagination";
import { TableSkeleton } from "@/components/data-table/TableSkeleton";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading: boolean;

  globalFilter: string;
  setGlobalFilter: (value: string) => void;

  /** Optional table label for accessibility */
  ariaLabel?: string;

  /** Page size */
  pageSize?: number;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  globalFilter,
  setGlobalFilter,
  ariaLabel = "Data table",
  pageSize = 10,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  // UX: only one filter open at a time
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,

    state: {
      columnFilters,
      sorting,
      pagination,
      globalFilter,
    },

    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  if (isLoading) {
    return <TableSkeleton columnCount={columns.length} rowCount={5} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-sm">
      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <table
          role="table"
          aria-label={ariaLabel}
          aria-busy={isLoading}
          className="min-w-175 w-full border-collapse text-sm"
        >
          <thead className="sticky top-0 bg-muted text-muted-foreground z-10">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const isFilterOpen = openFilterId === header.column.id;
                  const hasFilterValue = !!header.column.getFilterValue();

                  return (
                    <th
                      key={header.id}
                      className="relative border-b border-border px-3 py-2 align-top text-left"
                    >
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

                        {header.column.getCanFilter() && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilterId((prev) =>
                                prev === header.column.id
                                  ? null
                                  : header.column.id,
                              );
                            }}
                            className={cn(
                              "transition-colors",
                              hasFilterValue
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                            title="Filter"
                          >
                            <Search className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {isFilterOpen && (
                        <div
                          className="absolute left-0 mt-2 z-50 w-50 rounded-md border border-border bg-card p-2 shadow-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            <Search className="h-4 w-4 text-muted-foreground" />

                            <input
                              autoFocus
                              value={
                                (header.column.getFilterValue() ?? "") as string
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder="Search"
                              className="h-8 w-full bg-background px-2 text-sm outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                header.column.setFilterValue(undefined);
                                setOpenFilterId(null);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                              title="Clear filter"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
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

      <TablePagination
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        totalItems={table.getFilteredRowModel().rows.length}
        onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
      />
    </div>
  );
}
