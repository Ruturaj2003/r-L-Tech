import { useQuery } from "@tanstack/react-query";
import { otherMasterApi } from "../services/otherMasterApi";
import { otherMasterQueryKeys } from "./queryKeys";
import type {
  MasterTypeOption,
  DeleteReasonOption,
} from "../types/otherMaster.types";
export function useMasterTypesQuery() {
  return useQuery<MasterTypeOption[]>({
    queryKey: otherMasterQueryKeys.masterTypes(),
    queryFn: () => otherMasterApi.getMasterTypeOptions(),
    staleTime: Infinity,
  });
}

export function useDeleteReasonsQuery(subscID: number) {
  return useQuery<DeleteReasonOption[]>({
    queryKey: otherMasterQueryKeys.deleteReasons(subscID),
    queryFn: () => otherMasterApi.getDeleteReasonOptions(subscID),
    enabled: subscID > 0,
    staleTime: Infinity,
  });
}
