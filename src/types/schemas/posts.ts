import { z } from "zod";

const UrlsAndFileType = z.array(
  z.object({
    url: z.union([z.string(), z.null()]),
    fileType: z.string(),
  })
);
export const PostsModelSchema = z.object({
  postId: z.string(),
  userName: z.string(),
  urlsAndFileType: z.union([UrlsAndFileType, z.null()]),
  postText: z.union([z.string(), z.null()]),
  restrictions: z.string(),
  latitude: z.union([z.null(), z.string()]),
  longitude: z.union([z.null(), z.string()]),
  address: z.union([z.null(), z.string()]),
  fileType: z.string(),
  createdAt: z.any(),
  hearted: z.boolean(),
  firstName: z.union([z.null(), z.string()]),
  surName: z.union([z.null(), z.string()]),
  displayPhoto: z.union([z.null(), z.string()]),
});

export const PostsListModelSchema = z.array(PostsModelSchema);

export const ReelModelSchema = z.object({
  reelsId: z.string(),
  userName: z.string().optional(),
  firstName: z.string().optional(),
  surName: z.string().optional(),
  displayPhoto: z.string().optional(),
  caption: z.string().optional(),
  reelsWithFileType: z
    .object({ url: z.string(), fileType: z.string() })
    .optional(),
  restrictions: z.string().optional(),
  createdAt: z.string().optional(),
  catagories: z.array(z.string()).optional(),
});

export const ReelsByCategoryModelSchema = z.record(
  z.string(),
  z.array(ReelModelSchema)
);

export const InterstsHobbiesModelSchema = z.object({
  username: z.string(),
  interestAndhobbies: z.array(z.string()),
});

export const InterstsHobbiesListModelSchema = z.union([
  z.null(),
  InterstsHobbiesModelSchema,
]);
