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
  backdrop-filter: blur(