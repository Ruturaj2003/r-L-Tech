import { type OtherMasterFormData } from "../schemas";

import type { OtherMasterEntity } from "../schemas";

export type Mode = "Create" | "View" | "Edit" | "Delete";

export const EMPTY_DEFAULTS: OtherMasterFormData = {
  masterType: "",
  masterName: "",
  lockStatus: "N",
  deleteReason: "",
};

export function mapRowToFormDefaults(
  mode: Mode,
  row: OtherMasterEntity | null,
): OtherMasterFormData {
  if (mode === "Create") return EMPTY_DEFAULTS;
  if (!row) return EMPTY_DEFAULTS;
  console.log(row);
  return {
    masterType: row.masterType,
    masterName: row.masterName,
    lockStatus: row.status,
    deleteReason: "",
  };
}
