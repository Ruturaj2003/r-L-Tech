/**
 * React Query keys for all Other Master related queries.
 * Keeps query keys consistent for caching, refetching, and invalidation.
 */

export const otherMasterQueryKeys = {
  all: ["otherMaster"] as const,
  list: () => [...otherMasterQueryKeys.all, "list"] as const,
  detail: (mTransNo: number) => [
    ...otherMasterQueryKeys.all,
    "detail",
    mTransNo,
  ],
  masterTypes: () => [...otherMasterQueryKeys.all, "masterTypes"] as const,
  deleteReasons: (subscID: number) =>
    [...otherMasterQueryKeys.all, "deleteReasons", subscID] as const,
};
