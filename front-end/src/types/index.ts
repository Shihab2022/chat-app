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
