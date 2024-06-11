import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";
import { createExtendedSchema } from "@/types/schemas/common";
import {
  InterstsHobbiesModelSchema,
  PostsListModelSchema,
  ReelsByCategoryModelSchema,
} from "@/types/schemas/posts";
import { Endpoints } from "../endpoints";

export const saveUserPost = async (body: Object) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.SaveMyPost, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .json();
  return genericSchema.parse(response);
};

export const getUserPosts = async (page = 0) => {
  const userPostSchema = createExtendedSchema(PostsListModelSchema);
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYmNkQDUwNDUiLCJpYXQiOjE3MTUzNjQzODYsImV4cCI6MTcxNzA5MjM4Nn0.6fI-u31eJCvuJR6i6VCKRYFDuhGp7SfoUuDey7_R8Qc";
  const response = await instance
    .get(`${Endpoints.GetDashboardPosts}?page=${0}&size=4`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  console.log("response", response);

  // return userPostSchema.parse(response);
  return response;
};

export const getUserInterestsAndHobbies = async () => {
  const interestsAndHobbiesSchema = createExtendedSchema(
    InterstsHobbiesModelSchema
  );
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(Endpoints.GetInterests, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return (
    interestsAndHobbiesSchema.parse(response).data?.interestAndhobbies || []
  );
};

export const getPublicReelsByCategory = async (
  category = "",
  pageParam = 0
) => {
  const publicReelsSchema = createExtendedSchema(ReelsByCategoryModelSchema);
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(
      Endpoints.GetPublicReels +
        `?category=${encodeURIComponent(
          category
        )}&page=${pageParam}&pageSize=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .json();
  console.log("response23==>", response);
  return /* publicReelsSchema */ genericSchema.parse(response).data || [];
};

export const heartOrUnHeart = async (postId: string) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.Heart_Unheart + `${encodeURIComponent(postId)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};
