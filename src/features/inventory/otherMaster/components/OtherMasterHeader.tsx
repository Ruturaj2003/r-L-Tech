import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface OtherMasterHeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export const OtherMasterHeader = ({
  globalFilter,
  setGlobalFilter,
}: OtherMasterHeaderProps) => {
  return (
    <div className="border-b border-border px-4 lg:py-4 pb-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-semibold text-foreground">
          Other Master
        </h1>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            {/* Left icon */}
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            {/* Input */}
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search…"
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

            {/* Clear button */}
            {globalFilter && (
              <button
                type="button"
                onClick={() => setGlobalFilter("")}
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

          {/* Add Button */}
          <Button className="w-full sm:w-auto">Add +</Button>
        </div>
      </div>
    </div>
  );
};
