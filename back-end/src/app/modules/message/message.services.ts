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

  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);
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
const getUsersForSidebar = async (payload: any) => {
  const loggedInUserId = payload._id;
  const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
    '-password',
  );
  const usersWithLastMessage = await Promise.all(
    users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [{ receiverId: user._id }, { senderId: user._id }],
      })
        .sort({ createdAt: -1 })
        .select('senderId receiverId text createdAt')
        .lean();

      return {
        ...user.toObject(),
        lastMessage,
      };
    }),
  );

  return usersWithLastMessage;
};

const addEmoji = async (payload: any) => {
  const { messageId, userId, emoji, receiverId } = payload;
  await Message.findByIdAndUpdate(messageId, {
    $pull: { reactions: { userId } },
  });

  // 2. Add the new reaction
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { $push: { reactions: { userId, emoji } } },
    { new: true }, // return updated doc
  );
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newEmoji', updatedMessage);
  }
  return updatedMessage;
};
const removeEmoji = async (payload: any) => {
  const { receiverId, messId, emojiId } = payload;
  const updatedMessage = await Message.findByIdAndUpdate(
    { _id: messId },
    { $pull: { reactions: { _id: emojiId } } },
    { new: true }, // return updated document
  );
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('removeEmoji', updatedMessage);
  }
  return updatedMessage;
};
const editMessage = async (payload: any) => {
  const { _id, text, receiverId } = payload;
  const updatedMessage = await Message.findByIdAndUpdate(
    _id,
    { text: text },
    { new: true },
  );

  if (!updatedMessage) {
    return null;
  }
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('editMessage', updatedMessage);
  }
  return updatedMessage;
};
const deleteMessage = async (payload: any) => {
  const { _id, receiverId } = payload;
  console.log({ payload });
  const updatedMessage = await Message.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true },
  );

  if (!updatedMessage) {
    return null;
  }
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('deletedMessage', updatedMessage);
  }
  return updatedMessage;
};

const ForwardMessage = async (payload: any) => {
  const { text, receiverIds = [], senderId } = payload;
  const newMessages = receiverIds.map((receiverId: string) => {
    return {
      senderId,
      receiverId,
      text,
      image: '',
    };
  });

  const savedMessages = await Message.insertMany(newMessages);
  for (const msg of savedMessages) {
    const receiverSocketId = getReceiverSocketId(msg.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('forwardMessage', msg);
    }
  }

  return savedMessages;
};

const replyMessage = async (payload: TMessages) => {
  const { text, senderId, receiverId, replyId } = payload;
  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: '',
    replyId,
  });

  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);
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
export const MessageServices = {
  sendMessageIntoDB,
  getMessageFromDB,
  getUsersForSidebar,
  addEmoji,
  removeEmoji,
  editMessage,
  deleteMessage,
  ForwardMessage,
  replyMessage,
};
