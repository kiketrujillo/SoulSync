// src/components/FloatingActionButton.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: ${props => props.bottom || '24px'};
  right: ${props => props.right || '24px'};
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'};
  color: ${props => props.theme.text?.light || '#FFFFFF'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: ${props => props.theme.shadows?.medium || '0 6px 12px rgba(0, 0, 0, 0.15)'};
  cursor: pointer;
  z-index: 100;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows?.glow || '0 0 15px rgba(255, 255, 255, 0.7)'};
  }
`;

const IconWrapper = styled.div`
  font-size: ${props => props.iconSize || '24px'};
`;

const FloatingActionButton = ({ 
  icon, 
  onClick, 
  bottom, 
  right, 
  size, 
  iconSize,
  ariaLabel,
  ...props 
}) => {
  return (
    <FloatingButton
      onClick={onClick}
      bottom={bottom}
      right={right}
      size={size}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={ariaLabel}
      {...props}
    >
      <IconWrapper iconSize={iconSize}>
        {icon}
      </IconWrapper>
    </FloatingButton>
  );
};

export default FloatingActionButton;

// src/components/BottomDrawer.js
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const DrawerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const DrawerContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  width: 100%;
  max-width: 600px;
  min-height: ${props => props.height || '50vh'};
  max-height: 90vh;
  overflow-y: auto;
  padding: ${props => props.theme.spacing?.lg || '24px'};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  
  /* Add subtle scroll indicator */
  &:after {
    content: '';
    position: sticky;
    bottom: 0;
    display: block;
    height: 30px;
    width: 100%;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
    pointer-events: none;
  }
`;

const DrawerHandle = styled.div`
  width: 40px;
  height: 5px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  margin: 0 auto 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.text?.secondary || '#666666'};
`;

const BottomDrawer = ({ 
  isOpen, 
  onClose, 
  height, 
  children 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <DrawerOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose()}
        >
          <DrawerContent
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            height={height}
          >
            <DrawerHandle />
            <CloseButton onClick={onClose} aria-label="Close drawer">×</CloseButton>
            {children}
          </DrawerContent>
        </DrawerOverlay>
      )}
    </AnimatePresence>
  );
};

export default BottomDrawer;

// src/components/GlowingCard.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: ${props => props.theme.borderRadius?.lg || '16px'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: ${props => props.theme.spacing?.lg || '24px'};
  box-shadow: ${props => props.theme.shadows?.soft || '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      ${props => props.glowColor || props.theme.primary || '#87CEEB'}20 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: -1;
  }
  
  &:hover:before {
    opacity: 1;
  }
`;

const GlowingCard = ({ 
  children, 
  glowColor, 
  onClick, 
  className,
  ...props 
}) => {
  return (
    <CardContainer
      glowColor={glowColor}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </CardContainer>
  );
};

export default GlowingCard;

// src/components/SectionTitle.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.md || '16px'};
  position: relative;
`;

const Line = styled(motion.div)`
  height: 1px;
  background: ${props => `linear-gradient(to right, ${props.theme.primary || '#87CEEB'}70, transparent)`};
  flex-grow: 1;
  margin-left: ${props => props.theme.spacing?.md || '16px'};
`;

const Title = styled(motion.h2)`
  font-family: 'Lora', serif;
  font-weight: 500;
  font-size: 1.5rem;
  color: ${props => props.theme.text?.primary || '#333333'};
  margin: 0;
`;

const SectionTitle = ({ children }) => {
  return (
    <TitleContainer>
      <Title
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </Title>
      <Line 
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </TitleContainer>
  );
};

export default SectionTitle;

// src/components/RitualCard.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './Button';

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: ${props => props.theme.borderRadius?.md || '8px'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  margin: ${props => props.theme.spacing?.md || '16px'} 0;
`;

const RitualImage = styled.div`
  height: 160px;
  background-image: url(${props => props.image || '/assets/ritual-default.jpg'});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  }
`;

const RitualInfo = styled.div`
  padding: ${props => props.theme.spacing?.md || '16px'};
`;

const RitualTitle = styled.h3`
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing?.xs || '4px'};
  font-size: 1.2rem;
`;

const RitualDuration = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
  display: block;
  margin-bottom: ${props => props.theme.spacing?.sm || '8px'};
`;

const RitualDescription = styled.p`
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing?.md || '16px'};
`;

const MoonPhaseIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing?.sm || '8px'};
  right: ${props => props.theme.spacing?.sm || '8px'};
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RitualCard = ({ ritual, onStart }) => {
  if (!ritual) return null;
  
  const { title, description, duration, image, moonPhase } = ritual;
  
  return (
    <CardContainer
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <RitualImage image={image}>
        {moonPhase && (
          <MoonPhaseIndicator>
            {moonPhase === 'New Moon' ? '🌑' : 
             moonPhase === 'Full Moon' ? '🌕' : 
             moonPhase === 'Waxing Moon' ? '🌓' : 
             moonPhase === 'Waning Moon' ? '🌗' : '🌙'} 
            {moonPhase}
          </MoonPhaseIndicator>
        )}
      </RitualImage>
      <RitualInfo>
        <RitualTitle>{title}</RitualTitle>
        <RitualDuration>Duration: {duration}</RitualDuration>
        <RitualDescription>{description}</RitualDescription>
        <Button 
          onClick={() => onStart(ritual)} 
          variant="primary" 
          size="small"
        >
          Begin Ritual
        </Button>
      </RitualInfo>
    </CardContainer>
  );
};

export default RitualCard;

