import { useState } from "react";
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { createOtherMasterColumns } from "./OtherMaster.colums";
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterTable } from "./OtherMasterTable";

import OtherMasterForm from "./OtherMasterForm";
import { Modal } from "./Modal";

type Mode = "Create" | "View" | "Edit" | "Delete";

const OtherMasterPage = () => {
  const subscID = 1;
  const { data = [], isLoading } = useOtherMastersQuery(subscID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<Mode>("View");
  const columns = createOtherMasterColumns({
    onView: () => {
      // console.log("VIEW", row);
      setFormMode("View");
      setIsModalOpen(true);
    },
    onEdit: () => {
      // setEditRow(row);
      // setEditModalOpen(true);
      setFormMode("Edit");
      setIsModalOpen(true);
    },
    onDelete: () => {
      // setDeleteTarget(row);
      setFormMode("Delete");
      setIsModalOpen(true);
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
            mode={formMode}
            setModalClose={() => setIsModalOpen(false)}
          />
        </Modal>

        <div className="">
          <OtherMasterTable
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
