/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpMethod } from "../constants/common";

export type pramsTypes = Record<string, unknown>;
export type instanceParams = {
  baseURL: string;
  params: pramsTypes;
  path: string;
  formData: boolean;
  axiosMethod: (typeof httpMethod)[keyof typeof httpMethod];
  imageBuffer?: ArrayBuffer | null;
};

export interface SignInFormInputs {
  email: string;
  password: string;
}

export type TUser = {
  _id: string; // 👈 add any property you expect
} & Record<string, any>;
export type TConversation = {
  activeUsers?: string[];
  loginUser: TUser;
  allUsers?: any;
};
