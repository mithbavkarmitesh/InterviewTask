import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";
import { createExtendedSchema } from "@/types/schemas/common";
// import {
//   InterstsHobbiesModelSchema,
//   PostsListModelSchema,
//   ReelsByCategoryModelSchema,
// } from "@/types/schemas/posts";
import { Endpoints } from "../endpoints";

export const saveUserStory = async (body: Object) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const userName =
    selectUser(store?.getState()).userInfo?.userName?.value || "";
  
  const response = await instance
    .post(`mongo/stories/save-story`, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...body, userName }),
    })
    .json();
  return genericSchema.parse(response);
};

export const getLoggedInUserStories = async (page = 0) => {
  // const userPostSchema = createExtendedSchema(PostsListModelSchema);
  const token = selectUser(store?.getState()).accessToken || "";
  const userName =
    selectUser(store?.getState()).userInfo?.userName?.value || "";
  
  const response = await instance
    .get(`mongo/stories/loggedInUserStories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};
export const getFriendsStories = async (page = 0) => {
  // const userPostSchema = createExtendedSchema(PostsListModelSchema);
  const token = selectUser(store?.getState()).accessToken || "";
  const userName =
    selectUser(store?.getState()).userInfo?.userName?.value || "";
  
  const response = await instance
    .get(
      `mongo/stories/otherUsersStories?page=${page}&pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .json();
  return genericSchema.parse(response);
};


export const  heartOrUnheartStory = async (storyId: string) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
  .post(Endpoints.HeartOrUnheartStory + `${encodeURIComponent(storyId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .json();
return genericSchema.parse(response);
};
//
