import { Button } from "@/components/ui/button";

const OtherMasterPage = () => {
  return (
    <div className="w-full h-[88vh] rounded-sm bg-amber-300">
      {/* Page Container */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
          <h1 className="text-4xl font-semibold">Other Master</h1>

          <div className="flex items-center gap-x-6">
            {/* Global Search */}
            <div className="bg-gray-300 w-48 h-10 rounded-full flex items-center justify-center text-sm">
              Search
            </div>

            {/* Add Button */}
            <Button>Add +</Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-green-400">as</div>

        {/* Table Navigation */}
        <div className="h-12 bg-slate-200 px-4 text-white justify-between flex items-center ">
          {/* Page Number */}
          <div className="bg-slate-400 ">{"<< < 1 2 3 4 5 6 > >>"}</div>
          <div className="bg-slate-400 ">1 out of 8 Pages (107 Items) </div>
        </div>
      </div>
    </div>
  );
};

export default OtherMasterPage;
