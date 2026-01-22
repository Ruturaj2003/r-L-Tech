import type { AxiosResponse } from "axios";
import { apiClient } from "@/services/apiClient";

import {
  OtherMasterEntitySchema,
  // UpsertOtherMasterRequestSchema,
  // DeleteOtherMasterRequestSchema,
  OtherMasterTypeOptionSchema,
  OtherMasterDeleteReasonOptionSchema,
} from "../schemas";
import type {
  OtherMasterEntity,
  OtherMasterTypeOption,
  OtherMasterDeleteReasonOption,
} from "../schemas";
import {
  DeleteOtherMasterRequestSchema,
  UpsertOtherMasterRequestSchema,
  type DeleteOtherMasterRequest,
  type UpsertOtherMasterRequest,
} from "../schemas/otherMasterForm.schema";

/* ------------------------------------------------------------------ */
/*                         Internal Utilities                          */
/* ------------------------------------------------------------------ */

/**
 * Narrowing helper to check for plain objects.
 * Used only for defensive API response handling.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Extracts an array from common API response shapes.
 *
 * Supported formats:
 * - []
 * - { data: [] }
 */
function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (isObject(data) && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

/* ------------------------------------------------------------------ */
/*                           API Service                               */
/* ------------------------------------------------------------------ */

/**
 * Other Master API service
 *
 * Boundary:
 * - All network communication for Other Master domain
 *
 * Rules:
 * - All inputs validated via Zod before request
 * - All outputs validated via Zod after response
 * - No UI logic or state handling
 */
export const otherMasterApi = {
  /**
   * Fetch Other Master records for a subscription.
   *
   * Boundary:
   * - API read (list)
   */
  async getList(subscID: number): Promise<OtherMasterEntity[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetData/list",
      {
        params: { SubscID: subscID },
      },
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) => OtherMasterEntitySchema.parse(item));
  },

  /**
   * Fetch a single Other Master record by transaction number.
   *
   * Boundary:
   * - API read (detail)
   */
  async getById(mTransNo: number): Promise<OtherMasterEntity> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      `/api/OtherMasters/api/GetData/${mTransNo}`,
    );

    return OtherMasterEntitySchema.parse(response.data);
  },

  /**
   * Fetch master type lookup values.
   *
   * Boundary:
   * - API lookup (reference data)
   */
  async getMasterTypeOptions(): Promise<OtherMasterTypeOption[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetMasterType",
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) => OtherMasterTypeOptionSchema.parse(item));
  },

  /**
   * Fetch delete reason lookup values for a subscription.
   *
   * Boundary:
   * - API lookup (reference data)
   */
  async getDeleteReasonOptions(
    subscID: number,
  ): Promise<OtherMasterDeleteReasonOption[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetData/Load",
      {
        params: {
          MasterType: "Delete Reason",
          SubscID: subscID,
        },
      },
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) =>
      OtherMasterDeleteReasonOptionSchema.parse(item),
    );
  },

  /**
   * Insert or update an Other Master record.
   *
   * Boundary:
   * - API mutation (upsert)
   *
   * Notes:
   * - Insert vs Update is controlled by `status` field
   * - Payload is validated before submission
   */
  async upsert(payload: UpsertOtherMasterRequest): Promise<string> {
    const validatedPayload = UpsertOtherMasterRequestSchema.parse(payload);

    const response: AxiosResponse<unknown> = await apiClient.post(
      "/api/OtherMasters/api/SaveData",
      validatedPayload,
    );

    if (typeof response.data !== "string") {
      throw new Error("Invalid upsert response from server");
    }

    return response.data;
  },

  /**
   * Delete an Other Master record.
   *
   * Boundary:
   * - API mutation (delete)
   *
   * Notes:
   * - Delete reason is mandatory
   * - Uses URL + query params as required by backend
   */
  async delete(payload: DeleteOtherMasterRequest): Promise<void> {
    const validated = DeleteOtherMasterRequestSchema.parse(payload);

    await apiClient.delete(
      `/api/OtherMasters/api/DeleteData/${validated.mTransNo}`,
      {
        params: {
          userNo: validated.userNo,
          reason: validated.reason,
        },
      },
    );
  },
};
