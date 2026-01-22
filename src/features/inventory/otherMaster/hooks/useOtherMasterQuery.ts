/**
 * React Query hook for fetching a single Other Master record by transaction number.
 * Uses cached data and avoids running the query until a valid ID is provided.
 */
import { useQuery } from "@tanstack/react-query";
import { otherMasterApi } from "../services/otherMasterApi";
import type { OtherMasterEntity } from "../schemas";
import { otherMasterQueryKeys } from "./queryKeys";

export function useOtherMasterQuery(mTransNo: number) {
  return useQuery<OtherMasterEntity>({
    queryKey: otherMasterQueryKeys.detail(mTransNo),
    queryFn: () => otherMasterApi.getById(mTransNo),
    enabled: mTransNo > 0,
  });
}
