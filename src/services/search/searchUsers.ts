import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";

export default async (name: string, page = 0, size = 10) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .get(
      `postgres/app-user/search?page=${page}&size=${size}&namePrefix=${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .json();
  return response; //genericSchema.parse(response);
};
