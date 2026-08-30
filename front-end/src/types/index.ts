/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpMethod } from "../constants/common";
import { ReactNode } from "react";
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
  id: string; // 👈 add any property you expect
} & Record<string, any>;
export type TConversation = {
  activeUsers?: string[];
  loginUser: TUser;
  allUsers?: any;
};

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiverId: string;
  text?: string;
  seen?: boolean;
  pending?: boolean;
  isDeleted?: boolean;
  replyId?: string;
  reactions?: Reaction[];
  created_at: string;
  seen_at?: string;
}

export type GroupedMessages = {
  [date: string]: ChatMessage[];
};
export type TMessage = {
  id: string;
  sender_id: string;
  receiverId: string;
  text?: string;
  image?: string;
  file?: string;
  fileName?: string;
  fileType?: string;
  created_at: string;
  updatedAt?: string;
  time?: string;
  seen: boolean;
  seen_at?: string;
  pending?: boolean;
  isDeleted?: boolean;
  replyId?: string;
  reactions?: Reaction[];
  group_id?: string;
};

export type Reaction = {
  userId: string;
  emoji: string;
  id: string;
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
  isRightSidebarOpen: boolean;
};

export type rightSideActionTypes = {
  title: string;
  icon: any;
  isRed: boolean;
  id: string;
};

export type GroupMember = {
  id: string | number;
  user_id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  joined_at?: string;
};

export type GroupDetails = {
  id: string | number;
  name: string;
  description?: string;
  created_by?: string | number;
  created_at?: string;
  updated_at?: string;
  isGroup?: boolean;
  members?: GroupMember[];
  img?: string;
} & Record<string, any>;

export interface Feature {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
  content: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}
