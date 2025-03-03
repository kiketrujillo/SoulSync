// src/components/MoonCircleSession.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Button from './Button';
import GlowingCard from './GlowingCard';

const SessionContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.gradient || 'linear-gradient(to bottom, #20B2AA, #FFFFFF)'};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const VideoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: 1fr;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

const ParticipantVideo = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &.host {
    grid-column: span 2;
    grid-row: span 2;
    border: 2px solid ${props => props.theme.primary || '#87CEEB'};
  }
  
  &.self {
    border: 2px solid #FF9999;
  }
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
`;

const ParticipantName = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 12px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.danger ? '#FF4D4D' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger ? '#FF6666' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  &.active {
    background: ${props => props.theme.primary || '#87CEEB'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatDrawer = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: white;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  
  .message-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
  
  .sender {
    font-weight: 500;
    font-size: 0.9rem;
    color: white;
  }
  
  .time {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .content {
    background: ${props => props.isOwn 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(255, 255, 255, 0.1)'};
    padding: 10px 12px;
    border-radius: 12px;
    border-top-right-radius: ${props => props.isOwn ? '4px' : '12px'};
    border-top-left-radius: ${props => !props.isOwn ? '4px' : '12px'};
    font-size: 0.9rem;
    color: white;
    max-width: 85%;
    align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  }
`;

const ChatInput = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 8px;
`;

const StyledInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 10px 16px;
  color: white;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary || '#87CEEB'};
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.primary || '#87CEEB'};
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RitualPanel = styled(motion.div)`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  z-index: 1;
  max-width: 80%;
  text-align: center;
`;

const RitualStep = styled.div`
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

// Mock data for participants
const mockParticipants = [
  { id: 'host', name: 'Luna', avatar: '🌕', isHost: true, isVideoOn: true, isMuted: false },
  { id: 'self', name: 'You', avatar: '🧘', isSelf: true, isVideoOn: false, isMuted: false },
  { id: 'user1', name: 'Stella', avatar: '⭐', isVideoOn: true, isMuted: true },
  { id: 'user2', name: 'Orion', avatar: '🔭', isVideoOn: true, isMuted: false },
  { id: 'user3', name: 'Nova', avatar: '💫', isVideoOn: false, isMuted: false },
  { id: 'user4', name: 'Celeste', avatar: '🌠', isVideoOn: true, isMuted: false },
];

// Mock chat messages
const mockMessages = [
  { id: 1, senderId: 'host', senderName: 'Luna', content: 'Welcome everyone to our Full Moon Ritual Circle! 🌕', timestamp: '19:01', avatar: '🌕' },
  { id: 2, senderId: 'user1', senderName: 'Stella', content: 'So excited to be here!', timestamp: '19:02', avatar: '⭐' },
  { id: 3, senderId: 'self', senderName: 'You', content: 'Thanks for hosting this, Luna. Looking forward to it.', timestamp: '19:02', avatar: '🧘' },
  { id: 4, senderId: 'host', senderName: 'Luna', content: 'We\'ll begin with a grounding meditation, followed by intention setting. Please have your candle ready.', timestamp: '19:03', avatar: '🌕' },
  { id: 5, senderId: 'user3', senderName: 'Nova', content: 'My internet connection is a bit unstable today, so I\'ll keep my video off, but I\'m here! 💫', timestamp: '19:03', avatar: '💫' },
];

// Mock ritual steps
const mockRitualSteps = [
  "Take three deep breaths to center yourself...",
  "Visualize roots extending from your feet into the earth...",
  "Feel the energy of the full moon above you...",
  "Light your candle and set your intention...",
];

