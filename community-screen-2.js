// src/screens/Community.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import SectionTitle from '../components/SectionTitle';
import GlowingCard from '../components/GlowingCard';
import Button from '../components/Button';
import MoonCircleSession from '../components/MoonCircleSession';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.gradient || 'linear-gradient(to bottom, #87CEEB, #FFFFFF)'};
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Description = styled.p`
  margin-bottom: 24px;
  line-height: 1.6;
`;

const CirclesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
`;

const CircleCard = styled(GlowingCard)`
  display: flex;
  flex-direction: column;
`;

const CircleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const CircleAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'}30;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const CircleInfo = styled.div`
  flex: 1;
`;

const CircleTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const CircleMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
`;

const Tag = styled.span`
  font-size: 0.7rem;
  padding: 4px 8px;
  background: ${props => props.theme.primary || '#87CEEB'}20;
  border-radius: 12px;
`;

const CircleDescription = styled.p`
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const MemberAvatars = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const MemberAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'}50;
  border: 2px solid white;
  margin-left: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  
  &:first-child {
    margin-left: 0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const TabButton = styled(Button)`
  flex-shrink: 0;
`;

const AddCircleButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 32px auto;
`;

// Mock data for Moon Circles
const mockCircles = [
  {
    id: 1,
    title: 'Full Moon Ritual Circle',
    hostName: 'Luna',
    hostAvatar: '🌕',
    description: 'Join us for a guided meditation and intention setting ritual during the full moon in Sagittarius. Bring a candle and something to write with!',
    date: '2023-06-22T20:00:00',
    duration: '45 minutes',
    tags: ['Ritual', 'Full Moon', 'Sagittarius'],
    participants: [
      { id: 1, name: 'Luna', avatar: '🌕' },
      { id: 2, name: 'Stella', avatar: '⭐' },
      { id: 3, name: 'Sky', avatar: '☁️' },
      { id: 4, name: 'Orion', avatar: '🔭' },
      { id: 5, name: 'Nova', avatar: '💫' }
    ],
    isLive: false
  },
  {
    id: 2,
    title: 'Mercury Retrograde Support Circle',
    hostName: 'Mercury',
    hostAvatar: '☿️',
    description: 'A safe space to share experiences and coping strategies during this challenging astrological period. Come connect with others navigating the same cosmic waters.',
    date: '2023-06-18T19:00:00',
    duration: '60 minutes',
    tags: ['Mercury Retrograde', 'Support', 'Discussion'],
    participants: [
      { id: 6, name: 'Mercury', avatar: '☿️' },
      { id: 7, name: 'Gemini', avatar: '♊' },
      { id: 8, name: 'Virgo', avatar: '♍' }
    ],
    isLive: true
  }
];

// Mock data for friends
const mockFriends = [
  { id: 1, name: 'Stella', avatar: '⭐', status: 'online', zodiac: 'Leo' },
  { id: 2, name: 'Luna', avatar: '🌕', status: 'online', zodiac: 'Cancer' },
  { id: 3, name: 'Orion', avatar: '🔭', status: 'offline', zodiac: 'Sagittarius' }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('circles'); // circles, friends, discover
  const [activeCircle, setActiveCircle] = useState(null);
  const [showSession, setShowSession] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const renderCircles = () => {
    return mockCircles.map(circle => (
      <CircleCard key={circle.id}>
        <CircleHeader>
          <CircleAvatar>{circle.hostAvatar}</CircleAvatar>
          <CircleInfo>
            <CircleTitle>{circle.title}</CircleTitle>
            <CircleMeta>
              <span>Hosted by {circle.hostName}</span>
              <span>•</span>
              <span>{formatDate(circle.date)}</span>
            </CircleMeta>
          </CircleInfo>
        </CircleHeader>
        
        <CircleDescription>{circle.description}</CircleDescription>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {circle.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
          {circle.isLive && (
            <Tag style={{ 
              background: '#FF4D4D20', 
              color: '#FF4D4D',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '8px', color: '#FF4D4D' }}>●</span> LIVE NOW
            </Tag>
          )}
        </div>
        
        <MemberAvatars>
          {circle.participants.slice(0, 5).map(participant => (
            <MemberAvatar key={participant.id}>{participant.avatar}</MemberAvatar>
          ))}
          {circle.participants.length > 5 && (
            <MemberAvatar>+{circle.participants.length - 5}</MemberAvatar>
          )}
        </MemberAvatars>
        
        <Button 
          variant={circle.isLive ? 'primary' : 'secondary'}
          onClick={() => circle.isLive ? handleJoinCircle(circle) : null}
        >
          {circle.isLive ? 'Join Now' : 'Remind Me'}
        </Button>
      </CircleCard>
    ));
  };
  
  const renderFriends = () => {
    return (
      <GlowingCard>
        <p>Your connections will appear here.</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '16px' }}>
          You can invite friends to join your spiritual journey or connect with like-minded souls.
        </p>
        <Button variant="primary" style={{ marginTop: '16px' }}>
          Find Friends
        </Button>
      </GlowingCard>
    );
  };
  
  const renderDiscover = () => {
    return (
      <GlowingCard>
        <p>Discover public Moon Circles and connect with the wider SoulSync community.</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '16px' }}>
          This feature is coming soon.
        </p>
      </GlowingCard>
    );
  };
  
  return (
    <Container>
      <AnimatePresence>
        {showSession && activeCircle && (
          <MoonCircleSession 
            circleData={activeCircle}
            onClose={handleLeaveSession}
          />
        )}
      </AnimatePresence>
      
      <Header>
        <SectionTitle>Moon Circles</SectionTitle>
        <Description>
          Connect with like-minded souls in virtual gatherings aligned with cosmic events.
          Join existing circles or create your own to share your spiritual journey.
        </Description>
      </Header>
      
      <TabsContainer>
        <TabButton 
          variant={activeTab === 'circles' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('circles')}
        >
          Moon Circles
        </TabButton>
        <TabButton 
          variant={activeTab === 'friends' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('friends')}
        >
          Soul Connections
        </TabButton>
        <TabButton 
          variant={activeTab === 'discover' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </TabButton>
      </TabsContainer>
      
      <CirclesContainer>
        {activeTab === 'circles' && renderCircles()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'discover' && renderDiscover()}
      </CirclesContainer>
      
      {activeTab === 'circles' && (
        <AddCircleButton variant="secondary">
          <span style={{ fontSize: '1.2rem' }}>+</span> Create Moon Circle
        </AddCircleButton>
      )}
    </Container>
  );
};

export default Community;
