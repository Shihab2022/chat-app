import { httpMethod } from "../constants/common";
import { connectSocket } from "../utils/socketService";
import { apiHandler } from "./instances";

export const loginUserApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/login",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};

export const registerUserApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/create",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
export const checkAuth = async () => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/check",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: {},
  });
  connectSocket("");
  return res;
};

export const forgotPasswordApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/forget-password",
    axiosMethod: "post",
    formData: false,
    params: params,
  });
  return res;
};
