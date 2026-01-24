import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for the TableSkeleton component.
 */
interface TableSkeletonProps {
  /** Number of columns */
  columnCount: number;

  /** Number of rows to render */
  rowCount?: number;

  /** Optional minimum width class for the table */
  minWidthClassName?: string;
}

/**
 * Skeleton loader for table layouts.
 * Renders placeholder rows and columns while data is loading.
 */
export const TableSkeleton = ({
  columnCount,
  rowCount = 5,
  minWidthClassName = "min-w-175",
}: TableSkeletonProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-sm">
      <div className="flex-1 overflow-auto">
        <table
          className={`${minWidthClassName} w-full border-collapse text-sm`}
        >
          <thead className="sticky top-0 bg-muted">
            <tr>
              {Array.from({ length: columnCount }).map((_, idx) => (
                <th
                  key={idx}
                  className="border-b border-border px-3 py-2 text-left"
                >
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columnCount }).map((_, colIdx) => (
                  <td key={colIdx} className="border-b border-border px-3 py-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