const MoonCircleSession = ({ circleData, onClose }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [participants, setParticipants] = useState(mockParticipants);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [currentRitualStep, setCurrentRitualStep] = useState(0);
  const [showRitualPanel, setShowRitualPanel] = useState(true);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      senderId: 'self',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '🧘'
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate host response after a delay
    if (messages.length === 5) {
      setTimeout(() => {
        const hostResponse = {
          id: Date.now() + 1,
          senderId: 'host',
          senderName: 'Luna',
          content: 'Let\'s begin our ritual. I\'ll guide us through each step.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: '🌕'
        };
        setMessages(prev => [...prev, hostResponse]);
      }, 3000);
    }
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Update self in participants list
    setParticipants(prev => 
      prev.map(p => p.isSelf ? { ...p, isVideoOn: !isVideoOn } : p)
    );
  };
  
  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // Update self in participants list
    setParticipants(prev => 
      prev.map(p => p.isSelf ? { ...p, isMuted: isAudioOn } : p)
    );
  };
  
  // Progress ritual steps automatically
  useEffect(() => {
    if (currentRitualStep < mockRitualSteps.length) {
      const timer = setTimeout(() => {
        setCurrentRitualStep(prev => prev + 1);
      }, 20000); // 20 seconds per step
      
      return () => clearTimeout(timer);
    } else {
      // Hide ritual panel when all steps are complete
      setTimeout(() => {
        setShowRitualPanel(false);
      }, 5000);
    }
  }, [currentRitualStep]);
  
  return (
    <SessionContainer>
      <VideoGrid>
        {participants.map(participant => (
          <ParticipantVideo 
            key={participant.id} 
            className={`${participant.isHost ? 'host' : ''} ${participant.isSelf ? 'self' : ''}`}
          >
            {participant.isVideoOn ? (
              <img 
                src={`/assets/video-placeholders/${participant.id}.jpg`} 
                alt={participant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <VideoPlaceholder>
                <span style={{ fontSize: '3rem' }}>{participant.avatar}</span>
                <span>{participant.name}</span>
              </VideoPlaceholder>
            )}
            <ParticipantName>
              {participant.isMuted && <span>🔇</span>}
              {participant.isHost && <span>👑</span>}
              {participant.name}
            </ParticipantName>
          </ParticipantVideo>
        ))}
      </VideoGrid>
      
      <ControlsBar>
        <ControlButton
          onClick={toggleAudio}
          className={isAudioOn ? 'active' : ''}
          title={isAudioOn ? 'Mute' : 'Unmute'}
        >
          {isAudioOn ? '🔊' : '🔇'}
        </ControlButton>
        <ControlButton
          onClick={toggleVideo}
          className={isVideoOn ? 'active' : ''}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? '📹' : '🎦'}
        </ControlButton>
        <ControlButton
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={isChatOpen ? 'active' : ''}
          title="Chat"
        >
          💬
        </ControlButton>
        <ControlButton
          danger
          onClick={onClose}
          title="Leave circle"
        >
          📴
        </ControlButton>
      </ControlsBar>
      
      <AnimatePresence>
        {isChatOpen && (
          <ChatDrawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ChatHeader>
              <ChatTitle>Moon Circle Chat</ChatTitle>
              <CloseButton onClick={() => setIsChatOpen(false)}>×</CloseButton>
            </ChatHeader>
            <ChatMessages>
              {messages.map(message => (
                <ChatMessage 
                  key={message.id}
                  isOwn={message.senderId === 'self'}
                >
                  <div className="message-header">
                    <span>{message.avatar}</span>
                    <span className="sender">{message.senderName}</span>
                    <span className="time">{message.timestamp}</span>
                  </div>
                  <div className="content">
                    {message.content}
                  </div>
                </ChatMessage>
              ))}
            </ChatMessages>
            <ChatInput>
              <StyledInput
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                ➤
              </SendButton>
            </ChatInput>
          </ChatDrawer>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showRitualPanel && (
          <RitualPanel
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <h3>Full Moon Ritual</h3>
            <RitualStep>
              {currentRitualStep < mockRitualSteps.length
                ? mockRitualSteps[currentRitualStep]
                : "Now hold your intention in your heart as we sit in silence..."}
            </RitualStep>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginTop: '8px' }}>
              <motion.div
                style={{ 
                  height: '100%', 
                  background: 'white',
                  borderRadius: '2px',
                  transformOrigin: 'left'
                }}
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: currentRitualStep < mockRitualSteps.length 
                    ? 1 
                    : 0
                }}
                transition={{ duration: currentRitualStep < mockRitualSteps.length ? 20 : 0 }}
              />
            </div>
          </RitualPanel>
        )}
      </AnimatePresence>
    </SessionContainer>
  );
};

export default MoonCircleSession;