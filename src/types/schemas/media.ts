import { z } from "zod";

export const schema = z.array(
  z.object({
    extension: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
    url: z.string(),
  })
);
