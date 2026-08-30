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
  file_url?: string;
  fileUrl?: string;
  file_name?: string;
  fileName?: string;
  file_type?: string;
  fileType?: string;
  groupId?: string | number;
  group_id?: string | number;
  reactions?: { emoji: string; userIds: string[] }[];
};
