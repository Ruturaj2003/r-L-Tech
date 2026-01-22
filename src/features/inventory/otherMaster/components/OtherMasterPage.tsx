import { useState } from "react";
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { createOtherMasterColumns } from "./OtherMaster.colums";
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterTable } from "./OtherMasterTable";

import OtherMasterForm from "./OtherMasterForm";
import { Modal } from "./Modal";
import { mapRowToFormDefaults } from "./OtherMasterForm.mapper";
import type { OtherMasterEntity } from "../schemas";

type Mode = "Create" | "View" | "Edit" | "Delete";

const OtherMasterPage = () => {
  const subscID = 1;
  const { data = [], isLoading } = useOtherMastersQuery(subscID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<Mode>("View");

  const [selectedRow, setSelectedRow] = useState<OtherMasterEntity | null>(
    null,
  );

  const columns = createOtherMasterColumns({
    onView: (row: OtherMasterEntity) => {
      setSelectedRow(row);
      setFormMode("View");
      setIsModalOpen(true);
    },
    onEdit: (row: OtherMasterEntity) => {
      setSelectedRow(row);
      setFormMode("Edit");
      setIsModalOpen(true);
    },
    onDelete: (row: OtherMasterEntity) => {
      setSelectedRow(row);
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
            setSelectedRow(null);
            setFormMode("Create");
            setIsModalOpen(true);
          }}
        />
        <Modal open={isModalOpen}>
          <OtherMasterForm
            defaultValues={mapRowToFormDefaults(formMode, selectedRow)}
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
