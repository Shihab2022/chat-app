import { TMessages } from './message.interface';
import { getReceiverSocketId, io } from '../../../utils/socket';
import { pool } from '../../../utils/pg';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { FriendshipStatus } from '../../../constant';

const parseUserId = (value: unknown): number | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getAcceptedFriendshipRows = async (userA: number, userB: number) => {
  const { rows } = await pool.query(
    `
      SELECT *
      FROM friendships
      WHERE (
        (
          sender_id = $1
          AND (
            receiver_id = $2
            OR receiver_email = (SELECT email FROM users WHERE id = $2)
          )
        )
        OR (
          sender_id = $2
          AND (
            receiver_id = $1
            OR receiver_email = (SELECT email FROM users WHERE id = $1)
          )
        )
      )
      AND invite_status = $3
      ORDER BY created_at DESC
    `,
    [userA, userB, FriendshipStatus.ACCEPTED],
  );

  return rows;
};

const assertDirectChatAllowed = async (
  currentUserId: number,
  targetUserId: number,
) => {
  if (!currentUserId || !targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat participants are required');
  }

  if (currentUserId === targetUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot message yourself directly',
    );
  }

  const friendshipRows = await getAcceptedFriendshipRows(currentUserId, targetUserId);

  if (!friendshipRows.length) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Direct chat is allowed only with accepted friends',
    );
  }

  const isBlocked = friendshipRows.some((row) => row.is_blocked === true);

  if (isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This user is blocked or has blocked you',
    );
  }
};

const assertGroupMember = async (groupId: number, userId: number) => {
  const { rows } = await pool.query(
    `
      SELECT id
      FROM group_members
      WHERE group_id = $1 AND user_id = $2
      LIMIT 1
    `,
    [groupId, userId],
  );

  if (!rows.length) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not a member of this group');
  }
};

const sendMessageIntoDB = async (payload: TMessages, currentUser?: any) => {
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const receiverId = parseUserId(payload.receiverId ?? payload.receiver_id);

  if (!sender_id || !receiverId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender and recipient are required');
  }

  await assertDirectChatAllowed(sender_id, receiverId);

  const text = payload.text || '';
  const insertQuery = `
    INSERT INTO messages (sender_id, receiver_id, text, image, reply_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const insertResult = await pool.query(insertQuery, [
    sender_id,
    receiverId,
    text,
    payload.image || '',
    payload.replyId ? Number(payload.replyId) : null,
  ]);

  const newMessage = insertResult.rows[0];
  const receiverSocketId = getReceiverSocketId(String(receiverId));

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  const messagesQuery = `
    SELECT *
    FROM messages
    WHERE 
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;

  const messagesResult = await pool.query(messagesQuery, [sender_id, receiverId]);
  return messagesResult.rows;
};

