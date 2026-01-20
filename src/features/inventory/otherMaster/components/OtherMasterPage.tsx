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
        <div className="h-12 bg-black text-white flex items-center justify-center">
          as
        </div>
      </div>
    </div>
  );
};

export default OtherMasterPage;
