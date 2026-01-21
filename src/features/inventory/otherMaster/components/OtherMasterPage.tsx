import { useState } from "react";
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterPagination } from "./OtherMasterPagination";
import { OtherMasterTable } from "./OtherMasterTable";
import { otherMasterColumns } from "./OtherMaster.colums";

const PAGE_SIZE = 10;

const OtherMasterPage = () => {
  // TODO: Fetch From Real Source
  const subscID = 1;
  const { data = [], isLoading } = useOtherMastersQuery(subscID);

  const [pageIndex, setPageIndex] = useState(0);
  const totalItems = data.length;
  const pagedData = data.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="w-full h-full rounded-sm ">
      {/* Page Container */}
      <div className="flex flex-col h-full">
        <OtherMasterHeader />
        <OtherMasterTable
          columnData={otherMasterColumns}
          data={pagedData}
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          isLoading={isLoading}
        />
        <OtherMasterPagination
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          totalItems={totalItems}
          onPageChange={setPageIndex}
        />
      </div>
    </div>
  );
};

export default OtherMasterPage;
