import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import config from '../app/config';
import { pool } from './pg';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [config?.front_end_base_url as string],
  },
});

const userSocketMap: any = {};
export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

export async function emitGroupEvent(groupId: number, event: string, payload: any) {
  const result = await pool.query(
    `SELECT user_id FROM group_members WHERE group_id = $1`,
    [groupId],
  );
  for (const member of result.rows) {
    const socketId = getReceiverSocketId(String(member.user_id));
    if (socketId) io.to(socketId).emit(event, payload);
  }
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) userSocketMap[userId] = socket.id;

  socket.on('typing', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { sender_id: userId });
    }
  });

  // ✅ Handle stop typing event
  socket.on('stopTyping', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStopTyping', { sender_id: userId });
    }
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
    const senderSocketId = getReceiverSocketId(String(updated.sender_id));
    const event = {
      messageId,
      seen_at: updated.seen_at,
    };
    if (senderSocketId) io.to(senderSocketId).emit('messageSeenUpdate', event);
    socket.emit('messageSeenUpdate', event);
  });
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
