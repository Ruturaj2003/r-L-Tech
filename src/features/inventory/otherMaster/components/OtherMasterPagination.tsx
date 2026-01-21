interface OtherMasterPaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
}

export const OtherMasterPagination = ({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
}: OtherMasterPaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return (
    <div className="border-t border-border bg-muted px-3 py-2 flex items-center justify-between text-xs">
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
