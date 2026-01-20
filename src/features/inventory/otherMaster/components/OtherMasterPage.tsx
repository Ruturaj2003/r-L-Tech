import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterPagination } from "./OtherMasterPagination";
import { OtherMasterTable } from "./OtherMasterTable";

const OtherMasterPage = () => {
  return (
    <div className="w-full h-[88vh] rounded-sm ">
      {/* Page Container */}
      <div className="flex flex-col h-full">
        <OtherMasterHeader />
        <OtherMasterTable />
        <OtherMasterPagination />
      </div>
    </div>
  );
};

export default OtherMasterPage;
