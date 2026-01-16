import z from "zod";

/**
 * Core Other Master entity as returned by API
 */
export const OtherMasterSchema = z.object({
  mTransNo: z.number(),
  masterType: z.string().min(1),
  masterName: z.string().min(1),
  lockStatus: z.enum(["Y", "N"]),
  status: z.string(),
  subscID: z.number(),
});

/**
 * Save (Insert / Update) payload
 * Mirrors backend expectations exactly
 */

export const SaveOtherMasterSchema = z.object({
  mTransNo: z.number(),
  mCount: z.number(),
  masterType: z.string().min(1),
  masterName: z.string().min(1),
  systemIP: z.string(),
  lockStatus: z.enum(["Y", "N"]),
  createdBy: z.number(),
  createdOn: z.string(),
  subscID: z.number(),
  status: z.enum(["Insert", "Update"]),
});

/**
 * Delete payload (URL based)
 */

export const DeleteOtherMasterSchema = z.object({
  mTransNo: z.number(),
  userNo: z.number(),
  reason: z.string().min(1, "Delete reason is required"),
});

/**
 * Dropdown item schema (Master Type, Delete Reason)
 */
export const OtherMasterDropdownSchema = z.object({
  masterType: z.string().optional(),
  masterName: z.string().optional(),
});

export type OtherMaster = z.infer<typeof OtherMasterSchema>;
export type SaveOtherMaster = z.infer<typeof SaveOtherMasterSchema>;
export type DeleteOtherMaster = z.infer<typeof DeleteOtherMasterSchema>;
export type OtherMasterDropdown = z.infer<typeof OtherMasterDropdownSchema>;
