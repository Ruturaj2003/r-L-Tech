import { z } from "zod";

export const SalesTeamEntitySchema = z.object({
  mTransNo: z.number(),
  stCode: z.string(),
  frstName: z.string(),
  lastName: z.string(),
  branchCode: z.string(),
  designation: z.string(),
});

export const SalesTeamListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(SalesTeamEntitySchema),
});

export const SalesTeamSingleResponseSchema = z.object({
  success: z.literal(true),
  data: SalesTeamEntitySchema,
});

export const SalesTeamDesignationOptionSchema = z.object({
  mTransNo: z.number(),
  configKey: z.string(),
  configValue: z.string(),
  configDepartment: z.string(),
  subscID: z.number(),
});

export const SalesTeamDesignationOptionResponseSchema = z.object({
  success: z.literal(true),
  data: SalesTeamDesignationOptionSchema,
});

export const SalesTeamBranchOptionSchema = z.object({
  mTransNo: z.number(),
  branchCode: z.string(),
  branchName: z.string(),
  branchType: z.string(),
  lockStatus: z.enum(["Y", "N"]),
});

export const SalesTeamBranchOptionResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(SalesTeamBranchOptionSchema),
});

export type SalesTeamEntity = z.infer<typeof SalesTeamEntitySchema>;
export type SalesTeamDesignationOption = z.infer<
  typeof SalesTeamDesignationOptionSchema
>;
export type SalesTeamBranchOption = z.infer<typeof SalesTeamBranchOptionSchema>;