const getMessageFromDB = async (payload: Partial<TMessages>, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.myId);
  const otherUserId = parseUserId(payload.userToChatId ?? payload.receiverId ?? payload.receiver_id);

  if (!currentUserId || !otherUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat participants are required');
  }

  await assertDirectChatAllowed(currentUserId, otherUserId);

  const query = `
    SELECT *
    FROM messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query, [currentUserId, otherUserId]);
  return result.rows;
};

const getUsersForSidebar = async (payload: any, currentUser?: any) => {
  const loggedInUserId = parseUserId(currentUser?.id ?? payload?.id ?? payload?.myId);

  if (!loggedInUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current user is required');
  }

  const query = `
    SELECT DISTINCT
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
    FROM friendships f
    JOIN users u
      ON u.id = CASE
        WHEN f.sender_id = $1 THEN COALESCE(f.receiver_id, (SELECT id FROM users WHERE email = f.receiver_email LIMIT 1))
        ELSE f.sender_id
      END
    LEFT JOIN LATERAL (
      SELECT *
      FROM messages m
      WHERE (
        (m.sender_id = $1 AND m.receiver_id = u.id)
        OR (m.sender_id = u.id AND m.receiver_id = $1)
      )
      ORDER BY m.created_at DESC
      LIMIT 1
    ) m ON TRUE
    WHERE (
      f.sender_id = $1
      OR f.receiver_id = $1
      OR f.receiver_email = (SELECT email FROM users WHERE id = $1)
    )
    AND f.invite_status = $2
    AND COALESCE(f.is_blocked, false) = false
    AND u.id != $1
    ORDER BY m.created_at DESC NULLS LAST, u.name ASC
  `;

  const result = await pool.query(query, [loggedInUserId, FriendshipStatus.ACCEPTED]);

  return result.rows.map((row) => ({
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
  const receiverSocketId = getReceiverSocketId(String(receiverId));

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
  const receiverSocketId = getReceiverSocketId(String(receiverId));

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('removeEmoji', deletedReaction);
  }
  return deletedReaction;
};

const editMessage = async (payload: any, currentUser?: any) => {
  const { id, text, receiverId } = payload;
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const messageId = parseUserId(id);

  if (!messageId || !sender_id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is required');
  }

  const existingMessage = await pool.query(
    `SELECT sender_id, receiver_id FROM messages WHERE id = $1 LIMIT 1`,
    [messageId],
  );

  if (!existingMessage.rows[0]) {
    return null;
  }

  if (existingMessage.rows[0].sender_id !== sender_id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only edit your own messages');
  }

  const query = `
    UPDATE messages
    SET text = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [messageId, text]);
  const updatedMessage = rows[0];

  if (!updatedMessage) {
    return null;
  }

  const receiverSocketId = getReceiverSocketId(String(receiverId ?? updatedMessage.receiver_id));
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('editMessage', updatedMessage);
  }
  return updatedMessage;
};

const deleteMessage = async (payload: any, currentUser?: any) => {
  const { id, receiverId } = payload;
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const messageId = parseUserId(id);

  if (!messageId || !sender_id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is required');
  }

  const query = `
    UPDATE messages
    SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND sender_id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [messageId, sender_id]);
  const updatedMessage = rows[0];

  if (!updatedMessage) {
    return null;
  }

  const receiverSocketId = getReceiverSocketId(String(receiverId ?? updatedMessage.receiver_id));
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('deletedMessage', updatedMessage);
  }
  return updatedMessage;
};

const ForwardMessage = async (payload: any, currentUser?: any) => {
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const rawReceiverIds = Array.isArray(payload.receiverIds) ? payload.receiverIds : [payload.receiverId];
  const receiverIds = rawReceiverIds
    .map((item: unknown) => parseUserId(item))
    .filter((item: number | null): item is number => item !== null);

  if (!sender_id || !receiverIds.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'At least one recipient is required');
  }

  for (const receiverId of receiverIds) {
    await assertDirectChatAllowed(sender_id, receiverId);
  }

  const text = payload.text || '';
  const query = `
    INSERT INTO messages (sender_id, receiver_id, text, image)
    SELECT $1, unnest($2::int[]), $3, $4
    RETURNING *;
  `;

  const values = [sender_id, receiverIds, text, ''];
  const { rows: savedMessages } = await pool.query(query, values);

  for (const msg of savedMessages) {
    const receiverSocketId = getReceiverSocketId(String(msg.receiver_id));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('forwardMessage', msg);
    }
  }

  return savedMessages;
};

const replyMessage = async (payload: TMessages, currentUser?: any) => {
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const receiverId = parseUserId(payload.receiverId ?? payload.receiver_id);
  const replyId = parseUserId(payload.replyId);

  if (!sender_id || !receiverId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender and recipient are required');
  }

  await assertDirectChatAllowed(sender_id, receiverId);

  const insertQuery = `
    INSERT INTO messages (sender_id, receiver_id, text, image, reply_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const {
    rows: [newMessage],
  } = await pool.query(insertQuery, [sender_id, receiverId, payload.text || '', '', replyId]);

  const receiverSocketId = getReceiverSocketId(String(receiverId));
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  const fetchQuery = `
    SELECT * FROM messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC;
  `;

  const { rows: messages } = await pool.query(fetchQuery, [sender_id, receiverId]);
  return messages;
};

const clearMessage = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.myId ?? payload.userId ?? payload.sender_id);
  const otherUserId = parseUserId(payload.userToChatId ?? payload.receiverId ?? payload.friendId ?? payload.receiver_id);

  if (!currentUserId || !otherUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat participants are required');
  }

  await assertDirectChatAllowed(currentUserId, otherUserId);

  await pool.query(
    `
      DELETE FROM messages
      WHERE (
        (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
      )
    `,
    [currentUserId, otherUserId],
  );

  return { cleared: true, userId: otherUserId };
};

