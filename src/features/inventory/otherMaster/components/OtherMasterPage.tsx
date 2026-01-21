import { useState } from "react";
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { otherMasterColumns } from "./OtherMaster.colums";
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterTable } from "./OtherMasterTable";

const OtherMasterPage = () => {
  const subscID = 1;
  const { data = [], isLoading } = useOtherMastersQuery(subscID);
  const columnData = otherMasterColumns;

  // Global filter state
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        <OtherMasterHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <OtherMasterTable
          columnData={columnData}
          data={data}
          isLoading={isLoading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </div>
  );
};

export default OtherMasterPage;
