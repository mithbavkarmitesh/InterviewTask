import { z } from "zod";

export const genericSchema = z.object({
  flag: z.boolean(),
  code: z.number(),
  message: z.string(),
  data: z.any(),
});
