import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// -------------------------------------
// Feature Components
// -------------------------------------
import { FormContainer } from "./FormContainer";
import { FormField } from "./FormField";
import {
  ControlledInput,
  ControlledSelect,
  ControlledCombobox,
} from "./ControlledInput";

// -------------------------------------
// Schemas
// -------------------------------------
import { getOtherMasterFormSchema, type OtherMasterFormData } from "../schemas";

// -------------------------------------
// Types
// -------------------------------------
import type {
  DeleteReasonOption,
  FORM_MODE,
  MasterTypeOption,
} from "../types/otherMaster.types";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

// -------------------------------------
// Props
// -------------------------------------
interface OtherMasterFormProps {
  mode: FORM_MODE;
  defaultValues: OtherMasterFormData;
  onSubmit: (data: OtherMasterFormData) => Promise<void>;
  setModalClose?: () => void;

  /** Delete reason dropdown options (passed from Page) */
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
    formState: { errors, isSubmitting },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(getOtherMasterFormSchema(mode)),
    defaultValues,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, mode]);
  const onInvalid = (errors: unknown) => {
    console.log("FORM ERRORS", errors);
  };

  return (
    <FormContainer
      title="Other Master"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      isSubmitting={isSubmitting}
      setModalClose={setModalClose}
      mode={mode}
      onDeleteClick={() => setOpenDeleteDialog(true)}
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
        <AlertDialog
          defaultOpen
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Please select a reason.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField
              label="Delete Reason"
              name="deleteReason"
              required
              error={errors.deleteReason?.message}
            >
              <ControlledSelect
                name="deleteReason"
                control={control}
                options={deleteReasonOptions.map((r) => ({
                  label: r.masterName,
                  value: String(r.mTransNo),
                }))}
              />
            </FormField>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                variant="destructive"
                onClick={handleSubmit(onSubmit, onInvalid)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </FormContainer>
  );
}
