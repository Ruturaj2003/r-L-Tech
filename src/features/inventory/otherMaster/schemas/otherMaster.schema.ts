import { z } from "zod";

/**
 * Other Master entity schema
 *
 * Boundary:
 * - API response (read operations)
 *
 * Purpose:
 * - Represents a single Other Master record
 * - Used for list/detail views
 */
export const OtherMasterEntitySchema = z.object({
  mTransNo: z.number(),
  masterType: z.string().min(1),
  masterName: z.string().min(1),
  status: z.enum(["Y", "N"]),
});

/**
 * Other Master Type option schema
 *
 * Boundary:
 * - API response (lookup / dropdown)
 *
 * Purpose:
 * - Used to populate Master Type selectors
 * - Read-only reference data
 */
export const OtherMasterTypeOptionSchema = z.object({
  masterType: z.string().min(1),
});

/**
 * Other Master Delete Reason option schema
 *
 * Boundary:
 * - API response (lookup)
 *
 * Purpose:
 * - Used to populate delete reason selection
 * - Contains display name tied to transaction
 */
export const OtherMasterDeleteReasonOptionSchema = z.object({
  mTransNo: z.number(),
  masterName: z.string().min(1),
});

/* ------------------------------------------------------------------ */
/*                              Types                                 */
/* ------------------------------------------------------------------ */

export type OtherMasterEntity = z.infer<typeof OtherMasterEntitySchema>;

export type OtherMasterTypeOption = z.infer<typeof OtherMasterTypeOptionSchema>;

export type OtherMasterDeleteReasonOption = z.infer<
  typeof OtherMasterDeleteReasonOptionSchema
>;
