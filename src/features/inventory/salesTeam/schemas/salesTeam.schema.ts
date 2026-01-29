import { z } from "zod";

/**
 * Sales Team entity schema.
 *
 * Represents **one Sales Team record** exactly as returned by
 * `GET /api/SalesTeamMaster/api/GetData/{id}`.
 *
 * This schema defines the full structure of a Sales Team member
 * stored in the system, including personal details, branch,
 * designation, audit fields, and status flags.
 */
export const SalesTeamEntitySchema = z.object({
  mTransNo: z.number(),

  stCode: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),

  branchCode: z.string().min(1),
  designation: z.string().min(1),

  phoneNo: z.string(),
  mobileNo: z.string(),
  emailID: z.email(),

  residentialAddress: z.string(),
  stockDeliveryAddress: z.string(),

  region: z.string(),
  district: z.string(),
  ward: z.string(),
  pinCode: z.string(),

  dateOfBirth: z.string().nullable(),

  identification: z.string(),
  identificationNo: z.string(),

  paymentOperator: z.string(),
  paymentNumber: z.string(),

  branchDistance: z.string(),
  priceCategory: z.string(),

  parentNo: z.number(),

  systemIP: z.string(),

  lockStatus: z.enum(["Y", "N"]),
  lockCounter: z.number(),

  createdBy: z.number(),
  createdOn: z.string(),

  modifiedBy: z.number().nullable(),
  modifiedOn: z.string().nullable(),

  deleteStatus: z.enum(["Y", "N"]),
  deleteReason: z.string().nullable(),

  subscID: z.number(),
  tempNo: z.number(),
});

/**
 * Branch dropdown option schema.
 *
 * Represents **one branch row** returned from:
 * `GET /api/BranchMaster/api/GetData/List`
 *
 * Used to populate the Branch/Store dropdown.
 */
export const BranchOptionSchema = z.object({
  branchCode: z.string().min(1),
  branchName: z.string().min(1),
  branchType: z.string().min(1),
});

/**
 * Designation configuration API schema.
 *
 * Represents the response from:
 * `GET /api/GeneralConfig/api/GetData/{8 | 9}`
 *
 * This API does NOT return individual designation records.
 * Instead, it returns a single configuration value containing
 * multiple designations as a comma-separated string.
 *
 * Example:
 * `{ configValue: "Manager,Clerk,Salesman" }`
 */
export const DesignationConfigSchema = z.object({
  configValue: z.string().min(1),
});

/**
 * Designation dropdown option schema.
 *
 * Represents **one designation option** used by the UI
 * after splitting `configValue` from the configuration API.
 */
export const DesignationOptionSchema = z.object({
  designation: z.string().min(1),
});

/* ---------------- Types ---------------- */

export type SalesTeamEntity = z.infer<typeof SalesTeamEntitySchema>;
export type BranchOption = z.infer<typeof BranchOptionSchema>;
export type DesignationConfig = z.infer<typeof DesignationConfigSchema>;
export type DesignationOption = z.infer<typeof DesignationOptionSchema>;
