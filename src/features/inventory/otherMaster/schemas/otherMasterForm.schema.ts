import { z } from "zod";
import type { FORM_MODE } from "../types/otherMaster.types";

/* ------------------------------------------------------------------ */
/*                        UI FORM SCHEMA (MODE-AWARE)                  */
/* ------------------------------------------------------------------ */

/**
 * Other Master UI Form Schema
 *
 * Boundary: UI only
 * Purpose:
 * - Client-side validation
 * - Used by React Hook Form
 *
 * Rules:
 * - Create / Edit → no deleteReason required
 * - Delete → deleteReason is required
 *
 * Notes:
 * - NOT a mirror of backend payload
 * - Mode must be provided explicitly
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
          code: z.ZodIssueCode.custom,
          message: "Delete reason is required",
        });
      }
    });

/**
 * UI Form Data Type
 */
export type OtherMasterFormData = z.infer<
  ReturnType<typeof getOtherMasterFormSchema>
>;

/* ------------------------------------------------------------------ */
/*                   API REQUEST SCHEMAS (STRICT)                      */
/* ------------------------------------------------------------------ */

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

  lockStatus: z.enum(["Y", "N"]),

  systemIP: z.string().default("0"),
  createdBy: z.number(),
  createdOn: z.string(), // ISO string
  subscID: z.number(),

  status: z.enum(["Insert", "Update"]),
});

/**
 * Upsert API Request Type
 */
export type UpsertOtherMasterRequest = z.infer<
  typeof UpsertOtherMasterRequestSchema
>;

/**
 * Other Master Delete Request Schema
 *
 * Boundary: API request (Delete)
 * Purpose:
 * - Audited delete operation
 *
 * Notes:
 * - reason is mandatory
 */
export const DeleteOtherMasterRequestSchema = z.object({
  mTransNo: z.number(),
  userNo: z.number(),
  reason: z.string().min(1, "Delete reason is required"),
});

/**
 * Delete API Request Type
 */
export type DeleteOtherMasterRequest = z.infer<
  typeof DeleteOtherMasterRequestSchema
>;
