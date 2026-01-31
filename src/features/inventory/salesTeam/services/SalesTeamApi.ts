import type { AxiosResponse } from "axios";
import {
  SalesTeamBranchOptionResponseSchema,
  SalesTeamDesignationOptionResponseSchema,
  SalesTeamListResponseSchema,
  SalesTeamSingleResponseSchema,
  type SalesTeamBranchOption,
  type SalesTeamDesignationOption,
  type SalesTeamEntity,
} from "../schemas/salesTeam.schema";
import { apiClient } from "@/services/apiClient";
import { normalizeApiError } from "@/services/normalizeApiError";

export const salesTeamApi = {
  async getList(subscID: number, userNo: number): Promise<SalesTeamEntity[]> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(
        "/sales-teams",
        {
          params: { subscID, userNo },
        },
      );

      const parsed = SalesTeamListResponseSchema.parse(response.data);
      return parsed.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getSingle(mTransNo: number): Promise<SalesTeamEntity> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(
        `/sales-teams/${mTransNo}`,
      );

      const parsed = SalesTeamSingleResponseSchema.parse(response.data);
      return parsed.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getBranchOptions(): Promise<SalesTeamBranchOption[]> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(
        "/sales-teams/options/branches",
      );

      const parsed = SalesTeamBranchOptionResponseSchema.parse(response.data);
      return parsed.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
  async getDesignationOptions(
    subscID: number,
  ): Promise<SalesTeamDesignationOption> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(
        "/sales-teams/options/designations",
        {
          params: { subscID },
        },
      );

      const parsed = SalesTeamDesignationOptionResponseSchema.parse(
        response.data,
      );

      return parsed.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
