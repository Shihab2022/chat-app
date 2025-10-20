/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpMethod } from "../constants/common";
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
export const acceptInviteApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/accept-invite",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
export const confirmAccountApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/confirm",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
export const checkAuth = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/check",
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
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
export const updatePasswordApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/update-password",
    axiosMethod: "post",
    formData: false,
    params: params,
  });
  return res;
};

export const inviteUserApi = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/user/invite",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
