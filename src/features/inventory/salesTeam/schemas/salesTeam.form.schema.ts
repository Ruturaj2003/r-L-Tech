import { z } from "zod";

/**
 * Sales Team Upsert schema (Create + Update).
 *
 * Represents the request body sent to:
 * `POST /api/SalesTeamMaster/api/SaveData`
 *
 * Used for both:
 * - Insert (mTransNo = 0)
 * - Update (mTransNo > 0)
 */
export const SalesTeamUpsertSchema = z.object({
  mTransNo: z.number(),

  stCode: z.string().optional(), // generated only on insert

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

  createdBy: z.number(),
  createdOn: z.string(),

  subscID: z.number(),

  status: z.enum(["Insert", "Update"]),
});

/**
 * Sales Team delete request schema.
 *
 * Represents the parameters required to delete a Sales Team record.
 */
export const SalesTeamDeleteSchema = z.object({
  mTransNo: z.number().positive(),
  userNo: z.number().positive(),
});

export type SalesTeamDelete = z.infer<typeof SalesTeamDeleteSchema>;
export type SalesTeamUpsert = z.infer<typeof SalesTeamUpsertSchema>;
