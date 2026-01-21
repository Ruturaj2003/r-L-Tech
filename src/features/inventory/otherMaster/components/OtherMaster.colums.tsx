import type { ColumnDef } from "@tanstack/react-table";

import type { OtherMaster } from "../schemas";
import { Eye, Pencil, Trash } from "lucide-react";

export const otherMasterColumns: ColumnDef<OtherMaster>[] = [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => row.index + 1,
    size: 60,
  },

  {
    accessorKey: "masterType",
    header: "Type",
    enableColumnFilter: false,
  },
  {
    accessorKey: "masterType",
    header: "Type",
    enableColumnFilter: false,
  },
  {
    accessorKey: "masterName",
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const value = getValue<"Y" | "N">();

      return (
        <span
          className={
            value === "Y"
              ? "inline-flex rounded px-2 py-0.5 text-xs bg-success text-success-foreground "
              : "inline-flex rounded px-2 py-0.5 text-xs bg-muted text-muted-foreground"
          }
        >
          {value === "Y" ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    // So that Actions Come in Center
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
      const id = row.original.mTransNo;
      console.log("Temp Log from otherMaster Colums", id);

      return (
        <div className="flex items-center justify-center gap-2">
          <button
            title="View"
            className="h-7 w-7 rounded-md flex items-center justify-center
                       bg-accent text-accent-foreground
                       focus:ring-2 focus:ring-ring"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            title="Edit"
            className="h-7 w-7 rounded-md flex items-center justify-center
                       bg-accent text-primary
                       focus:ring-2 focus:ring-ring"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            title="Delete"
            className="h-7 w-7 rounded-md flex items-center justify-center
                        text-destructive
                       focus:ring-2 focus:ring-ring"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];
