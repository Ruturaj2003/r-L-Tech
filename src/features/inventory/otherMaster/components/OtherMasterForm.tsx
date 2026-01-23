import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// -------------------------------------
// Feature Components
// -------------------------------------
import { FormContainer } from "./FormContainer";
import { FormField } from "./FormField";
import { ControlledInput, ControlledSelect } from "./ControlledInput";

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

// -------------------------------------
// Types – Form Defaults
// -------------------------------------
export type DefaultValues = {
  masterType: string;
  masterName: string;
  lockStatus: "N" | "Y";
  deleteReason?: string;
};

// -------------------------------------
// Props
// -------------------------------------
interface OtherMasterFormProps {
  mode: FORM_MODE;
  defaultValues: DefaultValues;
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(getOtherMasterFormSchema(mode)),
    defaultValues,
  });
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
          <ControlledSelect
            name="masterType"
            placeholder="Select Master Type"
            className=" min-w-40 mt-2"
            disabled={mode === "View" || mode === "Delete"}
            options={
              masterTypeOptions?.map((masterType) => ({
                label: masterType.masterType,
                value: masterType.masterType,
              })) ?? []
            }
            setValue={setValue}
            error={errors.lockStatus?.message}
            defaultValue="N"
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
          setValue={setValue}
          error={errors.lockStatus?.message}
          defaultValue="N"
        />
      </FormField>

      {/* -------------------------------------
          Delete Reason (ONLY in Delete mode)
      ------------------------------------- */}
      {mode === "Delete" && (
        <FormField
          label="Delete Reason"
          name="deleteReason"
          required
          error={errors.deleteReason?.message}
        >
          <ControlledSelect
            name="deleteReason"
            options={
              deleteReasonOptions?.map((reason) => ({
                label: reason.masterName,
                value: String(reason.mTransNo),
              })) ?? []
            }
            setValue={setValue}
            error={errors.deleteReason?.message}
            placeholder="Select delete reason"
          />
        </FormField>
      )}
    </FormContainer>
  );
}
