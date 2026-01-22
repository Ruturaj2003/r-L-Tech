import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormContainer } from "./FormContainer";
import { FormField } from "./FormField";
import {
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from "./ControlledInput";
import {
  OtherMasterFormSchema,
  type OtherMasterFormData,
  type UpsertOtherMasterRequest,
} from "../schemas";
import { useUpsertOtherMasterMutation } from "../hooks/useOtherMasterMutations";
import type { FORM_MODE } from "../types/otherMaster.types";
export type defaultValues = {
  masterType: string;
  masterName: string;
  lockStatus: "N" | "Y";
  deleteReason?: string;
};

interface OtherMasterFormProps {
  mode: FORM_MODE;
  setModalClose?: () => void;
  defaultValues: defaultValues;
}

export default function OtherMasterForm({
  mode,
  setModalClose,
  defaultValues,
}: OtherMasterFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(OtherMasterFormSchema),
    defaultValues: defaultValues,
  });

  const upsertOtherMaster = useUpsertOtherMasterMutation();

  const onSubmit = async (data: OtherMasterFormData) => {
    if (mode === "Create") {
      const payload: UpsertOtherMasterRequest = {
        createdBy: 1,
        createdOn: new Date().toISOString(),
        mCount: 0,
        subscID: 1,
        mTransNo: 0,
        systemIP: "0.0.00",
        status: "Insert",
        ...data,
      };
      await upsertOtherMaster.mutate(payload);
    }
    console.log("Form submitted:", data);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <FormContainer
      title="Other Master"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitLabel="Save Master"
      setModalClose={setModalClose}
      mode={mode}
    >
      {/* NOW YOU DESIGN YOUR LAYOUT HOWEVER YOU WANT */}
      <div className="grid grid-cols-2 gap-x-2 justify-between">
        <FormField
          label="Master Type"
          name="masterType"
          required
          error={errors.masterType?.message}
        >
          <ControlledInput
            name="masterType"
            register={register}
            disabled={mode === "View" || mode === "Delete"}
            error={errors.masterType?.message}
            placeholder="Enter master type"
          />
        </FormField>

        <FormField
          label="Master Name"
          name="masterName"
          required
          error={errors.masterName?.message}
        >
          <ControlledInput
            disabled={mode === "View" || mode === "Delete"}
            className=""
            name="masterName"
            register={register}
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
          disabled={mode === "View" || mode === "Delete"}
          name="lockStatus"
          options={[
            { label: "No", value: "N" },
            { label: "Yes", value: "Y" },
          ]}
          setValue={setValue}
          error={errors.lockStatus?.message}
          defaultValue="N"
        />
      </FormField>

      {mode === "Delete" && (
        <FormField
          label="Delete Reason"
          name="deleteReason"
          error={errors.deleteReason?.message}
        >
          <ControlledTextarea
            name="deleteReason"
            register={register}
            error={errors.deleteReason?.message}
            placeholder="Optional: Explain why this master was deleted"
            rows={4}
          />
        </FormField>
      )}
    </FormContainer>
  );
}

{
  /* Example: Custom two-column layout */
}
{
  /* 
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Field 1" name="field1">
          <ControlledInput name="field1" register={register} />
        </FormField>
        <FormField label="Field 2" name="field2">
          <ControlledInput name="field2" register={register} />
        </FormField>
      </div>
      */
}
