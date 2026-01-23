import { z } from "zod";
import type { FORM_MODE } from "../types/otherMaster.types";

/**
 * Other Master UI Form Schema
 *
 * - Mode-aware
 * - Self-documenting
 * - No hidden rules
 */
export const getOtherMasterFormSchema = (mode: FORM_MODE) =>
  z
    .object({
      masterType: z.string().min(1, "Master Type is required"),
      masterName: z
        .string()
        .min(1, "Master Name is required")
        .max(50, "Maximum 50 characters allowed"),
      lockStatus: z.enum(["Y", "N"]),
      deleteReason: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (mode === "Delete" && !data.deleteReason) {
        ctx.addIssue({
          path: ["deleteReason"],
          message: "Delete reason is required",
          code: z.ZodIssueCode.custom,
        });
      }
    });

export type OtherMasterFormData = z.infer<
  ReturnType<typeof getOtherMasterFormSchema>
>;
