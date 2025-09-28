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

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export type GroupedMessages = {
  [date: string]: ChatMessage[];
};
export type TMessage = {
  _id: string; // comes as string in JSON
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string; // usually ISO string from backend
  updatedAt?: string;
  time?: string;
  seen: boolean;
  seenAt?: string;
};

export type Reaction = {
  userId: string;
  emoji: string;
  _id: string;
};
export type TConversationState = {
  messages: GroupedMessages;
  receiverId: string;
  isEmojiOpen: boolean;
  isOneIcon?: boolean;
  anchorElEmoji?: any;
  isEmojiAdded?: boolean;
  emojiDetailsDialogStatus: boolean;
  selectedMessage?: any;
  selectedReactions?: Reaction[];
  editedMessage?: any;
  repliedMessage?: any;
};
