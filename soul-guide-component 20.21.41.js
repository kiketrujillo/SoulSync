// src/components/SoulGuide.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Button from './Button';

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 360px;
  max-width: calc(100vw - 48px);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows?.strong || '0 10px 20px rgba(0, 0, 0, 0.2)'};
  max-height: 500px;
  display: flex;
  flex-direction: column;
  z-index: 900;
`;

const ChatHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.primary || '#87CEEB'};
  color: white;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const MessagesContainer = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  font-size: 0.9rem;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background: ${props.theme.primary || '#87CEEB'};
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background: rgba(0, 0, 0, 0.05);
    color: ${props.theme.text?.primary || '#333333'};
    border-bottom-left-radius: 4px;
  `}
`;

const InputContainer = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 8px;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  
  &:focus {
    border-color: ${props => props.theme.primary || '#87CEEB'};
  }
`;

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: ${props => props.theme.shadows?.medium || '0 6px 12px rgba(0, 0, 0, 0.15)'};
  cursor: pointer;
  z-index: 900;
  font-size: 24px;
`;

// Hardcoded initial message for demo purposes
const INITIAL_MESSAGES = [
  { id: 1, text: "Hello! I'm your Soul Guide. How are you feeling today?", isUser: false }
];

const SoulGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const mood = useSelector(state => state.user.mood);
  const zodiacSign = useSelector(state => state.user.zodiacSign);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // In a real app, we'd call the AI endpoint here
    // For now, simulate a response with a timeout
    setTimeout(() => {
      // This would be the AI response from backend
      const soulGuideResponse = {
        id: Date.now() + 1,
        text: getMockResponse(input, mood, zodiacSign),
        isUser: false
      };
      
      setMessages(prev => [...prev, soulGuideResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Mock responses for demo purposes
  const getMockResponse = (input, mood, zodiacSign) => {
    // In the real app, this would be replaced with actual API call to the AI Soul Guide
    
    if (input.toLowerCase().includes('tarot')) {
      return "A tarot reading would be perfect right now. I see you might benefit from drawing a card to gain some clarity. Would you like me to guide you through a simple single-card pull?";
    }
    
    if (input.toLowerCase().includes('ritual')) {
      return "Creating a personal ritual can help center your energy. Given your current mood, a grounding meditation with amethyst might be beneficial. Would you like me to suggest a simple ritual?";
    }
    
    if (mood === 'Anxious') {
      return `I sense your anxiety. With ${zodiacSign || 'your'} cosmic signature, deep breathing while visualizing ${getElementForZodiac(zodiacSign)} can help restore balance. Remember, this feeling is temporary and you have the inner wisdom to navigate it.`;
    }
    
    if (mood === 'Lost') {
      return `It's okay to feel lost sometimes. Your ${zodiacSign || 'cosmic'} path often involves periods of uncertainty before clarity emerges. Try journaling your thoughts tonight when the moon is most visible to you.`;
    }
    
    // Default response
    return "I'm here to guide you on your journey. Would you like to explore your current cosmic transits, try a tarot reading, or perhaps a soothing ritual aligned with today's energy?";
  };
  
  const getElementForZodiac = (sign) => {
    const fireElements = ["Aries", "Leo", "Sagittarius"];
    const earthElements = ["Taurus", "Virgo", "Capricorn"];
    const airElements = ["Gemini", "Libra", "Aquarius"];
    const waterElements = ["Cancer", "Scorpio", "Pisces"];
    
    if (fireElements.includes(sign)) return "flickering flame";
    if (earthElements.includes(sign)) return "nurturing earth";
    if (airElements.includes(sign)) return "flowing air";
    if (waterElements.includes(sign)) return "gentle waves";
    
    return "universal energy";
  };

  return (
    <>
      {!isOpen && (
        <FloatingButton
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Open Soul Guide chat"
        >
          ✨
        </FloatingButton>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <ChatHeader>
              <ChatTitle>✨ Soul Guide</ChatTitle>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Close chat">
                ×
              </CloseButton>
            </ChatHeader>
            
            <MessagesContainer>
              {messages.map(message => (
                <MessageBubble 
                  key={message.id} 
                  isUser={message.isUser}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.text}
                </MessageBubble>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <InputContainer>
              <StyledInput
                type="text"
                placeholder="Ask your Soul Guide..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleSend}
                variant="primary"
                size="small"
                aria-label="Send message"
              >
                Send
              </Button>
            </InputContainer>
          </ChatContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default SoulGuide;
