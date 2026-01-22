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

interface OtherMasterFormProps {
  mode: "View" | "Edit" | "Delete" | "Create";
  setModalClose?: () => void;
}

export default function OtherMasterForm({
  mode,
  setModalClose,
}: OtherMasterFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtherMasterFormData>({
    resolver: zodResolver(OtherMasterFormSchema),
    defaultValues: {
      masterType: "",
      masterName: "",
      lockStatus: "N",
      deleteReason: "",
    },
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
