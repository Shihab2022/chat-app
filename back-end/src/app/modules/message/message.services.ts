import { TMessages } from './message.interface';
import { getReceiverSocketId, io } from '../../../utils/socket';
import { pool } from '../../../utils/pg';

const sendMessageIntoDB = async (payload: TMessages) => {
  const { text, sender_id, receiverId } = payload;
  // const sender_id = req.user.id;

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
    sender_id,
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
    sender_id,
    receiverId,
  ]);

  return messagesResult.rows;
};
const getMessageFromDB = async (payload: Partial<TMessages>) => {
  const { myId, userToChatId } = payload;
  const query = `
  SELECT * FROM messages 
  WHERE (sender_id = $1 AND receiver_id = $2) 
     OR (sender_id = $2 AND receiver_id = $1)
`;
  const values = [myId, userToChatId];
  const result = await pool.query(query, values);
  const messages = result.rows;
  return messages;
};
const getUsersForSidebar = async (payload: any) => {
  const loggedInUserId = payload.id;

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
      u.updated_at

    FROM users u
    ORDER BY u.created_at DESC NULLS LAST
  `;
  // const query = `
  //   SELECT
  //     u.id,
  //     u.name,
  //     u.email,
  //     u.img,
  //     u.bio,
  //     u.role,
  //     u.status,
  //     u.is_account_verified,
  //     u.is_google_login,
  //     u.created_at,
  //     u.updated_at,

  //     m.id AS message_id,
  //     m.sender_id,
  //     m.receiver_id,
  //     m.text,
  //     m.created_at AS message_created_at

  //   FROM users u

  //   LEFT JOIN LATERAL (
  //     SELECT *
  //     FROM messages m
  //     WHERE
  //       (m.sender_id = u.id AND m.receiver_id = $1)
  //       OR
  //       (m.sender_id = $1 AND m.receiver_id = u.id)
  //     ORDER BY m.created_at DESC
  //     LIMIT 1
  //   ) m ON TRUE

  //   WHERE u.id != $1
  //   ORDER BY m.created_at DESC NULLS LAST
  // `;

  const result = await pool.query(query);
  // const result = await pool.query(query, [loggedInUserId]);

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
    created_at: row.created_at,
    updatedAt: row.updated_at,

    lastMessage: row.message_id
      ? {
          id: row.message_id,
          sender_id: row.sender_id,
          receiverId: row.receiver_id,
          text: row.text,
          created_at: row.message_created_at,
        }
      : {},
  }));

  return usersWithLastMessage;
};

const addEmoji = async (payload: any) => {
  const { messageId, userId, emoji, receiverId } = payload;
  const query = `
  INSERT INTO message_reactions (message_id, user_id, emoji)
  VALUES ($1, $2, $3)
  ON CONFLICT (message_id, user_id) 
  DO UPDATE SET emoji = EXCLUDED.emoji
  RETURNING *;
`;

  const { rows } = await pool.query(query, [messageId, userId, emoji]);
  const updatedReaction = rows[0];
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newEmoji', updatedReaction);
  }
  return updatedReaction;
};
const removeEmoji = async (payload: any) => {
  const { receiverId, messId, emojiId } = payload;
  const deleteQuery = `
  DELETE FROM message_reactions 
  WHERE id = $1 AND message_id = $2
  RETURNING *;
`;

  const { rows } = await pool.query(deleteQuery, [emojiId, messId]);
  const deletedReaction = rows[0];
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('removeEmoji', deletedReaction);
  }
  return deletedReaction;
};
const editMessage = async (payload: any) => {
  const { id, text, receiverId } = payload;
  const query = `
  UPDATE messages 
  SET text = $2 
  WHERE id = $1 
  RETURNING *;
`;

  const { rows } = await pool.query(query, [id, text]);
  const updatedMessage = rows[0];

  // 2. Handle the null check
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
  const { id, receiverId } = payload;
  const query = `
  UPDATE messages 
  SET is_deleted = true 
  WHERE id = $1 
  RETURNING *;
`;

  const { rows } = await pool.query(query, [id]);
  const updatedMessage = rows[0];

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
  const { text, receiverIds = [], sender_id } = payload;
  const query = `
  INSERT INTO messages (sender_id, receiver_id, text, image)
  SELECT $1, unnest($2::text[]), $3, $4
  RETURNING *;
`;

  const values = [sender_id, receiverIds, text, ''];
  const { rows: savedMessages } = await pool.query(query, values);
  for (const msg of savedMessages) {
    const receiverSocketId = getReceiverSocketId(msg.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('forwardMessage', msg);
    }
  }

  return savedMessages;
};

const replyMessage = async (payload: TMessages) => {
  const { sender_id, receiverId, text, replyId } = payload;

  // 1. Insert the new message
  const insertQuery = `
  INSERT INTO messages (sender_id, receiver_id, text, image, reply_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

  const insertValues = [sender_id, receiverId, text, '', replyId];
  const {
    rows: [newMessage],
  } = await pool.query(insertQuery, insertValues);

  // 2. Socket logic
  const receiverSocketId = getReceiverSocketId(receiverId as unknown as string);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  // 3. Fetch the updated conversation history
  const fetchQuery = `
  SELECT * FROM messages 
  WHERE (sender_id = $1 AND receiver_id = $2)
     OR (sender_id = $2 AND receiver_id = $1)
  ORDER BY created_at ASC;
`;

  const { rows: messages } = await pool.query(fetchQuery, [
    sender_id,
    receiverId,
  ]);

  return messages;
};

const clearMessage = async (payload: TMessages) => {
  const { sender_id, receiverId, text, replyId } = payload;

  return 'messages';
};
const deleteAllMessages = async (payload: TMessages) => {
  const { sender_id, receiverId, text, replyId } = payload;

  return 'messages';
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
  clearMessage,
  deleteAllMessages,
};
