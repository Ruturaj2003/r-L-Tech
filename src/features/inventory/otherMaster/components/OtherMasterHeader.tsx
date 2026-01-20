import { Button } from "@/components/ui/button";

export const OtherMasterHeader = () => {
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
          <div className="h-10 w-full sm:w-48 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
            Search
          </div>

          {/* Add Button */}
          <Button className="w-full sm:w-auto">Add +</Button>
        </div>
      </div>
    </div>
  );
};
