/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { COMMON_ERROR_MESSAGE, httpMethod } from "../constants/common";
import { getToken } from "../utils/auth";
import { instanceParams } from "../types";

export const apiHandler: any = ({
  baseURL = import.meta.env.VITE_BASE_API_URL,
  params,
  path,
  formData,
  axiosMethod,
  imageBuffer = null,
}: instanceParams) => {
  const parsedPath = baseURL + path;
  //   if (axiosMethod === "get" && Object.keys(params).length) {
  //     parsedPath = `${parsedPath}?${qs.stringify(params)}`;
  //   }
  if (imageBuffer) {
    return axios
      .post(`${parsedPath}?email=${params.email}`, imageBuffer, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        return {
          data: res.data,
          success: res?.data?.success === false ? false : true,
          error: res?.data?.error,
          params,
        };
      })
      .catch((err) => {
        const e = err.toJSON();
        if (e.status === 401) {
          window.location.href = "/login";
        } else {
          return {
            status: e.status,
            message: err?.response?.data?.message || COMMON_ERROR_MESSAGE,
            success: false,
            params,
          };
        }
      });
  }

  const options = {
    headers: {
      "Content-Type": formData ? "multipart/form-data" : "application/json",
      Authorization: getToken(),
    },
    method: axiosMethod,
    url: parsedPath,
    // data: formData ? params : JSON.stringify(params),
    data:
      axiosMethod.toLowerCase() === httpMethod.GET
        ? undefined
        : formData
        ? params
        : JSON.stringify(params),
    params: axiosMethod.toLowerCase() === httpMethod.GET ? params : undefined,
  };
  return axios(options)
    .then((res) => ({
      data: res?.data?.data,
      success: res?.data?.success === false ? false : true,
      error: res?.data?.error,
      params,
    }))
    .catch((err) => {
      const e = err.toJSON();
      if (e.status === 401) {
        window.location.href = "/login";
      } else {
        return {
          status: e.status,
          message: err?.response?.data?.message || COMMON_ERROR_MESSAGE,
          success: false,
          params,
        };
      }
    });
};
