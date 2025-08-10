import { httpMethod } from "../constants/common";
import { apiHandler } from "./instances";

export const getUsersForSidebar = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/users",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: params,
  });
  return res;
};
export const getMessage = async (params: any) => {
  console.log({ params });
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/get",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: params,
  });
  return res;
};
export const sendMessage = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/send",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
