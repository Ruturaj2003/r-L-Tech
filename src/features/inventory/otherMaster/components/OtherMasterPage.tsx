// -------------------------------------
// External
// -------------------------------------
import { useState } from "react";

// -------------------------------------
// Feature Hooks
// -------------------------------------
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import { useUpsertOtherMasterMutation } from "../hooks/useOtherMasterMutations";

// -------------------------------------
// Feature Components
// -------------------------------------
import { OtherMasterHeader } from "./OtherMasterHeader";
import { OtherMasterTable } from "./OtherMasterTable";
import OtherMasterForm from "./OtherMasterForm";
import { Modal } from "./Modal";

// -------------------------------------
// Feature Utils
// -------------------------------------
import { createOtherMasterColumns } from "./OtherMaster.colums";
import { mapRowToFormDefaults } from "./OtherMasterForm.mapper";

// -------------------------------------
// Types
// -------------------------------------
import type { FORM_MODE } from "../types/otherMaster.types";
import type {
  OtherMasterEntity,
  OtherMasterFormData,
  UpsertOtherMasterRequest,
} from "../schemas";

import { useDeleteReasonsQuery } from "../hooks/useOtherMasterDropdown";

// -------------------------------------
// Page Component
// -------------------------------------
const OtherMasterPage = () => {
  // -------------------------------------
  // Constants
  // -------------------------------------
  // TODO : take from local storage
  const subscID = 1;

  // -------------------------------------
  // Server State
  // -------------------------------------
  const { data = [], isLoading } = useOtherMastersQuery(subscID);
  const { data: deleteReasonOptions = [], isLoading: isDeleteReasonLoading } =
    useDeleteReasonsQuery(subscID);
  // -------------------------------------
  // Mutations
  // -------------------------------------
  const upsertOtherMaster = useUpsertOtherMasterMutation();

  // -------------------------------------
  // UI State
  // -------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FORM_MODE>("View");
  const [selectedRow, setSelectedRow] = useState<OtherMasterEntity | null>(
    null,
  );
  const [globalFilter, setGlobalFilter] = useState("");

  // -------------------------------------
  // Handlers
  // -------------------------------------
  const handleFormSubmit = async (data: OtherMasterFormData) => {
    if (formMode === "Create") {
      const payload: UpsertOtherMasterRequest = {
        createdBy: 1,
        createdOn: new Date().toISOString(),
        mCount: 0,
        subscID,
        mTransNo: 0,
        systemIP: "0.0.00",
        status: "Insert",
        ...data,
      };
      console.log("Craete FN run");

      await upsertOtherMaster.mutateAsync(payload);
    }

    if (formMode === "Edit") {
      // update payload
      // Extract the hidden Fields which are not shown in form here
      // The ! tells type script that I knows its there
      const hiddenData = selectedRow;

      const payload: UpsertOtherMasterRequest = {
        createdBy: 1,
        createdOn: new Date().toISOString(),
        mCount: 0,
        subscID,
        mTransNo: hiddenData!.mTransNo,
        systemIP: "0.0.00",
        status: "Update",
        ...data,
      };
      console.log("Craete FN run");

      await upsertOtherMaster.mutateAsync(payload);
    }

    if (formMode === "Delete") {
      // delete payload
    }

    setIsModalOpen(false);
  };

  // -------------------------------------
  // Table Configuration
  // -------------------------------------
  const columns = createOtherMasterColumns({
    onView: (row) => {
      setSelectedRow(row);
      setFormMode("View");
      setIsModalOpen(true);
    },
    onEdit: (row) => {
      setSelectedRow(row);
      setFormMode("Edit");
      setIsModalOpen(true);
    },
    onDelete: (row) => {
      setSelectedRow(row);
      setFormMode("Delete");
      setIsModalOpen(true);
    },
  });

  // -------------------------------------
  // Render
  // -------------------------------------
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
          {isDeleteReasonLoading ? (
            <h2>Loading Please Wait</h2>
          ) : (
            <OtherMasterForm
              mode={formMode}
              onSubmit={handleFormSubmit}
              defaultValues={mapRowToFormDefaults(formMode, selectedRow)}
              setModalClose={() => setIsModalOpen(false)}
              deleteReasonOptions={deleteReasonOptions}
            />
          )}
        </Modal>

        <OtherMasterTable
          columnData={columns}
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
