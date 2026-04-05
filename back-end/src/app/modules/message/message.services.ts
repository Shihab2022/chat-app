import AppError from '../../error/appError';

import bcrypt from 'bcrypt';
import { TMessages } from './message.interface';
import { User } from '../user/user.model';
import Message from './message.model';
import { getReceiverSocketId, io } from '../../../utils/socket';
import { pool } from '../../../utils/pg';
const sendMessageIntoDB = async (payload: TMessages) => {
  const { text, senderId, receiverId } = payload;
  // const senderId = req.user._id;

  // let imageUrl;
  // if (image) {
  //   // Upload base64 image to cloudinary
  //   const uploadResponse = await cloudinary.uploader.upload(image);
  //   imageUrl = uploadResponse.secure_url;
  // }

  // 🔹 Insert message
  const insertQuery = `
    INSERT INTO messages (sender_id, receiver_id, text, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const insertResult = await pool.query(insertQuery, [
    senderId,
    receiverId,
    text,
    '', // image empty (same as your code)
  ]);

  const newMessage = insertResult.rows[0];

  // 🔹 Emit real-time message
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  // 🔹 Get full conversation
  const messagesQuery = `
    SELECT *
    FROM messages
    WHERE 
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;

  const messagesResult = await pool.query(messagesQuery, [
    senderId,
    receiverId,
  ]);

  return messagesResult.rows;
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

  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.img,
      u.bio,
      u.role,
      u.status,
      u.is_account_verified,
      u.is_google_login,
      u.created_at,
      u.updated_at,

      m.id AS message_id,
      m.sender_id,
      m.receiver_id,
      m.text,
      m.created_at AS message_created_at

    FROM users u

    LEFT JOIN LATERAL (
      SELECT *
      FROM messages m
      WHERE 
        (m.sender_id = u.id AND m.receiver_id = $1)
        OR
        (m.sender_id = $1 AND m.receiver_id = u.id)
      ORDER BY m.created_at DESC
      LIMIT 1
    ) m ON TRUE

    WHERE u.id != $1
    ORDER BY m.created_at DESC NULLS LAST
  `;

  const result = await pool.query(query, [loggedInUserId]);

  // 🔹 format like mongoose output
  const usersWithLastMessage = result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    img: row.img,
    bio: row.bio,
    role: row.role,
    status: row.status,
    isAccountVerified: row.is_account_verified,
    isGoogleLogin: row.is_google_login,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    lastMessage: row.message_id
      ? {
          id: row.message_id,
          senderId: row.sender_id,
          receiverId: row.receiver_id,
          text: row.text,
          createdAt: row.message_created_at,
        }
      : {},
  }));

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
