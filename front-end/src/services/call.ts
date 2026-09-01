/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpMethod } from "../constants/common";
import { apiHandler } from "./instances";

/** Fetch the current user's call log (history). */
export const getCallHistoryAPI = async (params: any = {}) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/call/history",
    axiosMethod: httpMethod.GET,
    formData: false,
    params,
  });
};

/** Manually persist a call attempt (fallback if the socket path cannot be used). */
export const createCallLogAPI = async (params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/call/logs",
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
};

/** Finalize a call log row (status, end time, duration). */
export const updateCallLogAPI = async (callId: string | number, params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/call/logs/${callId}`,
    axiosMethod: httpMethod.PATCH,
    formData: false,
    params,
  });
};