import z from "zod";

export const DeleteReasonOptionSchema = z.object({
  mTransNo: z.number(),
  masterName: z.string().min(1),
});

export type DeleteReasonOption = z.infer<typeof DeleteReasonOptionSchema>;
