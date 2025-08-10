import AppError from '../../error/appError';

import bcrypt from 'bcrypt';
import { TMessages } from './message.interface';
import { User } from '../user/user.model';
import Message from './message.model';
const createMessageIntoDB = async (payload: TMessages) => {
  const result = await Message.create(payload);
  return result;
};
const getMessageFromDB = async (payload: Partial<TMessages>) => {
  const { myId, userToChatId } = payload;
  console.log({ myId, userToChatId });
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  return messages;
};
export const getUsersForSidebar = async (payload: any) => {
  const loggedInUserId = payload._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('-password');

  return filteredUsers;
};

export const MessageServices = {
  createMessageIntoDB,
  getMessageFromDB,
  getUsersForSidebar,
};