const deleteAllMessages = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId ?? payload.myId);

  if (!currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current user is required');
  }

  await pool.query(
    `DELETE FROM messages WHERE sender_id = $1 OR receiver_id = $1`,
    [currentUserId],
  );

  return { cleared: true, userId: currentUserId };
};

const createGroup = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId);
  const name = String(payload.name || '').trim();

  if (!currentUserId || !name) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group name is required');
  }

  const { rows } = await pool.query(
    `
      INSERT INTO chat_groups (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [name, payload.description || '', currentUserId],
  );

  const group = rows[0];

  await pool.query(
    `
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'admin')
    `,
    [group.id, currentUserId],
  );

  return group;
};

const listGroups = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload?.userId ?? payload?.myId);

  if (!currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current user is required');
  }

  const { rows } = await pool.query(
    `
      SELECT g.*,
        json_agg(
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'role', gm.role,
            'joined_at', gm.joined_at
          )
        ) AS members
      FROM chat_groups g
      INNER JOIN group_members gm ON gm.group_id = g.id
      INNER JOIN users u ON u.id = gm.user_id
      WHERE g.id IN (
        SELECT group_id FROM group_members WHERE user_id = $1
      )
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `,
    [currentUserId],
  );

  return rows;
};

const addGroupMember = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId ?? payload.currentUserId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  const memberId = parseUserId(payload.userIdToAdd ?? payload.memberId ?? payload.member_id ?? payload.user_id);

  if (!currentUserId || !groupId || !memberId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group and member are required');
  }

  await assertGroupMember(groupId, currentUserId);

  const existing = await pool.query(
    `SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`,
    [groupId, memberId],
  );

  if (existing.rows.length) {
    return existing.rows[0];
  }

  const friendCheck = await getAcceptedFriendshipRows(currentUserId, memberId);
  if (!friendCheck.length) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only accepted friends can be added to a group',
    );
  }

  const { rows } = await pool.query(
    `
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'member')
      RETURNING *
    `,
    [groupId, memberId],
  );

  return rows[0];
};

const sendGroupMessage = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId ?? payload.sender_id ?? payload.myId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  const text = String(payload.text || '').trim();

  if (!currentUserId || !groupId || !text) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group message text is required');
  }

  await assertGroupMember(groupId, currentUserId);

  const { rows } = await pool.query(
    `
      INSERT INTO messages (sender_id, group_id, text, receiver_id, image)
      VALUES ($1, $2, $3, NULL, $4)
      RETURNING *
    `,
    [currentUserId, groupId, text, payload.image || ''],
  );

  const message = rows[0];
  const members = await pool.query(
    `SELECT user_id FROM group_members WHERE group_id = $1`,
    [groupId],
  );

  for (const member of members.rows) {
    const socketId = getReceiverSocketId(String(member.user_id));
    if (socketId) {
      io.to(socketId).emit('newGroupMessage', message);
    }
  }

  return message;
};

const getGroupMessages = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId ?? payload.myId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);

  if (!currentUserId || !groupId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group is required');
  }

  await assertGroupMember(groupId, currentUserId);

  const { rows } = await pool.query(
    `
      SELECT m.*
      FROM messages m
      WHERE m.group_id = $1
      ORDER BY m.created_at ASC
    `,
    [groupId],
  );

  return rows;
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
  createGroup,
  listGroups,
  addGroupMember,
  sendGroupMessage,
  getGroupMessages,
};
