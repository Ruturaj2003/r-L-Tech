import { useState } from "react";
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { createOtherMasterColumns } from "./OtherMaster.colums";
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterTable } from "./OtherMasterTable";

import OtherMasterForm from "./OtherMasterForm";
import { Modal } from "./Modal";

const OtherMasterPage = () => {
  const subscID = 1;
  const { data = [], isLoading } = useOtherMastersQuery(subscID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = createOtherMasterColumns({
    onView: () => {
      // console.log("VIEW", row);
      setIsModalOpen(true);
    },
    onEdit: () => {
      // setEditRow(row);
      // setEditModalOpen(true);
    },
    onDelete: () => {
      // setDeleteTarget(row);
    },
  });
  // Global filter state
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col h-full">
        <OtherMasterHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          setModalOpen={() => {
            setIsModalOpen(true);
          }}
        />
        <Modal open={isModalOpen}>
          <OtherMasterForm
            mode="Create"
            setModalClose={() => setIsModalOpen(false)}
          />
        </Modal>

        <div className="">
          <OtherMasterTable
            setModalOpen={() => {
              setIsModalOpen(true);
            }}
            columnData={columns}
            data={data}
            isLoading={isLoading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherMasterPage;
