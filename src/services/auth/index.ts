import { instance } from "@/services/instance";
import { genericSchema } from "@/types/schemas/auth";
import { RequestJWTTokenDTO } from "./types";
import { storage } from "@/store";
import { Endpoints } from "../endpoints";

const {
  Send_Email_OTP,
  Send_Phone_OTP,
  Verify_Email_OTP,
  Verify_Phone_OTP,
  RegisterUser,
  RequestJWTToken,
} = Endpoints;

export const sendEmailOtp = async (email: string) => {
  const response = await instance
    .post(`${Send_Email_OTP}?email=${encodeURIComponent(email)}`)
    .json();
  return genericSchema.parse(response);
};

export const sendPhoneOtp = async (phoneNumber: string) => {
  const response = await instance
    .post(`${Send_Phone_OTP}?phoneNumber=${encodeURIComponent(phoneNumber)}`)
    .json();
  
  return genericSchema.parse(response);
};

export const verifyOtpWithEmail = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  const response = await instance
    .post(
      `${Verify_Email_OTP}?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`
    )
    .json();
  return genericSchema.parse(response);
};
export const verifyOtpWithPhoneNumber = async ({
  otp,
  phoneNumber,
}: {
  otp: string;
  phoneNumber: string;
}) => {
  const response = await instance
    .post(
      `${Verify_Phone_OTP}?phoneNumber=${encodeURIComponent(
        phoneNumber
      )}&otp=${encodeURIComponent(otp)}`
    )
    .json();
  return genericSchema.parse(response);
};

export const registerUser = async (params: FormData) => {
  const image = storage.getString("USER_PROFILE_IMAGE_URL");

  const response = await instance
    .post(
      `${RegisterUser}${
        image && image?.length > 0 ? `?image=${encodeURIComponent(image)}` : ""
      }`,
      {
        body: params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .json();
  return genericSchema.parse(response);
};

export const requestJWTToken = async (body: RequestJWTTokenDTO) => {
  const response = await instance
    .post(RequestJWTToken, {
      body: JSON.stringify(body),
    })
    .json();
  return genericSchema.parse(response);
};
