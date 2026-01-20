import z from "zod";

/**
 * Form-level validation schema
 * UI-focused, not API-focused
 */
export const OtherMasterFormSchema = z
  .object({
    masterType: z.string().min(1, "Master Type is required"),
    masterName: z
      .string()
      .min(1, "Master Name is required")
      .max(50, "Maximum 50 characters allowed"),
    lockStatus: z.enum(["Y", "N"]),
    //   It is only req in Delete Mode
    deleteReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deleteReason !== undefined && data.deleteReason.trim() === "") {
      ctx.addIssue({
        path: ["deleteReason"],
        message: "Delete reason is required",
        code: "custom",
      });
    }
  });

export type OtherMasterFormData = z.infer<typeof OtherMasterFormSchema>;
