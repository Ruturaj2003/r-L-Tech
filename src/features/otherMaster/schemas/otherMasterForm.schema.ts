import z from "zod";

export const OtherMasterFormSchema = z.object({
  masterType: z.string().min(1, "Master Type is required"),
  masterName: z
    .string()
    .min(1, "Master Name is required")
    .max(50, "Maximum 50 characters allowed"),
  lockStatus: z.enum(["Y", "N"]),
  delteReason: z.string(),
});

export type OtherMasterFormData = z.infer<typeof OtherMasterFormSchema>;
