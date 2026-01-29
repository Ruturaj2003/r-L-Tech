import { z } from "zod";

/**
 * Sales Team entity schema
 * This is what ONE Sales Person Data like from the API
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
  emailID: z.string().email(),

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
 * Category dropdown option schema
 * For any dropdowns in your form
 */
export const ProductCategoryOptionSchema = z.object({
  categoryName: z.string().min(1),
});

/**
 * Delete reason dropdown option schema
 * Required for delete operation
 */
export const ProductDeleteReasonOptionSchema = z.object({
  mTransNo: z.number(),
  masterName: z.string().min(1),
});

// Export TypeScript types (auto-generated from schemas)
export type SalesTeamEntity = z.infer<typeof SalesTeamEntitySchema>;
export type ProductCategoryOption = z.infer<typeof ProductCategoryOptionSchema>;
export type ProductDeleteReasonOption = z.infer<
  typeof ProductDeleteReasonOptionSchema
>;
