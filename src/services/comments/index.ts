import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";
import { instance } from "../instance";
import { store } from "@/store";
import { Endpoints } from "../endpoints";

export const getAllCommentsForApost = async ({
  postId,
  page = 0,
}: {
  postId: string;
  page: number;
}) => {
  // const userPostSchema = createExtendedSchema(PostsListModelSchema);
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(
      `${Endpoints.GetCommentsForPost}?postId=${encodeURIComponent(
        postId
      )}&page=${page}&size=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .json();
  return genericSchema.parse(response);
};
export const makeCommentOnAPost = async ({
  postId,
  comment,
}: {
  postId: string;
  comment: string;
}) => {
  // const userPostSchema = createExtendedSchema(PostsListModelSchema);
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.MakeCommentOnPost, {
      body: JSON.stringify({ postId: postId, commentText: comment }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};
