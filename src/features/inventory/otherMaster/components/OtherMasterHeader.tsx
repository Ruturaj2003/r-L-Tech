import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface OtherMasterHeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export const OtherMasterHeader = ({
  globalFilter,
  setGlobalFilter,
}: OtherMasterHeaderProps) => {
  return (
    <div className="border-b border-border px-4 lg:py-4 pb-1 ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-semibold text-foreground">
          Other Master
        </h1>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="h-9 w-full rounded border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Add Button */}
          <Button className="w-full sm:w-auto">Add +</Button>
        </div>
      </div>
    </div>
  );
};
