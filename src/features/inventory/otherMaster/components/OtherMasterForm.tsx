import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { FormContainer } from "./FormContainer";
import { FormField } from "./FormField";
import {
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from "./ControlledInput";

const OtherMasterFormSchema = z.object({
  masterType: z.string().min(1, "Master Type is Not weast"),
  masterName: z.string().min(1, "Master Name is required"),
  lockStatus: z.enum(["Y", "N"]),
  deleteReason: z.string().optional(),
});

type OtherMasterFormData = z.infer<typeof OtherMasterFormSchema>;

export default function OtherMasterForm() {
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

  const onSubmit = async (data: OtherMasterFormData) => {
    console.log("Form submitted:", data);
    // Your mutation logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <FormContainer
      className="w-full"
      title="Other Master"
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitLabel="Save Master"
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
            className="bg-amber-400 w-fit"
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

      {/* Example: Custom two-column layout */}
      {/* 
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Field 1" name="field1">
          <ControlledInput name="field1" register={register} />
        </FormField>
        <FormField label="Field 2" name="field2">
          <ControlledInput name="field2" register={register} />
        </FormField>
      </div>
      */}
    </FormContainer>
  );
}
