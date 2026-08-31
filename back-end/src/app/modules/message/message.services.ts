import { TMessages } from './message.interface';
import { emitGroupEvent, getReceiverSocketId, io } from '../../../utils/socket';
import { pool } from '../../../utils/pg';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { FriendshipStatus } from '../../../constant';
import transporter from '../../../utils/nodemailer';
import config from '../../config';
import { uploadBufferToCloudinary } from '../../../utils/fileUploder';

const parseUserId = (value: unknown): number | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getDisappearingExpiry = (setting: string | null | undefined): Date | null => {
  const normalized = String(setting || 'off').toLowerCase();
  const now = Date.now();
  switch (normalized) {
    case '24h':
      return new Date(now + 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now + 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now + 30 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
};

const getUserDisappearingSetting = async (userId: number) => {
  const { rows } = await pool.query(
    `SELECT COALESCE(disappearing_messages, 'off') AS disappearing_messages FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );
  return rows[0]?.disappearing_messages || 'off';
};

const MESSAGE_NOT_EXPIRED = '(expires_at IS NULL OR expires_at > NOW())';

const parseReactions = (value: unknown): Array<{ id: string; userId: string; emoji: string }> => {
  if (!value) return [];
  let raw = value;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw.map((reaction: any) => ({
    id: String(reaction.id || `${reaction.userId || reaction.user_id}-${reaction.emoji}`),
    userId: String(reaction.userId || reaction.user_id),
    emoji: reaction.emoji,
  }));
};

const normalizeMessageRow = (row: any) => {
  if (!row) return row;
  return {
    ...row,
    id: String(row.id),
    sender_id: String(row.sender_id),
    receiver_id: row.receiver_id,
    receiverId: row.receiver_id ? String(row.receiver_id) : undefined,
    group_id: row.group_id ? String(row.group_id) : undefined,
    reply_id: row.reply_id,
    replyId: row.reply_id ? String(row.reply_id) : undefined,
    is_deleted: row.is_deleted,
    isDeleted: Boolean(row.is_deleted),
    file_url: row.file_url,
    file: row.file_url,
    file_name: row.file_name,
    fileName: row.file_name,
    file_type: row.file_type,
    fileType: row.file_type,
    reactions: parseReactions(row.reactions),
  };
};

const normalizeMessageRows = (rows: any[]) => rows.map(normalizeMessageRow);

const emitDirectMessageEvent = (event: string, message: any, peerUserId?: number | string) => {
  const normalized = normalizeMessageRow(message);
  const receiverSocketId = getReceiverSocketId(String(peerUserId ?? message.receiver_id));
  const senderSocketId = getReceiverSocketId(String(message.sender_id));
  if (receiverSocketId) io.to(receiverSocketId).emit(event, normalized);
  if (senderSocketId && senderSocketId !== receiverSocketId) {
    io.to(senderSocketId).emit(event, normalized);
  }
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

const getGroup = async (groupIdOrPayload: number | any, userId?: number | any) => {
  const groupId = typeof groupIdOrPayload === 'object'
    ? parseUserId(groupIdOrPayload.groupId ?? groupIdOrPayload.group_id)
    : parseUserId(groupIdOrPayload);
  const currentUserId = parseUserId(userId?.id ?? userId ?? groupIdOrPayload.userId);
  if (!groupId || !currentUserId) throw new AppError(httpStatus.BAD_REQUEST, 'Group is required');
  await assertGroupMember(groupId, currentUserId);
  const { rows } = await pool.query(
    `SELECT g.*,
      COALESCE(json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'img', u.img,
        'role', gm.role, 'joined_at', gm.joined_at) ORDER BY u.name)
        FILTER (WHERE u.id IS NOT NULL), '[]') AS members
     FROM chat_groups g
     LEFT JOIN group_members gm ON gm.group_id = g.id
     LEFT JOIN users u ON u.id = gm.user_id
     WHERE g.id = $1 GROUP BY g.id`,
    [groupId],
  );
  if (!rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  return rows[0];
};

const getGroupMembers = async (payload: any, currentUser?: any) => {
  const group = await getGroup(payload, currentUser);
  return group.members || [];
};

const assertGroupAdmin = async (groupId: number, userId: number) => {
  const { rows } = await pool.query(
    `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId],
  );
  if (!rows.length) throw new AppError(httpStatus.FORBIDDEN, 'You are not a member of this group');
  if (rows[0].role !== 'admin') throw new AppError(httpStatus.FORBIDDEN, 'Only group admins can manage the group');
};

