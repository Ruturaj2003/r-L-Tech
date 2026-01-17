import type { AxiosResponse } from "axios";
import { apiClient } from "@/services/apiClient";

import {
  OtherMasterSchema,
  SaveOtherMasterSchema,
  DeleteOtherMasterSchema,
  MasterTypeSchema,
  DeleteReasonSchema,
} from "../schemas";

import {
  type OtherMaster,
  type SaveOtherMaster,
  type DeleteOtherMaster,
  type MasterType,
  type DeleteReason,
} from "../schemas";

/**
 * Checks whether a value is a non-null object.
 * Used for safely inspecting API responses.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Extracts an array from an API response.
 * Handles cases where data is returned directly
 * or wrapped inside a `data` property.
 */
function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (isObject(data) && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

/**
 * API methods for Other Master operations.
 */
export const otherMasterApi = {
  /**
   * Fetches the list of Other Master records for a subscription.
   *
   * @param subscID - Subscription ID
   * @returns List of validated OtherMaster records
   */
  async getList(subscID: number): Promise<OtherMaster[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetData/list",
      {
        params: { subscID },
      }
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) => OtherMasterSchema.parse(item));
  },

  /**
   * Fetches a single Other Master record by transaction number.
   *
   * @param mTransNo - Master transaction number
   * @returns Validated OtherMaster record
   */
  async getById(mTransNo: number): Promise<OtherMaster> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      `/api/OtherMasters/api/GetData/${mTransNo}`
    );

    return OtherMasterSchema.parse(response.data);
  },

  /**
   * Fetches available master types for dropdown usage.
   *
   * @returns List of master type dropdown values
   */
  async getMasterTypes(): Promise<MasterType[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetMasterType"
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) => MasterTypeSchema.parse(item));
  },

  /**
   * Fetches delete reasons for a subscription.
   *
   * @param subscID - Subscription ID
   * @returns List of delete reason dropdown values
   */
  async getDeleteReasons(subscID: number): Promise<DeleteReason[]> {
    const response: AxiosResponse<unknown> = await apiClient.get(
      "/api/OtherMasters/api/GetData/Load",
      {
        params: {
          MasterType: "Delete Reason",
          SubscID: subscID,
        },
      }
    );

    const rawList = extractArray(response.data);
    return rawList.map((item) => DeleteReasonSchema.parse(item));
  },

  /**
   * Saves (insert or update) an Other Master record.
   *
   * @param payload - Data to save
   * @returns Server response message
   */
  async save(payload: SaveOtherMaster): Promise<string> {
    const validatedPayload = SaveOtherMasterSchema.parse(payload);

    const response: AxiosResponse<unknown> = await apiClient.post(
      "/api/OtherMasters/api/SaveData",
      validatedPayload
    );

    if (typeof response.data !== "string") {
      throw new Error("Invalid save response from server");
    }

    return response.data;
  },

  /**
   * Deletes an Other Master record.
   *
   * @param payload - Delete request data
   */
  async delete(payload: DeleteOtherMaster): Promise<void> {
    const validated = DeleteOtherMasterSchema.parse(payload);

    await apiClient.delete(
      `/api/OtherMasters/api/DeleteData/${validated.mTransNo}`,
      {
        params: {
          userNo: validated.userNo,
          reason: validated.reason,
        },
      }
    );
  },
};
