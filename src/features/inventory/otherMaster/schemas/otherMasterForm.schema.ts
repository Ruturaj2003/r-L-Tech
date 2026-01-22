import { z } from "zod";

/**
 * Other Master UI Form Schema
 *
 * Boundary: UI only
 * Purpose:
 * - Client-side validation
 * - Supports create, update, and delete modes
 *
 * Notes:
 * - Not a mirror of backend payload
 * - deleteReason is conditionally required (Delete mode only)
 */
export const OtherMasterFormSchema = z
  .object({
    masterType: z.string().min(1, "Master Type is required"),
    masterName: z
      .string()
      .min(1, "Master Name is required")
      .max(50, "Maximum 50 characters allowed"),
    lockStatus: z.enum(["Y", "N"]),
    /**
     * Required only when form is used in delete mode
     */
    deleteReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deleteReason !== undefined && data.deleteReason.trim() === "") {
      ctx.addIssue({
        path: ["deleteReason"],
        code: z.ZodIssueCode.custom,
        message: "Delete reason is required",
      });
    }
  });

/**
 * Other Master Upsert Request Schema
 *
 * Boundary: API request (Insert / Update)
 * Purpose:
 * - Exact backend contract
 * - Used before mutation submission
 *
 * Notes:
 * - status determines Insert vs Update
 * - No UI-only fields allowed here
 */
export const UpsertOtherMasterRequestSchema = z.object({
  mTransNo: z.number(),
  mCount: z.number().default(0),
  masterType: z.string().min(1),
  masterName: z.string().min(1),
  systemIP: z.string().default("0"),
  lockStatus: z.enum(["Y", "N"]),
  createdBy: z.number(), // From localStorage (logged-in user mTransNo)
  createdOn: z.string(), // ISO date string
  subscID: z.number(),
  status: z.enum(["Insert", "Update"]),
});

/**
 * Other Master Delete Request Schema
 *
 * Boundary: API request (Delete)
 * Purpose:
 * - URL or body-based delete operation
 *
 * Notes:
 * - reason is mandatory and audited by backend
 */
export const DeleteOtherMasterRequestSchema = z.object({
  mTransNo: z.number(),
  userNo: z.number(),
  reason: z.string().min(1, "Delete reason is required"),
});

/* ------------------------------------------------------------------ */
/*                              Types                                 */
/* ------------------------------------------------------------------ */

export type OtherMasterFormData = z.infer<typeof OtherMasterFormSchema>;

export type UpsertOtherMasterRequest = z.infer<
  typeof UpsertOtherMasterRequestSchema
>;

export type DeleteOtherMasterRequest = z.infer<
  typeof DeleteOtherMasterRequestSchema
>;
