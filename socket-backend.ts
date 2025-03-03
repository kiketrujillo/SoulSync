// backend/src/server.ts (Updated)
import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectMongo } from './db/mongoose';
import jwt from 'jsonwebtoken';

// Create HTTP server
const server = createServer(app);

// CORS configuration for Socket.IO
const allowedOrigins = [
  'http://localhost:3000',
  'https://soulsync.app',
  'https://dev.soulsync.app',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

// Initialize Socket.IO with CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
connectMongo();

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    
    // Add user data to socket
    socket.data.user = decoded;
    next();
  });
});

// Socket.IO connection handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Store user ID for user identification in messages
  const userId = socket.data.user.id;
  
  // Join a Moon Circle
  socket.on('join-circle', (circleId) => {
    socket.join(circleId);
    io.to(circleId).emit('user-joined', userId);
    console.log(`User ${userId} joined circle ${circleId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (message) => {
    io.to(message.circleId).emit('new-message', { 
      userId: userId,
      text: message.text 
    });
  });
  
  // Handle ritual updates
  socket.on('ritual-update', (update) => {
    io.to(update.circleId).emit('ritual-updated', {
      userId: userId,
      action: update.action,
      element: update.element
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
