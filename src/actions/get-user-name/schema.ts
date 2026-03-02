import { z } from "zod";

export const getUserNameSchema = z.object({
  userId: z.string().min(1),
});

export type GetUserNameSchema = z.infer<typeof getUserNameSchema>;
