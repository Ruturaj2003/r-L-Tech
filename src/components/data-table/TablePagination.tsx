/**
 * Props for the TablePagination component.
 */
interface TablePaginationProps {
  /** Zero-based current page index */
  pageIndex: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of items */
  totalItems: number;

  /** Called when the page index changes */
  onPageChange: (pageIndex: number) => void;
}

/**
 * Pagination footer for tabular data.
 * Displays current page info and navigation controls.
 */
export const TablePagination = ({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="border-t border-border px-3 py-2 flex items-center justify-between text-xs">
      <div className="text-muted-foreground">
        Page {pageIndex + 1} of {totalPages} • {totalItems} items
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="px-2 py-1 border border-border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex + 1 >= totalPages}
          className="px-2 py-1 border border-border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
