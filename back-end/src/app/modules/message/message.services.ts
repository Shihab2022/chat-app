import AppError from '../../error/appError';

import bcrypt from 'bcrypt';
import { TMessages } from './message.interface';
import { User } from '../user/user.model';
import Message from './message.model';
import { getReceiverSocketId, io } from '../../../utils/socket';
const sendMessageIntoDB = async (payload: TMessages) => {
  const { text, senderId, receiverId } = payload;
  // const senderId = req.user._id;

  // let imageUrl;
  // if (image) {
  //   // Upload base64 image to cloudinary
  //   const uploadResponse = await cloudinary.uploader.upload(image);
  //   imageUrl = uploadResponse.secure_url;
  // }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: '',
  });

  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  const messages = await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  return messages;
};
const getMessageFromDB = async (payload: Partial<TMessages>) => {
  const { myId, userToChatId } = payload;
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
  sendMessageIntoDB,
  getMessageFromDB,
  getUsersForSidebar,
};
