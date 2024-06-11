import z from "zod";
import { PostsModelSchema, ReelModelSchema } from "@/types/schemas/posts";

import UserStories from "./mocks/stories";

export type Posts = z.infer<typeof PostsModelSchema>;
export type SingleReel = z.infer<typeof ReelModelSchema>;

export type UserStory = (typeof UserStories)[0];
