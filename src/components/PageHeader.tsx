import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";

interface PageHeaderProps {
  /** Page title */
  title: string;

  /** Current search value */
  globalFilter?: string;

  /** Update search value */
  setGlobalFilter?: (value: string) => void;

  /** Primary action button handler (e.g. open modal) */
  onActionClick?: () => void;

  /** Label for primary action button */
  actionLabel?: string;

  /** Placeholder for search input */
  searchPlaceholder?: string;
}

export const PageHeader = ({
  title,
  globalFilter = "",
  setGlobalFilter,
  onActionClick,
  actionLabel = "Add +",
  searchPlaceholder = "Search…",
}: PageHeaderProps) => {
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput);

  useEffect(() => {
    if (setGlobalFilter) {
      setGlobalFilter(deferredSearch);
    }
  }, [deferredSearch, setGlobalFilter]);

  return (
    <div className="border-b border-border px-4 lg:py-4 pb-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-semibold text-foreground">
          {title}
        </h1>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
          {/* Search (optional) */}
          {setGlobalFilter && (
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                className="
                  h-9 w-full
                  rounded-md border border-input
                  bg-background
                  pl-9 pr-9
                  text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring
                "
              />

              {globalFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalFilter("");
                    setSearchInput("");
                  }}
                  className="
                    absolute right-2 top-1/2
                    -translate-y-1/2
                    rounded-sm p-1
                    text-muted-foreground
                    hover:bg-accent hover:text-foreground
                  "
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Action Button (optional) */}
          {onActionClick && (
            <Button onClick={onActionClick} className="w-full sm:w-auto">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
