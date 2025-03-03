// src/components/Navigation.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => props.active 
    ? props.theme.primary || '#87CEEB' 
    : props.theme.text?.secondary || '#666666'};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  position: relative;
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 4px;
`;

const NavText = styled.span`
  font-size: 0.7rem;
  font-weight: ${props => props.active ? 500 : 400};
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'};
`;

const navItems = [
  { path: '/home', label: 'Home', icon: '✨' },
  { path: '/soul-map', label: 'Soul Map', icon: '🌙' },
  { path: '/virtual-altar', label: 'Altar', icon: '🕯️' },
  { path: '/journal', label: 'Journal', icon: '📔' },
  { path: '/skill-tree', label: 'Skills', icon: '🌳' },
  { path: '/community', label: 'Community', icon: '👥' }
];

const Navigation = () => {
  const location = useLocation();
  
  return (
    <NavContainer>
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        
        return (
          <NavItem 
            key={item.path} 
            to={item.path} 
            active={isActive ? 1 : 0}
          >
            <NavIcon>{item.icon}</NavIcon>
            <NavText active={isActive ? 1 : 0}>{item.label}</NavText>
            {isActive && (
              <ActiveIndicator 
                layoutId="activeTab"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
          </NavItem>
        );
      })}
    </NavContainer>
  );
};

export default Navigation;
