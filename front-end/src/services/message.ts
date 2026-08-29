/* eslint-disable @typescript-eslint/no-explicit-any */
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
export const addEmoji = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/emoji",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
export const removeEmoji = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/emoji",
    axiosMethod: httpMethod.DELETE,
    formData: false,
    params: params,
  });
  return res;
};
export const editMessage = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message",
    axiosMethod: httpMethod.PATCH,
    formData: false,
    params: params,
  });
  return res;
};
export const deleteMessage = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message",
    axiosMethod: httpMethod.DELETE,
    formData: false,
    params: params,
  });
  return res;
};
export const forwardMessageAPI = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/forward",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};
export const replyMessageAPI = async (params: any) => {
  const res = await apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/reply",
    axiosMethod: httpMethod.POST,
    formData: false,
    params: params,
  });
  return res;
};

export const clearChatAPI = async (params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/clear",
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
};

export const getGroupsAPI = async () => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/groups",
    axiosMethod: httpMethod.GET,
    formData: false,
    params: {},
  });
};

export const createGroupAPI = async (params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/groups",
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
};

export const addGroupMemberAPI = async (groupId: string | number, params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}/members`,
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
};
export const getPendingGroupInvitationsAPI = async () => apiHandler({
  baseURL: import.meta.env.VITE_BASE_API_URL, path: "/message/groups/invitations/pending",
  axiosMethod: httpMethod.GET, formData: false, params: {},
});
export const acceptGroupInvitationAPI = async (invitationId: string | number) => apiHandler({
  baseURL: import.meta.env.VITE_BASE_API_URL, path: `/message/groups/invitations/${invitationId}/accept`,
  axiosMethod: httpMethod.POST, formData: false, params: {},
});

export const getGroupDetailsAPI = async (groupId: string | number, params?: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}`,
    axiosMethod: httpMethod.GET,
    formData: false,
    params: params || {},
  });
};

export const removeGroupMemberAPI = async (groupId: string | number, memberId: string | number) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}/members/${memberId}`,
    axiosMethod: httpMethod.DELETE,
    formData: false,
    params: {},
  });
};

export const setGroupMemberRoleAPI = async (groupId: string | number, memberId: string | number, role: string) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}/members/${memberId}/role`,
    axiosMethod: httpMethod.PATCH,
    formData: false,
    params: { role },
  });
};

export const updateGroupAPI = async (groupId: string | number, params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}`,
    axiosMethod: httpMethod.PATCH,
    formData: false,
    params,
  });
};

export const leaveGroupAPI = async (groupId: string | number) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}/leave`,
    axiosMethod: httpMethod.POST,
    formData: false,
    params: {},
  });
};

export const deleteGroupAPI = async (groupId: string | number) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: `/message/groups/${groupId}`,
    axiosMethod: httpMethod.DELETE,
    formData: false,
    params: {},
  });
};

export const getGroupMessagesAPI = async (params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/group/get",
    axiosMethod: httpMethod.GET,
    formData: false,
    params,
  });
};

export const sendGroupMessageAPI = async (params: any) => {
  return apiHandler({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    path: "/message/group/send",
    axiosMethod: httpMethod.POST,
    formData: false,
    params,
  });
};
