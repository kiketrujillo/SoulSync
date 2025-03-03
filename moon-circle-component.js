// src/components/community/MoonCircle.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socketService from '../../services/socketService';

const MoonCircle = () => {
  const { circleId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect to socket and join circle when component mounts
  useEffect(() => {
    // Connect to socket if not already connected
    if (!socketService.connected) {
      socketService.connect();
    }

    // Join the circle
    socketService.joinCircle(circleId);
    setIsConnected(true);

    // Set up socket event listeners
    socketService.onUserJoined((userId) => {
      setParticipants(prev => [...prev, userId]);
      
      // Add system message about new user
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          type: 'system', 
          text: `${userId} has joined the circle`,
          timestamp: new Date()
        }
      ]);
    });

    socketService.onNewMessage((message) => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          type: 'user', 
          userId: message.userId, 
          text: message.text,
          timestamp: new Date()
        }
      ]);
    });

    // Clean up event listeners when component unmounts
    return () => {
      socketService.disconnect();
    };
  }, [circleId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && isConnected) {
      socketService.sendMessage(circleId, messageText);
      setMessageText('');
    }
  };

  return (
    <div className="moon-circle">
      <div className="circle-header">
        <h2>Moon Circle</h2>
        <div className="participants">
          {participants.length} {participants.length === 1 ? 'soul' : 'souls'} present
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type}`}
          >
            {message.type === 'user' && (
              <div className="message-user">{message.userId}</div>
            )}
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Share with the circle..."
          disabled={!isConnected}
        />
        <button 
          type="submit" 
          disabled={!isConnected || !messageText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MoonCircle;
