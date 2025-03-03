// src/server.ts
import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectMongo } from './db/mongoose';
import { logger, logAppEvent } from './utils/logger';

// Create HTTP server
const server = createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectMongo();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a moon circle
  socket.on('join-circle', (circleId: string) => {
    socket.join(circleId);
    io.to(circleId).emit('user-joined', { userId: socket.id, message: 'A new soul has joined the circle ✨' });
    console.log(`User ${socket.id} joined circle ${circleId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (message: { circleId: string; text: string }) => {
    io.to(message.circleId).emit('new-message', { userId: socket.id, text: message.text });
    console.log(`Message in circle ${message.circleId}: ${message.text}`);
  });

  // Handle ritual updates
  socket.on('ritual-update', (data: { circleId: string; action: string }) => {
    io.to(data.circleId).emit('ritual-update', { userId: socket.id, action: data.action });
    console.log(`Ritual update in circle ${data.circleId}: ${data.action}`);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✨ SoulSync server running on port ${PORT}`);
});
