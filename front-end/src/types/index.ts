import { httpMethod } from "../constants/common";

export type instanceParams = {
  baseURL: string;
  params: Record<string, unknown>;
  path: string;
  formData: boolean;
  axiosMethod: (typeof httpMethod)[keyof typeof httpMethod];
  imageBuffer: ArrayBuffer | null;
};
