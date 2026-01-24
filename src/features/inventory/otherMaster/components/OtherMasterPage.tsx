// -------------------------------------
// External
// -------------------------------------
import { useState } from "react";

// -------------------------------------
// Feature Hooks
// -------------------------------------
import { useOtherMastersQuery } from "../hooks/useOtherMastersQuery";
import {
  useDeleteOtherMasterMutation,
  useUpsertOtherMasterMutation,
} from "../hooks/useOtherMasterMutations";

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
  DeleteOtherMasterRequest,
  OtherMasterEntity,
  OtherMasterFormData,
  UpsertOtherMasterRequest,
} from "../schemas";

import {
  useDeleteReasonsQuery,
  useMasterTypesQuery,
} from "../hooks/useOtherMasterDropdown";

import { toast } from "sonner";
import { AlertTriangle, Loader2, RefreshCcw } from "lucide-react";
import { OtherMasterErrorBoundary } from "./OtherMasterErrorBoundary";
import { Button } from "@base-ui/react";

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
  const {
    data = [],
    isLoading,
    error: masterDataError,
  } = useOtherMastersQuery(subscID);
  const {
    data: masterTypeOptions = [],
    isLoading: isMasterTypeLoading,
    error: masterTypeError,
  } = useMasterTypesQuery();
  const {
    data: deleteReasonOptions = [],
    isLoading: isDeleteReasonLoading,
    error: deleteReasonError,
  } = useDeleteReasonsQuery(subscID);
  // -------------------------------------
  // Mutations
  // -------------------------------------
  const upsertOtherMaster = useUpsertOtherMasterMutation();
  const deleteOtherMaster = useDeleteOtherMasterMutation();

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
    // Double safety Check
    if ((formMode === "Edit" || formMode === "Delete") && !selectedRow) {
      toast.error("No record selected");
      return;
    }
    try {
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

        await upsertOtherMaster.mutateAsync(payload);
        toast.success("Master created successfully");
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

        await upsertOtherMaster.mutateAsync(payload);
        toast.success("Master updated successfully");
      }

      if (formMode === "Delete") {
        // delete payload
        // TODO :  const UserNo = Number(
        //   JSON.parse(localStorage.getItem("LogUser")).mTransNo,
        // );
        const hiddenData = selectedRow;
        const payload: DeleteOtherMasterRequest = {
          mTransNo: hiddenData!.mTransNo,
          reason: data.deleteReason!,
          userNo: 1,
        };
        await deleteOtherMaster.mutateAsync(payload);
        toast.success("Master deleted successfully");
      }

      setIsModalOpen(false);
    } catch (error) {
      const operation =
        formMode === "Create"
          ? "create"
          : formMode === "Edit"
            ? "update"
            : "delete";

      toast.error(`Failed to ${operation} master`, {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
      console.error(`Error during ${operation}:`, error);
    }
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

  if (masterDataError || masterTypeError || deleteReasonError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load data</h2>
          <p className="text-muted-foreground mb-4">
            {masterDataError?.message ||
              masterTypeError?.message ||
              deleteReasonError?.message ||
              "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <OtherMasterErrorBoundary>
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
            {isDeleteReasonLoading || isMasterTypeLoading ? (
              <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading form data...
                </p>
              </div>
            ) : (
              <OtherMasterForm
                mode={formMode}
                onSubmit={handleFormSubmit}
                defaultValues={mapRowToFormDefaults(formMode, selectedRow)}
                setModalClose={() => setIsModalOpen(false)}
                deleteReasonOptions={deleteReasonOptions}
                masterTypeOptions={masterTypeOptions}
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
    </OtherMasterErrorBoundary>
  );
};

export default OtherMasterPage;
