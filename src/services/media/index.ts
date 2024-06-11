import { instance } from "@/services/instance";
import { store } from "@/store";
import { selectUser } from "@/store/userSlice";
import { schema } from "@/types/schemas/media";
import { UploadMediaFilesApiParams } from "./types";
import { genericSchema } from "@/types/schemas/auth";

/**
 * API call to upload media files
 * @param params
 * @returns
 */
export const UploadMediaFilesAPI = async (
  params: UploadMediaFilesApiParams
) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .post(`postgres/api/s3/uploadfiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    })
    .json();
  return schema.parse(response);
};

export const DeleteMediaFileAPI = async (fileName: string) => {
  const token = selectUser(store?.getState()).accessToken || "";
  const response = await instance
    .delete(`postgres/api/s3/delete?fileName=${encodeURIComponent(fileName)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie:
          "JSESSIONID=4E4BBBC6F437D385B5D2383B2AE28033; JSESSIONID=3137C4D85E013C66D033A14DAC63637F",
      },
    })
    .json();
  return genericSchema.parse(response);
};