const sendMessageIntoDB = async (payload: TMessages, currentUser?: any) => {
  const sender_id = parseUserId(currentUser?.id ?? payload.sender_id ?? payload.myId);
  const receiverId = parseUserId(payload.receiverId ?? payload.receiver_id);

  if (!sender_id || !receiverId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender and recipient are required');
  }

  await assertDirectChatAllowed(sender_id, receiverId);

  const disappearingSetting = await getUserDisappearingSetting(sender_id);
  const expiresAt = getDisappearingExpiry(disappearingSetting);
  const text = payload.text || '';
  const image = payload.image || '';
  const fileUrl = payload.file_url || payload.fileUrl || '';
  const fileName = payload.file_name || payload.fileName || '';
  const fileType = payload.file_type || payload.fileType || (fileUrl ? 'pdf' : null);
  const insertQuery = `
    INSERT INTO messages (sender_id, receiver_id, text, image, reply_id, expires_at, file_url, file_name, file_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const insertResult = await pool.query(insertQuery, [
    sender_id,
    receiverId,
    text,
    image,
    payload.replyId ? Number(payload.replyId) : null,
    expiresAt,
    fileUrl || null,
    fileName || null,
    fileType || null,
  ]);

  const newMessage = insertResult.rows[0];
  emitDirectMessageEvent('newMessage', newMessage, receiverId);

  const messagesQuery = `
    SELECT *
    FROM messages
    WHERE (
      (sender_id = $1 AND receiver_id = $2)
      OR
      (sender_id = $2 AND receiver_id = $1)
    )
    AND ${MESSAGE_NOT_EXPIRED}
    ORDER BY created_at ASC
  `;

  const messagesResult = await pool.query(messagesQuery, [sender_id, receiverId]);
  return normalizeMessageRows(messagesResult.rows);
};

const getMessageFromDB = async (payload: Partial<TMessages>, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.myId);
  const otherUserId = parseUserId(payload.userToChatId ?? payload.receiverId ?? payload.receiver_id);

  if (!currentUserId || !otherUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat participants are required');
  }

  await assertDirectChatAllowed(currentUserId, otherUserId);

  await pool.query(
    `
      UPDATE messages
      SET seen = true, seen_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE sender_id = $1 AND receiver_id = $2 AND seen = false
    `,
    [otherUserId, currentUserId],
  );

  await pool.query(
    `
      INSERT INTO conversation_preferences (user_id, peer_id, last_read_at, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, peer_id) WHERE peer_id IS NOT NULL
      DO UPDATE SET last_read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    `,
    [currentUserId, otherUserId],
  ).catch(async () => {
    await pool.query(
      `
        UPDATE conversation_preferences
        SET last_read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND peer_id = $2
      `,
      [currentUserId, otherUserId],
    );
  });

  const query = `
    SELECT *
    FROM messages
    WHERE ((sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1))
       AND ${MESSAGE_NOT_EXPIRED}
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query, [currentUserId, otherUserId]);
  return normalizeMessageRows(result.rows);
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
      COALESCE(cp.is_favourite, false) AS is_favourite,
      COALESCE(cp.is_archived, false) AS is_archived,
      COALESCE(cp.is_pinned, false) AS is_pinned,
      COALESCE(cp.is_muted, false) AS is_muted,
      (
        SELECT COUNT(*)::int
        FROM messages um
        WHERE um.sender_id = u.id
          AND um.receiver_id = $1
          AND um.seen = false
          AND (um.expires_at IS NULL OR um.expires_at > NOW())
      ) AS unread_count,
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
    LEFT JOIN conversation_preferences cp
      ON cp.user_id = $1 AND cp.peer_id = u.id
    LEFT JOIN LATERAL (
      SELECT *
      FROM messages m
      WHERE (
        (m.sender_id = $1 AND m.receiver_id = u.id)
        OR (m.sender_id = u.id AND m.receiver_id = $1)
      )
      AND (m.expires_at IS NULL OR m.expires_at > NOW())
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
    AND COALESCE(cp.is_archived, false) = false
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
    isFavourite: row.is_favourite,
    isArchived: row.is_archived,
    isPinned: row.is_pinned,
    isMuted: row.is_muted,
    unreadCount: row.unread_count || 0,
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

const addEmoji = async (payload: any, currentUser?: any) => {
  const messageId = parseUserId(payload.messageId);
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const emoji = payload.emoji;
  const receiverId = payload.receiverId;

  if (!messageId || !userId || !emoji) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message, user, and emoji are required');
  }

  const existing = await pool.query(`SELECT * FROM messages WHERE id = $1 LIMIT 1`, [messageId]);
  if (!existing.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }

  const reactions = parseReactions(existing.rows[0].reactions);
  const reactionEntry = {
    id: `${messageId}-${userId}`,
    userId: String(userId),
    emoji,
  };
  const existingIdx = reactions.findIndex((item) => item.userId === String(userId));
  if (existingIdx >= 0) {
    reactions[existingIdx] = reactionEntry;
  } else {
    reactions.push(reactionEntry);
  }

  const { rows } = await pool.query(
    `
      UPDATE messages
      SET reactions = $1::jsonb, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
    [JSON.stringify(reactions), messageId],
  );

  const updatedMessage = normalizeMessageRow(rows[0]);
  emitDirectMessageEvent('newEmoji', updatedMessage, receiverId ?? updatedMessage.receiver_id);
  return updatedMessage;
};

const removeEmoji = async (payload: any, currentUser?: any) => {
  const messageId = parseUserId(payload.messId ?? payload.messageId);
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const receiverId = payload.receiverId;

  if (!messageId || !userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message and user are required');
  }

  const existing = await pool.query(`SELECT * FROM messages WHERE id = $1 LIMIT 1`, [messageId]);
  if (!existing.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }

  const reactions = parseReactions(existing.rows[0].reactions).filter(
    (item) => item.userId !== String(userId),
  );

  const { rows } = await pool.query(
    `
      UPDATE messages
      SET reactions = $1::jsonb, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
    [JSON.stringify(reactions), messageId],
  );

  const updatedMessage = normalizeMessageRow(rows[0]);
  emitDirectMessageEvent('removeEmoji', updatedMessage, receiverId ?? updatedMessage.receiver_id);
  return updatedMessage;
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
  const updatedMessage = normalizeMessageRow(rows[0]);

  if (!updatedMessage) {
    return null;
  }

  emitDirectMessageEvent('editMessage', updatedMessage, receiverId ?? updatedMessage.receiver_id);
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
  const updatedMessage = normalizeMessageRow(rows[0]);

  if (!updatedMessage) {
    return null;
  }

  emitDirectMessageEvent('deletedMessage', updatedMessage, receiverId ?? updatedMessage.receiver_id);
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
    io.to(receiverSocketId).emit('newMessage', normalizeMessageRow(newMessage));
  }
  const senderSocketId = getReceiverSocketId(String(sender_id));
  if (senderSocketId) {
    io.to(senderSocketId).emit('newMessage', normalizeMessageRow(newMessage));
  }

  const fetchQuery = `
    SELECT * FROM messages
    WHERE ((sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1))
       AND ${MESSAGE_NOT_EXPIRED}
    ORDER BY created_at ASC;
  `;

  const { rows: messages } = await pool.query(fetchQuery, [sender_id, receiverId]);
  return normalizeMessageRows(messages);
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
      UPDATE messages
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
      WHERE sender_id = $1 AND receiver_id = $2
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

  const groupImg = payload.img || payload.avatar || payload.image || null;

  const { rows } = await pool.query(
    `
      INSERT INTO chat_groups (name, description, created_by, img)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [name, payload.description || '', currentUserId, groupImg],
  );

  const group = rows[0];

  await pool.query(
    `
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'admin')
    `,
    [group.id, currentUserId],
  );

  const emails = Array.isArray(payload.emails) ? payload.emails : [];
  const uniqueEmails = [...new Set(emails.map((email: unknown) => String(email).trim().toLowerCase()).filter(Boolean))];
  for (const email of uniqueEmails) {
    const user = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
    await pool.query(
      `INSERT INTO group_invitations (group_id, email, invited_by, user_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (group_id, email) DO UPDATE SET status = 'PENDING', user_id = EXCLUDED.user_id, created_at = CURRENT_TIMESTAMP`,
      [group.id, email, currentUserId, user.rows[0]?.id ?? null],
    );
    // The link deliberately opens the signed-in app. Acceptance is always checked
    // against the recipient's account, not an untrusted email-link token.
    try {
      await transporter.sendMail({
        to: [email as string],
        from: config.smtp?.user_name ? `"Chatty" <${config.smtp.user_name}>` : 'Chatty',
        subject: `Invitation to join ${group.name}`,
        text: `You have been invited to join ${group.name}. Sign in to Chatty to accept the invitation.`,
        html: `<p>You have been invited to join <strong>${group.name}</strong>.</p><p><a href="${config.front_end_base_url}/chat">Open Chatty and accept</a></p>`,
      });
    } catch (mailErr) {
      console.error("Failed to send group invitation email:", mailErr);
    }
  }

  // Also support initialMemberIds if passed directly
  const initialMemberIds = Array.isArray(payload.initialMemberIds) ? payload.initialMemberIds : [];
  for (const rawMemberId of initialMemberIds) {
    const memberId = parseUserId(rawMemberId);
    if (memberId && memberId !== currentUserId) {
      await pool.query(
        `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT (group_id, user_id) DO NOTHING`,
        [group.id, memberId],
      );
    }
  }

  const details = await getGroup(group.id, currentUserId);
  await emitGroupEvent(group.id, 'groupCreated', details);
  return details;
};

const listPendingGroupInvitations = async (currentUser?: any) => {
  const userId = parseUserId(currentUser?.id);
  const email = String(currentUser?.email || '').toLowerCase();
  if (!userId || !email) throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication is required');
  const { rows } = await pool.query(
    `SELECT gi.id, gi.group_id, gi.email, gi.created_at, g.name, g.description, g.img,
            inviter.name AS invited_by_name
     FROM group_invitations gi
     JOIN chat_groups g ON g.id = gi.group_id
     JOIN users inviter ON inviter.id = gi.invited_by
     WHERE gi.email = $1 AND gi.status = 'PENDING'
     ORDER BY gi.created_at DESC`, [email],
  );
  return rows;
};

const acceptGroupInvitation = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id);
  const invitationId = parseUserId(payload.invitationId ?? payload.id);
  const email = String(currentUser?.email || '').toLowerCase();
  if (!userId || !invitationId || !email) throw new AppError(httpStatus.BAD_REQUEST, 'Invitation is required');
  const invitation = await pool.query(
    `UPDATE group_invitations SET status = 'ACCEPTED', user_id = $1, accepted_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND email = $3 AND status = 'PENDING' RETURNING group_id`, [userId, invitationId, email],
  );
  if (!invitation.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Pending group invitation not found');
  const groupId = invitation.rows[0].group_id;
  await pool.query(
    `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT (group_id, user_id) DO NOTHING`,
    [groupId, userId],
  );
  const group = await getGroup(groupId, userId);
  await emitGroupEvent(groupId, 'groupMemberChanged', group);
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
            'img', u.img,
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

  await assertGroupAdmin(groupId, currentUserId);

  const existing = await pool.query(
    `SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2 LIMIT 1`,
    [groupId, memberId],
  );

  if (existing.rows.length) {
    return existing.rows[0];
  }

  await pool.query(`SELECT id FROM users WHERE id = $1`, [memberId]).then((result) => {
    if (!result.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  });

  const { rows } = await pool.query(
    `
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'member')
      RETURNING *
    `,
    [groupId, memberId],
  );

  const group = await getGroup(groupId, currentUserId);
  await emitGroupEvent(groupId, 'groupMemberChanged', group);
  return group;
};

const updateGroup = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  if (!userId || !groupId) throw new AppError(httpStatus.BAD_REQUEST, 'Group is required');
  await assertGroupAdmin(groupId, userId);
  const fields: string[] = [];
  const values: any[] = [];
  if (payload.name !== undefined) { fields.push(`name = $${values.length + 1}`); values.push(String(payload.name).trim()); }
  if (payload.description !== undefined) { fields.push(`description = $${values.length + 1}`); values.push(String(payload.description)); }
  if (payload.img !== undefined || payload.avatar !== undefined || payload.image !== undefined) {
    fields.push(`img = $${values.length + 1}`);
    values.push(payload.img ?? payload.avatar ?? payload.image ?? null);
  }
  if (!fields.length) throw new AppError(httpStatus.BAD_REQUEST, 'A group name, description, or image is required');
  values.push(groupId);
  const result = await pool.query(`UPDATE chat_groups SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING id`, values);
  if (!result.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
  const group = await getGroup(groupId, userId);
  await emitGroupEvent(groupId, 'groupUpdated', group);
  return group;
};

const removeGroupMember = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  const memberId = parseUserId(payload.memberId ?? payload.user_id ?? payload.userIdToRemove);
  if (!userId || !groupId || !memberId) throw new AppError(httpStatus.BAD_REQUEST, 'Group and member are required');
  await assertGroupAdmin(groupId, userId);
  const target = await pool.query(`SELECT role FROM group_members WHERE group_id=$1 AND user_id=$2`, [groupId, memberId]);
  if (!target.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Member not found');
  if (target.rows[0].role === 'admin') {
    const admins = await pool.query(`SELECT COUNT(*)::int AS count FROM group_members WHERE group_id=$1 AND role='admin'`, [groupId]);
    if (admins.rows[0].count <= 1) throw new AppError(httpStatus.BAD_REQUEST, 'The group must have at least one admin');
  }
  await pool.query(`DELETE FROM group_members WHERE group_id=$1 AND user_id=$2`, [groupId, memberId]);
  const group = await getGroup(groupId, userId);
  await emitGroupEvent(groupId, 'groupMemberChanged', group);
  return group;
};

const setGroupMemberRole = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  const memberId = parseUserId(payload.memberId ?? payload.member_id);
  const role = payload.role === 'admin' ? 'admin' : payload.role === 'member' ? 'member' : null;
  if (!userId || !groupId || !memberId || !role) throw new AppError(httpStatus.BAD_REQUEST, 'Group, member and valid role are required');
  await assertGroupAdmin(groupId, userId);
  if (role === 'member') {
    const admins = await pool.query(`SELECT COUNT(*)::int AS count FROM group_members WHERE group_id=$1 AND role='admin'`, [groupId]);
    if (admins.rows[0].count <= 1) throw new AppError(httpStatus.BAD_REQUEST, 'The group must have at least one admin');
  }
  const result = await pool.query(`UPDATE group_members SET role=$1 WHERE group_id=$2 AND user_id=$3 RETURNING *`, [role, groupId, memberId]);
  if (!result.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'Member not found');
  const group = await getGroup(groupId, userId);
  await emitGroupEvent(groupId, 'groupMemberChanged', group);
  return group;
};

const leaveGroup = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  if (!userId || !groupId) throw new AppError(httpStatus.BAD_REQUEST, 'Group is required');
  const membership = await pool.query(`SELECT role FROM group_members WHERE group_id=$1 AND user_id=$2`, [groupId, userId]);
  if (!membership.rows.length) throw new AppError(httpStatus.NOT_FOUND, 'You are not a member of this group');
  if (membership.rows[0].role === 'admin') {
    const admins = await pool.query(`SELECT user_id FROM group_members WHERE group_id=$1 AND role='admin' AND user_id<>$2 ORDER BY joined_at LIMIT 1`, [groupId, userId]);
    if (!admins.rows.length) {
      const replacement = await pool.query(`SELECT user_id FROM group_members WHERE group_id=$1 AND user_id<>$2 ORDER BY joined_at LIMIT 1`, [groupId, userId]);
      if (replacement.rows.length) await pool.query(`UPDATE group_members SET role='admin' WHERE group_id=$1 AND user_id=$2`, [groupId, replacement.rows[0].user_id]);
    }
  }
  await pool.query(`DELETE FROM group_members WHERE group_id=$1 AND user_id=$2`, [groupId, userId]);
  const remaining = await pool.query(`SELECT COUNT(*)::int AS count FROM group_members WHERE group_id=$1`, [groupId]);
  if (!remaining.rows[0].count) await pool.query(`DELETE FROM chat_groups WHERE id=$1`, [groupId]);
  else {
    const firstMember = await pool.query(
      `SELECT user_id FROM group_members WHERE group_id=$1 ORDER BY joined_at LIMIT 1`,
      [groupId],
    );
    if (firstMember.rows.length) {
      const group = await getGroup(groupId, firstMember.rows[0].user_id);
      await emitGroupEvent(groupId, 'groupMemberChanged', group);
    }
  }
  return { groupId, left: true };
};

const deleteGroup = async (payload: any, currentUser?: any) => {
  const userId = parseUserId(currentUser?.id ?? payload.userId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  if (!userId || !groupId) throw new AppError(httpStatus.BAD_REQUEST, 'Group is required');
  const group = await getGroup(groupId, userId);
  if (Number(group.created_by) !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Only the group creator can delete the group');
  const members = await pool.query(
    `SELECT user_id FROM group_members WHERE group_id = $1`,
    [groupId],
  );
  await pool.query(`DELETE FROM chat_groups WHERE id=$1`, [groupId]);
  for (const member of members.rows) {
    const socketId = getReceiverSocketId(String(member.user_id));
    if (socketId) io.to(socketId).emit('groupDeleted', { groupId });
  }
  return { groupId, deleted: true };
};

const sendGroupMessage = async (payload: any, currentUser?: any) => {
  const currentUserId = parseUserId(currentUser?.id ?? payload.userId ?? payload.sender_id ?? payload.myId);
  const groupId = parseUserId(payload.groupId ?? payload.group_id);
  const text = String(payload.text || '').trim();

  if (!currentUserId || !groupId || !text) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Group message text is required');
  }

  await assertGroupMember(groupId, currentUserId);

  const disappearingSetting = await getUserDisappearingSetting(currentUserId);
  const expiresAt = getDisappearingExpiry(disappearingSetting);
  const image = payload.image || '';
  const fileUrl = payload.file_url || payload.fileUrl || '';
  const fileName = payload.file_name || payload.fileName || '';
  const fileType = payload.file_type || payload.fileType || (fileUrl ? 'pdf' : null);

  const { rows } = await pool.query(
    `
      INSERT INTO messages (sender_id, group_id, text, receiver_id, image, expires_at, file_url, file_name, file_type)
      VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [currentUserId, groupId, text, image, expiresAt, fileUrl || null, fileName || null, fileType || null],
  );

  const message = normalizeMessageRow(rows[0]);
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
        AND ${MESSAGE_NOT_EXPIRED}
      ORDER BY m.created_at ASC
    `,
    [groupId],
  );

  return normalizeMessageRows(rows);
};

// ── Conversation statistics (shared media/files/links) ──
const getConversationStats = async (
  payload: {
    peerId?: string | number;
    groupId?: string | number;
    userId?: string | number;
    myId?: string | number;
  },
  currentUser?: any,
) => {
  const currentUserId = parseUserId(
    currentUser?.id ?? payload.userId ?? payload.myId,
  );
  const peerId = parseUserId(payload.peerId);
  const groupId = parseUserId(payload.groupId);

  if (!currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Current user is required');
  }

  // Messages belonging to a 1-on-1 conversation between currentUserId & peerId
  const oneToOneFilter = `
    ${peerId ? `(m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)` : 'FALSE'}
  `;

  // Messages belonging to a group conversation
  const groupFilter = groupId ? `m.group_id = $1` : 'FALSE';

  const { rows } = await pool.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE m.image IS NOT NULL AND m.image != '') AS media,
        COUNT(*) FILTER (WHERE m.file_url IS NOT NULL AND m.file_url != '') AS files,
        COUNT(*) FILTER (WHERE m.file_url IS NULL AND m.file_name IS NULL
          AND m.image IS NULL
          AND m.text ~* 'https?://[^\\s]+') AS links
      FROM messages m
      WHERE ${peerId ? oneToOneFilter : groupFilter}
        AND ${MESSAGE_NOT_EXPIRED}
    `,
    peerId ? [currentUserId, peerId] : [groupId],
  );

  const row = rows[0] || { media: 0, files: 0, links: 0 };
  return {
    media: parseInt(row.media, 10) || 0,
    files: parseInt(row.files, 10) || 0,
    links: parseInt(row.links, 10) || 0,
  };
};

const uploadAttachment = async (file: Express.Multer.File) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'File is required');
  }

  const result = await uploadBufferToCloudinary(file.buffer, file.mimetype);
  const isPdf = file.mimetype === 'application/pdf';

  return {
    url: result.secure_url,
    fileName: file.originalname,
    fileType: isPdf ? 'pdf' : 'image',
    resourceType: result.resource_type,
  };
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
  listPendingGroupInvitations,
  acceptGroupInvitation,
  listGroups,
  addGroupMember,
  getGroup,
  getGroupMembers,
  updateGroup,
  removeGroupMember,
  setGroupMemberRole,
  leaveGroup,
  deleteGroup,
  sendGroupMessage,
     getGroupMessages,
  getConversationStats,
  uploadAttachment,
};
