// Note : Do NOT reuse API schema types directly in UI
export interface MasterTypeOption {
  masterType: string;
}

export interface DeleteReasonOption {
  mTransNo: number;
  masterName: string;
}

export type FORM_MODE = "Create" | "View" | "Edit" | "Delete";
