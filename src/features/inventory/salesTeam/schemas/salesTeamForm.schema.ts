import { z } from "zod";

/** Payload for creating or updating a Sales Team record */
export const SalesTeamInsertPayloadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  emailID: z.email("Invalid email address"),

  branchCode: z.string().min(1, "Branch is required"),
  designation: z.string().min(1, "Designation is required"),

  parentNo: z.number().int(),
  systemIP: z.string(),
  lockStatus: z.enum(["Y", "N"]),

  createdBy: z.number().int(),
  /** ISO 8601 timestamp */
  createdOn: z.iso.datetime(),
  subscID: z.number().int(),
});

export const SalesTeamUpdatePayloadSchema = z.object({
  mTransNo: z.number().int().nonnegative(),

  /** Auto-generated on create */

  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  branchCode: z.string().min(1, "Branch is required"),
  designation: z.string().min(1, "Designation is required"),
  emailID: z.email("Invalid email address"),

  /** ISO 8601 timestamp */
  modifiedOn: z.iso.datetime(),
});

export const SalesTeamDeletePayloadSchema = z.object({
  mTransNo: z.number().int().nonnegative(),
  deleteReason: z.string().min(1, "Delete reason is required"),
});

export type SalesTeamInsertPayload = z.infer<
  typeof SalesTeamInsertPayloadSchema
>;

export type SalesTeamUpdatePayload = z.infer<
  typeof SalesTeamUpdatePayloadSchema
>;
