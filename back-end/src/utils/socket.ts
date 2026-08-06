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
  socket.on('messageSeen', async ({ messageId, userId }) => {
    // Update the message in the database to mark it as seen
    const query = `
UPDATE messages
SET 
    seen = true,
    seen_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE 
    id = $1     
    AND seen = false
    RETURNING id, seen_at;
`;
    const result = await pool.query(query, [messageId]);
    io.emit('messageSeenUpdate', {
      messageId,
      seen_at: result.rows[0].seen_at,
    });
  });
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
