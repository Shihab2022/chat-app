import { Types } from 'mongoose';

export type TMessages = {
  senderId?: Types.ObjectId;
  receiverId?: Types.ObjectId;
  content: string;
  timestamp: string;
  isDeleted: boolean;
  userToChatId?: string;
  myId?: string;
  text?: string;
  replyId?: Types.ObjectId;
  image?: string;
  reactions?: { emoji: string; userIds: string[] }[];
};
