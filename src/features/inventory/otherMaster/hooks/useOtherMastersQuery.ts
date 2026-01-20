import { useQuery } from "@tanstack/react-query";

import { otherMasterApi } from "../services/otherMasterApi";

import { otherMasterQueryKeys } from "./queryKeys";

import type { OtherMaster } from "../schemas";

export function useOtherMastersQuery(subscID: number) {
  return useQuery<OtherMaster[]>({
    queryKey: otherMasterQueryKeys.list(subscID),
    queryFn: () => otherMasterApi.getList(subscID),
    // enabled:  It will call the api with only valid data
    enabled: subscID > 0,
    staleTime: 5 * 60 * 1000,
  });
}
