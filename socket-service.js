// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join a Moon Circle
  joinCircle(circleId) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('join-circle', circleId);
  }

  // Send a message in a Moon Circle
  sendMessage(circleId, text) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('chat-message', { circleId, text });
  }

  // Listen for a new user joining the circle
  onUserJoined(callback) {
    if (!this.socket || !this.connected) return;
    this.socket.on('user-joined', callback);
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (!this.socket || !this.connected) return;
    this.socket.on('new-message', callback);
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
