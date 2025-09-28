import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import config from '../app/config';
import Message from '../app/modules/message/message.model';

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
      io.to(receiverSocketId).emit('userTyping', { senderId: userId });
    }
  });

  // ✅ Handle stop typing event
  socket.on('stopTyping', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userStopTyping', { senderId: userId });
    }
  });
  socket.on('message:seen', async ({ messageId, userId }) => {
    // Update the message in the database to mark it as seen
    await Message.findByIdAndUpdate(
      messageId,
      { seen: true, seenAt: new Date() },
      { new: true },
    );
    // broadcast update
    io.emit('message:seen:update', { messageId, userId });
  });
  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
