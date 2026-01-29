import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { FormContainer } from "@/components/form/FormContainer";
import { FormField } from "@/components/form/FormField";
import {
  ControlledCombobox,
  ControlledInput,
  ControlledSelect,
} from "@/components/form/ControlledInputs";

import { getOtherMasterFormSchema, type OtherMasterFormData } from "../schemas";
import type { FORM_MODE } from "@/types/commonTypes";
import type {
  DeleteReasonOption,
  MasterTypeOption,
} from "../types/otherMaster.types";

import { DeleteReasonDialog } from "@/components/DeleteReasonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/**
 * Props for the OtherMasterForm component.
 */
interface OtherMasterFormProps {
  /** Current form mode */
  mode: FORM_MODE;

  /** Initial form values */
  defaultValues: OtherMasterFormData;

  /** Submit handler */
  onSubmit: (data: OtherMasterFormData) => Promise<void>;

  /** Optional modal close handler */
  setModalClose?: () => void;

  /** Delete reason options (used in Delete mode) */
  deleteReasonOptions?: DeleteReasonOption[];

  /** Master type options */
  masterTypeOptions: MasterTypeOption[];
}

/**
 * Form component for creating, editing, viewing, and deleting Other Master records.
 */
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

  /** Controls delete reason dialog */
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  /** Controls unsaved changes confirmation dialog */
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  /**
   * Handles close action and confirms if form has unsaved changes.
   */
  const handleClose = () => {
    if (isDirty && !isSubmitting) {
      setShowConfirmClose(true);
      return;
    }
    setModalClose?.();
  };

  /**
   * Resets form when default values or mode changes.
   */
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, mode]);

  /**
   * Handler for invalid form submission.
   */
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
        <div className="grid grid-cols-2 gap-x-2">
          <FormField
            label="Master Type"
            name="masterType"
            required
            error={errors.masterType?.message}
            className="min-w-10"
          >
            <ControlledCombobox<OtherMasterFormData>
              name="masterType"
              control={control}
              placeholder="Select Master Type"
              disabled={mode === "View" || mode === "Delete"}
              options={
                masterTypeOptions?.map((masterType) => ({
                  label: masterType.masterType, // what user sees & types
                  value: masterType.masterType, // backend value (can differ later)
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
