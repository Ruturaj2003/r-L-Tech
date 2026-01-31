import type { AxiosResponse } from "axios";
import {
  SalesTeamListResponseSchema,
  SalesTeamSingleResponseSchema,
  type SalesTeamEntity,
} from "../schemas/salesTeam.schema";
import { apiClient } from "@/services/apiClient";
import { normalizeApiError } from "@/services/normalizeApiError";

export const salesTeamApi = {
  async getList(subscID: number): Promise<SalesTeamEntity[]> {
    try {
      const response: AxiosResponse<unknown> = await apiClient.get(
        "/sales-teams",
        { params: { subscID } },
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
        "/sales-teams",
        { params: { mTransNo } },
      );

      const parsed = SalesTeamSingleResponseSchema.parse(response.data);
      return parsed.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
