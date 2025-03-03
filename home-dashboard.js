// src/screens/Home.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentCard } from '../store/tarotSlice';

// Components
import MoodPicker from '../components/MoodPicker';
import SectionTitle from '../components/SectionTitle';
import GlowingCard from '../components/GlowingCard';
import Button from '../components/Button';
import RitualCard from '../components/RitualCard';
import SoulGuide from '../components/SoulGuide';
import BottomDrawer from '../components/BottomDrawer';
import TarotCard from '../components/TarotCard';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.theme.gradient || 'linear-gradient(to bottom, #87CEEB, #FFFFFF)'};
  padding-bottom: 120px; // Space for floating action button
`;

const Header = styled.header`
  padding: 24px;
  text-align: center;
`;

const WelcomeMessage = styled.h1`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const DateDisplay = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
  margin-bottom: 24px;
`;

const Section = styled.section`
  padding: 16px 24px;
  margin-bottom: 24px;
`;

const CosmicSnapshotCard = styled(GlowingCard)`
  margin-bottom: 24px;
`;

const PlanetInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PlanetIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.primary || '#87CEEB'}30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
`;

const PlanetText = styled.div`
  flex: 1;
`;

const PlanetName = styled.p`
  font-weight: 500;
  margin-bottom: 4px;
`;

const PlanetDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
`;

const RitualGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const NoContentMessage = styled.p`
  text-align: center;
  margin: 32px 0;
  color: ${props => props.theme.text?.secondary || '#666666'};
  font-style: italic;
`;

// Mock data for demonstration
const mockDailyTransits = [
  { 
    planet: 'Sun', 
    sign: 'Aries', 
    house: 10, 
    description: 'A day for career growth and public recognition.',
    emoji: '☀️'
  },
  { 
    planet: 'Moon', 
    sign: 'Cancer', 
    house: 2, 
    description: 'Your emotions are tied to security and resources today.',
    emoji: '🌙'
  },
  { 
    planet: 'Mercury', 
    sign: 'Pisces', 
    house: 9, 
    description: 'Communication flows intuitively with philosophical depth.',
    emoji: '☿'
  }
];

const mockRituals = [
  {
    id: 1,
    title: 'Morning Grounding Meditation',
    description: 'Start your day with a 5-minute meditation to connect with the earth element and set peaceful intentions.',
    duration: '5 min',
    image: '/assets/ritual-grounding.jpg',
    moonPhase: 'Waxing Moon'
  },
  {
    id: 2,
    title: 'Crystal Charging Ritual',
    description: 'Cleanse and energize your crystals under today\'s potent Aries sun to amplify clarity and purpose.',
    duration: '10 min',
    image: '/assets/ritual-crystal.jpg',
    moonPhase: 'Full Moon'
  }
];

const mockTarotCard = {
  name: 'The Star',
  image: '/assets/tarot/star.jpg',
  description: 'A symbol of hope, renewal, and inspiration. The Star indicates a period of spiritual joy and renewal after difficulty. It encourages you to trust your inner light and have faith in your path.',
  keywords: ['Hope', 'Renewal', 'Inspiration', 'Faith'],
  reversedDescription: 'When reversed, The Star suggests feelings of despair, disconnection, or lack of faith. You may need to reconnect with your inner light and rediscover what inspires you.'
};

const Home = () => {
  const [isTarotDrawerOpen, setIsTarotDrawerOpen] = useState(false);
  const [isRitualDrawerOpen, setIsRitualDrawerOpen] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState(null);
  
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { currentCard } = useSelector(state => state.tarot);
  
  // In a real app, we'd fetch daily transits, recommended rituals, etc.
  // For now, we'll use mock data
  useEffect(() => {
    // Simulate API call to get user's daily transits
    // In a real app, this would be based on user's birth data and current date
  }, []);
  
  const handleRitualSelect = (ritual) => {
    setSelectedRitual(ritual);
    setIsRitualDrawerOpen(true);
  };
  
  const handleTarotPull = () => {
    // In a real app, we'd call an API to get a random tarot card
    // For now, we'll use mock data
    dispatch(setCurrentCard(mockTarotCard));
    setIsTarotDrawerOpen(true);
  };
  
  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <Container>
      <Header>
        <WelcomeMessage>Welcome, Seeker</WelcomeMessage>
        <DateDisplay>{formattedDate}</DateDisplay>
      </Header>
      
      <Section>
        <SectionTitle>How are you feeling today?</SectionTitle>
        <MoodPicker />
      </Section>
      
      <Section>
        <SectionTitle>Daily Cosmic Snapshot</SectionTitle>
        <CosmicSnapshotCard>
          {mockDailyTransits.map((transit, index) => (
            <PlanetInfo key={index}>
              <PlanetIcon>{transit.emoji}</PlanetIcon>
              <PlanetText>
                <PlanetName>{transit.planet} in {transit.sign} (House {transit.house})</PlanetName>
                <PlanetDescription>{transit.description}</PlanetDescription>
              </PlanetText>
            </PlanetInfo>
          ))}
        </CosmicSnapshotCard>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <Button 
            onClick={() => handleTarotPull()} 
            style={{ flex: 1 }}
          >
            Pull Today's Card
          </Button>
          <Button 
            onClick={() => {}} 
            variant="secondary" 
            style={{ flex: 1 }}
          >
            View Full Chart
          </Button>
        </div>
      </Section>
      
      <Section>
        <SectionTitle>Recommended Rituals</SectionTitle>
        <RitualGrid>
          {mockRituals.map((ritual) => (
            <RitualCard 
              key={ritual.id} 
              ritual={ritual} 
              onStart={handleRitualSelect}
            />
          ))}
        </RitualGrid>
      </Section>
      
      {/* Tarot Card Drawer */}
      <BottomDrawer 
        isOpen={isTarotDrawerOpen} 
        onClose={() => setIsTarotDrawerOpen(false)} 
        height="70vh"
      >
        <SectionTitle>Your Tarot Insight</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <TarotCard card={currentCard || mockTarotCard} />
        </div>
      </BottomDrawer>
      
      {/* Ritual Drawer */}
      <BottomDrawer 
        isOpen={isRitualDrawerOpen} 
        onClose={() => setIsRitualDrawerOpen(false)} 
        height="70vh"
      >
        {selectedRitual && (
          <>
            <SectionTitle>{selectedRitual.title}</SectionTitle>
            <p style={{ marginBottom: '24px' }}>{selectedRitual.description}</p>
            <h3>Steps:</h3>
            <ol style={{ marginLeft: '24px', marginTop: '16px' }}>
              <li>Find a quiet space where you won't be disturbed</li>
              <li>Light a candle or incense if available</li>
              <li>Take three deep breaths to center yourself</li>
              <li>Follow the guided visualization or meditation</li>
              <li>Close by setting an intention for the day</li>
            </ol>
            <Button style={{ marginTop: '32px', width: '100%' }}>
              Begin Guided Experience
            </Button>
          </>
        )}
      </BottomDrawer>
      
      {/* Soul Guide Chat button */}
      <SoulGuide />
    </Container>
  );
};

export default Home;
