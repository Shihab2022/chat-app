import { Types } from 'mongoose';

export type TMessages = {
  sender_id?: string | Types.ObjectId;
  receiverId?: string | Types.ObjectId;
  receiver_id?: string | Types.ObjectId;
  content?: string;
  timestamp?: string;
  isDeleted?: boolean;
  userToChatId?: string;
  myId?: string;
  text?: string;
  replyId?: Types.ObjectId;
  image?: string;
  groupId?: string | number;
  group_id?: string | number;
  reactions?: { emoji: string; userIds: string[] }[];
};
