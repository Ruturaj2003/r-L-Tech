import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/DataTable";
import type { OtherMasterEntity } from "../schemas";

interface OtherMasterTableProps {
  columnData: ColumnDef<OtherMasterEntity>[];
  data: OtherMasterEntity[];
  isLoading: boolean;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export const OtherMasterTable = (props: OtherMasterTableProps) => {
  return (
    <DataTable<OtherMasterEntity>
      columns={props.columnData}
      data={props.data}
      isLoading={props.isLoading}
      globalFilter={props.globalFilter}
      setGlobalFilter={props.setGlobalFilter}
      ariaLabel="Other Master table"
    />
  );
};
