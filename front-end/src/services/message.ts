import { httpMethod } from "../constants/common";
import { apiHandler } from "./instances";

export const getUsersForSidebar = async (params: amy) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/users",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: params,
  });
  return res;
};
export const getMessage = async (params: amy) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/get",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: params,
  });
  return res;
};
