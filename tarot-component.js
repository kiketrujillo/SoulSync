// src/components/tarot/TarotDrawer.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { pullTarotCard } from '../../store/slices/tarotSlice';
import TarotCard from './TarotCard';

const TarotDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentCard, loading, error } = useSelector(state => state.tarot);
  const { profile } = useSelector(state => state.user);

  useEffect(() => {
    // If the drawer is open and we don't have a card yet, pull one
    if (isOpen && !currentCard && !loading) {
      dispatch(pullTarotCard());
    }
  }, [isOpen, currentCard, loading, dispatch]);

  return (
    <motion.div
      className="tarot-drawer"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
    >
      <div className="drawer-header">
        <h2>Your Cosmic Card</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      <div className="drawer-content">
        {loading ? (
          <div className="loading">The stars are aligning...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : currentCard ? (
          <>
            <TarotCard card={currentCard} />
            
            {profile?.mood && (
              <div className="mood-interpretation">
                <h3>What this means for your {profile.mood} mood</h3>
                <p>{getMoodInterpretation(currentCard, profile.mood)}</p>
              </div>
            )}
            
            <button 
              onClick={() => dispatch(pullTarotCard())}
              className="pull-again-button"
            >
              Pull Another Card
            </button>
          </>
        ) : (
          <div className="empty-state">Prepare to receive cosmic guidance...</div>
        )}
      </div>
    </motion.div>
  );
};

// Helper function to generate mood-specific interpretations
const getMoodInterpretation = (card, mood) => {
  // In a real app, this would likely come from the backend or a more sophisticated algorithm
  const moodMap = {
    'calm': 'This card encourages you to maintain your peaceful state and...',
    'stressed': 'This card suggests that your stress may be related to...',
    'inspired': 'Channel your inspiration through this card\'s energy by...',
    // Other moods
  };
  
  return moodMap[mood.toLowerCase()] || 
    `The ${card.name} brings unique energy to your ${mood} state. Reflect on how its symbolism connects with your feelings.`;
};

export default TarotDrawer;
