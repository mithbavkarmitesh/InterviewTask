import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";
import { Endpoints } from "../endpoints";

export const saveFcmToken = async (body: Object) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(Endpoints.SaveFcmToken, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    .json();
  return genericSchema.parse(response);
};

export const deleteFcmToken = async (fcmToken: String) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .delete(`mongo/userToken/fcm-tokens/${fcmToken}`, {
      headers: {
        AuthorizationRequired: "true",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
  return genericSchema.parse(response);
};


export const getAllNotifications = async (pageNumber: Number) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const userName =
    selectUser(store?.getState()).userInfo?.userName?.value || "";
  const response = await instance
    .get(
      `mongo/notifications/getallNotifications/${encodeURIComponent(
        userName
      )}?page=${pageNumber}&pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .json();
  return genericSchema.parse(response);
};


