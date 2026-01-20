export const OtherMasterPagination = () => {
  return (
    <div className="border-t border-border bg-muted px-3 py-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        {/* Page controls */}
        <div className="flex justify-center sm:justify-start text-xs">
          {"<< < 1 2 3 4 5 6 > >>"}
        </div>

        {/* Meta info */}
        <div className="text-center sm:text-right text-xs text-muted-foreground">
          1 / 8 • 107 items
        </div>
      </div>
    </div>
  );
};
