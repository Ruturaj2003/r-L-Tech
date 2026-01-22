import { useMutation, useQueryClient } from "@tanstack/react-query";
import { otherMasterApi } from "../services/otherMasterApi";
import { otherMasterQueryKeys } from "./queryKeys";

import type {
  UpsertOtherMasterRequest,
  DeleteOtherMasterRequest,
} from "../schemas/otherMasterForm.schema";

/**
 * React Query mutation hook for inserting or updating
 * Other Master records.
 *
 * Boundary:
 * - API mutation (Upsert)
 *
 * Side Effects:
 * - Invalidates Other Master list query on success
 *
 * Notes:
 * - Payload must strictly match backend contract
 * - Insert vs Update is controlled by `status` field
 */
export function useUpsertOtherMasterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertOtherMasterRequest) =>
      otherMasterApi.upsert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: otherMasterQueryKeys.list(),
      });
    },
  });
}

/**
 * React Query mutation hook for deleting
 * an Other Master record.
 *
 * Boundary:
 * - API mutation (Delete)
 *
 * Side Effects:
 * - Invalidates Other Master list query on success
 *
 * Notes:
 * - Delete reason is mandatory and audited
 */
export function useDeleteOtherMasterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteOtherMasterRequest) =>
      otherMasterApi.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: otherMasterQueryKeys.list(),
      });
    },
  });
}
