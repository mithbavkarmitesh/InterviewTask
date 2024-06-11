import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
});

export const userinfoSchema = z.object({
  password: z.string(),
  username: z.string(),
});
