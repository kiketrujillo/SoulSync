// src/components/MoodPicker.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setMood } from '../store/userSlice';

const MoodPickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${props => props.theme.spacing?.md || '16px'};
  margin: ${props => props.theme.spacing?.lg || '24px'} 0;
`;

const MoodButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing?.md || '16px'};
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius?.circle || '50%'};
  width: 80px;
  height: 80px;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows?.soft || '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows?.glow || '0 0 15px rgba(255, 255, 255, 0.7)'};
  }
`;

const MoodEmoji = styled.span`
  font-size: 1.8rem;
  margin-bottom: ${props => props.theme.spacing?.xs || '4px'};
`;

const MoodText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
`;

const moods = [
  { name: 'Calm', emoji: '😌' },
  { name: 'Happy', emoji: '😊' },
  { name: 'Inspired', emoji: '✨' },
  { name: 'Reflective', emoji: '🤔' },
  { name: 'Lost', emoji: '😕' },
  { name: 'Anxious', emoji: '😰' },
  { name: 'Curious', emoji: '🧐' },
  { name: 'Grateful', emoji: '🙏' },
];

const MoodPicker = ({ onSelect }) => {
  const dispatch = useDispatch();
  
  const handleMoodSelect = (mood) => {
    dispatch(setMood(mood));
    if (onSelect) onSelect(mood);
  };

  return (
    <MoodPickerContainer>
      {moods.map((mood) => (
        <MoodButton
          key={mood.name}
          onClick={() => handleMoodSelect(mood.name)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Select mood: ${mood.name}`}
        >
          <MoodEmoji>{mood.emoji}</MoodEmoji>
          <MoodText>{mood.name}</MoodText>
        </MoodButton>
      ))}
    </MoodPickerContainer>
  );
};

export default MoodPicker;

// src/components/TarotCard.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  position: relative;
  width: 220px;
  height: 380px;
  margin: ${props => props.theme.spacing?.md || '16px'};
  perspective: 1000px;
  cursor: pointer;
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  box-shadow: ${props => props.theme.shadows?.medium || '0 6px 12px rgba(0, 0, 0, 0.15)'};
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  overflow: hidden;
`;

const CardFront = styled(CardFace)`
  background-image: url(${props => props.image || '/assets/tarot-back.jpg'});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: ${props => props.theme.spacing?.md || '16px'};
`;

const CardBack = styled(CardFace)`
  background: rgba(255, 255, 255, 0.9);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing?.md || '16px'};
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  margin-top: ${props => props.theme.spacing?.md || '16px'};
  color: ${props => props.theme.text?.primary || '#333333'};
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.text?.secondary || '#666666'};
  font-size: 0.9rem;
  line-height: 1.4;
  flex-grow: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing?.sm || '8px'} 0;
`;

const CardKeywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing?.xs || '4px'};
  justify-content: center;
  margin-top: ${props => props.theme.spacing?.sm || '8px'};
`;

const Keyword = styled.span`
  font-size: 0.7rem;
  padding: 4px 8px;
  background: ${props => props.theme.primary || '#87CEEB'}20;
  border-radius: 12px;
  color: ${props => props.theme.text?.primary || '#333333'};
`;

const TarotCard = ({ card, isReversed = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  if (!card) return null;
  
  const { name, image, description, keywords } = card;
  
  return (
    <CardContainer
      onClick={() => setIsFlipped(!isFlipped)}
      aria-label={`Tarot card: ${name}`}
    >
      <CardInner
        animate={{ rotateY: isFlipped ? 180 : 0, rotateZ: isReversed ? 180 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <CardFront image={image}>
          {!isFlipped && <CardTitle>{name}</CardTitle>}
        </CardFront>
        <CardBack>
          <CardTitle>{name} {isReversed ? '(Reversed)' : ''}</CardTitle>
          <CardDescription>
            {isReversed && card.reversedDescription 
              ? card.reversedDescription 
              : description}
          </CardDescription>
          <CardKeywords>
            {keywords.map((keyword, index) => (
              <Keyword key={index}>{keyword}</Keyword>
            ))}
          </CardKeywords>
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default TarotCard;

// src/components/Button.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  padding: ${props => props.size === 'large' ? '16px 32px' : props.size === 'small' ? '8px 16px' : '12px 24px'};
  background: ${props => props.variant === 'primary' 
    ? props.theme.primary || '#87CEEB' 
    : props.variant === 'secondary' 
      ? 'transparent' 
      : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.variant === 'primary' 
    ? props.theme.text?.light || '#FFFFFF' 
    : props.theme.text?.primary || '#333333'};
  border: ${props => props.variant === 'secondary' 
    ? `1px solid ${props.theme.primary || '#87CEEB'}` 
    : 'none'};
  border-radius: 24px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: ${props => props.size === 'large' ? '1.1rem' : props.size === 'small' ? '0.8rem' : '1rem'};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows?.soft || '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  onClick, 
  disabled = false,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

export default Button;
