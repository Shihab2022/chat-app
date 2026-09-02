import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import config from '../app/config';
import { pool } from './pg';
import {
  handleUserDisconnect,
  registerCallSocketHandlers,
} from '../app/modules/call/call.socket';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [config?.front_end_base_url as string],
  },
});

const userSocketMap: Record<string, Set<string>> = {};
export function getReceiverSocketId(userId: string) {
  return Array.from(userSocketMap[userId] || [])[0];
}

function getReceiverSocketIds(userId: string) {
  return Array.from(userSocketMap[userId] || []);
}

export const emitToUser = (targetUserId: string, event: string, payload: any) => {
  for (const socketId of getReceiverSocketIds(String(targetUserId))) {
    io.to(socketId).emit(event, payload);
  }
};

const isUserOnline = (userId: string) => Boolean(getReceiverSocketId(userId));

export async function emitGroupEvent(groupId: number, event: string, payload: any) {
  const result = await pool.query(
    `SELECT user_id FROM group_members WHERE group_id = $1`,
    [groupId],
  );
  for (const member of result.rows) {
    emitToUser(String(member.user_id), event, payload);
  }
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    let socketIds = userSocketMap[userId];
    if (!socketIds) {
      socketIds = new Set();
      userSocketMap[userId] = socketIds;
    }
    socketIds.add(socket.id);
  }

  // Live audio/video calling (WebRTC signaling + call-log tracking).
  registerCallSocketHandlers(socket, userId, { emitToUser, isUserOnline });

  socket.on('typing', ({ receiverId }) => {
    emitToUser(receiverId, 'userTyping', { sender_id: userId });
  });

  // ✅ Handle stop typing event
  socket.on('stopTyping', ({ receiverId }) => {
    emitToUser(receiverId, 'userStopTyping', { sender_id: userId });
  });
  socket.on('messageSeen', async ({ messageId }) => {
    // Only the actual recipient can mark a message as read. The socket user id
    // is authoritative; never trust a user id supplied by the browser.
    const query = `
UPDATE messages
SET 
    seen = true,
    seen_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE
    id = $1
    AND receiver_id = $2
    AND seen = false
    RETURNING id, sender_id, seen_at;
`;
    const result = await pool.query(query, [messageId, userId]);
    const updated = result.rows[0];
    if (!updated) return;
    const event = {
      messageId,
      seen_at: updated.seen_at,
    };
    emitToUser(String(updated.sender_id), 'messageSeenUpdate', event);
    socket.emit('messageSeenUpdate', event);
  });
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    const socketIds = userId ? userSocketMap[userId] : undefined;
    if (socketIds) {
      socketIds.delete(socket.id);
      if (socketIds.size === 0) delete userSocketMap[userId];
    }
    // Finalize any live call the user was part of & notify the peer.
    if (!isUserOnline(userId)) {
      void handleUserDisconnect(userId, { emitToUser, isUserOnline });
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
