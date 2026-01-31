import z from "zod";

/**
 * Sales Team entity schema.
 *
 * Represents a single Sales Team member record as returned by the API.
 * Used for validating and typing Sales Team master data.
 */
export const SalesTeamEntitySchema = z.object({
  /** Unique transaction identifier */
  mTransNo: z.number(),

  /** Sales team code */
  stCode: z.string(),

  /** First name of the sales person */
  frstName: z.string(),

  /** Last name of the sales person */
  lastName: z.string(),

  /** Branch code to which the sales person belongs */
  branchCode: z.string(),

  /** Designation of the sales person */
  designation: z.string(),
});

/**
 * Sales Team designation option schema.
 *
 * Represents a single designation option retrieved from configuration/master data.
 * Typically used for dropdowns or selection lists.
 */
export const SalesTeamDesignationOptionSchema = z.object({
  /** Unique transaction identifier */
  mTransNo: z.number(),

  /** Configuration key */
  configKey: z.string(),

  /** Display value of the designation */
  configValue: z.string(),

  /** Department to which this configuration belongs */
  configDepartment: z.string(),

  /** Subscription identifier */
  subscID: z.number(),
});

/**
 * Sales Team branch option schema.
 *
 * Represents a single branch record used for branch selection.
 * Typically used for dropdowns or branch lookup lists.
 */
export const SalesTeamBranchOptionSchema = z.object({
  /** Unique transaction identifier */
  mTransNo: z.number(),

  /** Branch code */
  branchCode: z.string(),

  /** Branch name */
  branchName: z.string(),

  /** Branch type (e.g., Head Office, Regional, etc.) */
  branchType: z.string(),

  /** Lock status of the branch: Y = Locked, N = Active */
  lockStaus: z.enum(["Y", "N"]),
});
