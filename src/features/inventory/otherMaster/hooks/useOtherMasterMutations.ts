/**
 * React Query hook for saving and deleting Other Master records.
 * Automatically refreshes the related list after a successful mutation.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { otherMasterApi } from "../services/otherMasterApi";
import { otherMasterQueryKeys } from "./queryKeys";

import type { SaveOtherMaster, DeleteOtherMaster } from "../schemas";

export function useOtherMasterMutation(subscID: number) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (payload: SaveOtherMaster) => otherMasterApi.save(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: otherMasterQueryKeys.list(subscID),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (payload: DeleteOtherMaster) => otherMasterApi.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: otherMasterQueryKeys.list(subscID),
      });
    },
  });

  return {
    saveMutation,
    deleteMutation,
  };
}
