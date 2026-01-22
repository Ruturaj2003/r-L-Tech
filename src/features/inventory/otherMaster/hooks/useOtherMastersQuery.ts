import { useQuery } from "@tanstack/react-query";

import { otherMasterApi } from "@/features/inventory/otherMaster/services/otherMasterApi";

import { otherMasterQueryKeys } from "@/features/inventory/otherMaster/hooks/queryKeys";

import type { OtherMasterEntity } from "@/features/inventory/otherMaster/schemas";

export function useOtherMastersQuery(subscID: number) {
  return useQuery<OtherMasterEntity[]>({
    queryKey: otherMasterQueryKeys.list(),
    queryFn: () => otherMasterApi.getList(subscID),
    // enabled:  It will call the api with only valid data
    enabled: subscID > 0,
    staleTime: 5 * 60 * 1000,
  });
}
