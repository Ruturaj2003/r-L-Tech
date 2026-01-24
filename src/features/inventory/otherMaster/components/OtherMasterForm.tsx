import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// -------------------------------------
// Feature Components
// -------------------------------------
import { FormContainer } from "@/components/form/FormContainer";
import { FormField } from "@/components/form/FormField";

import {
  ControlledCombobox,
  ControlledInput,
  ControlledSelect,
} from "@/components/form/ControlledInputs";
// -------------------------------------
// Schemas
// -------------------------------------
import { getOtherMasterFormSchema, type OtherMasterFormData } from "../schemas";
import type { FORM_MODE } from "@/types/commonTypes";
// -------------------------------------
// Types
// -------------------------------------
import type {
  DeleteReasonOption,
  MasterTypeOption,
} from "../types/otherMaster.types";
import { useEffect, useState } from "react";

import { DeleteReasonDialog } from "@/components/DeleteReasonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// -------------------------------------
// Props
// -------------------------------------
interface OtherMasterFormProps {
  mode: FORM_MODE;
  defaultValues: OtherMasterFormData;
  onSubmit: (data: OtherMasterFormData) => Promise<void>;
  setModalClose?: () => void;

  deleteReasonOptions?: DeleteReasonOption[];
  masterTypeOptions: MasterTypeOption[];
}

// -------------------------------------
// Component
// -------------------------------------
export default function OtherMasterForm({
  mode,
  defaultValues,
  onSubmit,
  setModalClose,
  deleteReasonOptions = [],
  masterTypeOptions,
}: OtherMasterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(getOtherMasterFormSchema(mode)),
    defaultValues,
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleClose = () => {
    if (isDirty && !isSubmitting) {
      setShowConfirmClose(true);
      return;
    }
    setModalClose?.();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, mode]);

  const onInvalid = (errors: unknown) => {
    console.log("FORM ERRORS", errors);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        title="Unsaved changes"
        description="You have unsaved changes. If you close now, your changes will be lost."
        confirmLabel="Discard changes"
        onConfirm={() => {
          setShowConfirmClose(false);
          setModalClose?.();
        }}
      />
      <FormContainer
        title="Other Master"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        mode={mode}
        onDelete={() => setOpenDeleteDialog(true)}
      >
        {/* -------------------------------------
          Main Fields
        ------------------------------------- */}
        <div className="grid grid-cols-2 gap-x-2">
          <FormField
            label="Master Type"
            name="masterType"
            required
            error={errors.masterType?.message}
            className="min-w-10"
          >
            <ControlledCombobox<OtherMasterFormData, string>
              name="masterType"
              control={control}
              placeholder="Select Master Type"
              disabled={mode === "View" || mode === "Delete"}
              showClear={mode !== "View" && mode !== "Delete"}
              options={
                masterTypeOptions?.map((masterType) => ({
                  label: masterType.masterType,
                  value: masterType.masterType,
                })) ?? []
              }
              error={errors.masterType?.message}
              className="min-w-40 mt-2"
            />
          </FormField>

          <FormField
            label="Master Name"
            name="masterName"
            required
            error={errors.masterName?.message}
          >
            <ControlledInput
              name="masterName"
              register={register}
              disabled={mode === "View" || mode === "Delete"}
              error={errors.masterName?.message}
              placeholder="Enter master name"
            />
          </FormField>
        </div>

        {/* -------------------------------------
          Lock Status
        ------------------------------------- */}
        <FormField
          label="Lock Status"
          name="lockStatus"
          required
          error={errors.lockStatus?.message}
        >
          <ControlledSelect
            name="lockStatus"
            disabled={mode === "View" || mode === "Delete"}
            options={[
              { label: "No", value: "N" },
              { label: "Yes", value: "Y" },
            ]}
            control={control}
            error={errors.lockStatus?.message}
          />
        </FormField>

        {/* -------------------------------------
          Delete Reason (ONLY in Delete mode)
        ------------------------------------- */}
        {mode === "Delete" && (
          <DeleteReasonDialog<OtherMasterFormData, DeleteReasonOption>
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            control={control}
            errors={errors}
            name="deleteReason"
            options={deleteReasonOptions}
            getLabel={(r) => r.masterName}
            getValue={(r) => String(r.mTransNo)}
            isSubmitting={isSubmitting}
            onConfirm={handleSubmit(onSubmit, onInvalid)}
          />
        )}
      </FormContainer>
    </>
  );
}
// This function is called automatically for each option.
// `r` is one item from the options array.
// We return `r.masterName` to use as the display label.
// (r) => r.masterName
