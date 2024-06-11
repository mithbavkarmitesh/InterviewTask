import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { genericSchema } from "@/types/schemas/auth";
import { Endpoints } from "../endpoints";

export interface RegionDTO {
  Message?: string;
  Status?: string;
  PostOffice?: PostOffice[];
}

export interface PostOffice {
  Name?: string;
  Description?: null;
  BranchType?: string;
  DeliveryStatus?: string;
  Circle?: string;
  District?: string;
  Division?: string;
  Region?: string;
  Block?: string;
  State?: string;
  Country?: string;
  Pincode?: string;
}

export const getRegionByPincode = async (pincode: string) => {
  //   const token = selectUser(store?.getState()).accessToken || "";
  const response = (await instance
    .get(Endpoints.Get_Region + pincode, {
      headers: {
        //   Authorization: `Bearer ${token}`,
      },
    })
    .json()) as RegionDTO[];
  return response; //genericSchema.parse(response);
};
