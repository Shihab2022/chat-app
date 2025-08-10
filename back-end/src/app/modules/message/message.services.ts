import AppError from '../../error/appError';

import bcrypt from 'bcrypt';
import { TMessages } from './message.interface';
import { Message } from './message.model';
import { User } from '../user/user.model';
const createMessageIntoDB = async (payload: TMessages) => {
  const result = await Message.create(payload);
  return result;
};
const getMessageFromDB = async (payload: Partial<TMessages>) => {
  const { senderId, receiverId } = payload;
  const searchCriteria = {
    $or: [
      {
        $and: [{ senderId }, { receiverId }],
      },
      {
        $and: [{ receiverId: senderId }, { senderId: receiverId }],
      },
    ],
  };

  const messages = await Message.find(searchCriteria);
  return messages;
};
export const getUsersForSidebar = async (payload: any) => {
  console.log({ payload });
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
