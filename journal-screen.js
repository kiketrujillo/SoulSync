// src/screens/Journal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// Components
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import GlowingCard from '../components/GlowingCard';
import BottomDrawer from '../components/BottomDrawer';

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

const JournalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const EditorContainer = styled(GlowingCard)`
  margin-bottom: 24px;
`;

const JournalEditor = styled.textarea`
  width: 100%;
  min-height: 250px;
  padding: 16px;
  background: transparent;
  border: none;
  font-family: 'Lora', serif;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.text?.secondary || '#666666'}80;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EntryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows?.soft || '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const EntryTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const EntryDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
`;

const EntryPreview = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.text?.secondary || '#666666'};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const EntryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  padding: 4px 8px;
  background: ${props => props.theme.primary || '#87CEEB'}20;
  border-radius: 12px;
  color: ${props => props.theme.text?.primary || '#333333'};
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows?.strong || '0 10px 20px rgba(0, 0, 0, 0.2)'};
`;

const DreamAnalysisResult = styled(GlowingCard)`
  margin-top: 24px;
`;

// Mock journal entries for demonstration
const mockEntries = [
  {
    id: 1,
    title: 'Full Moon Reflections',
    content: 'Tonight I sat under the full moon and felt a deep connection to my ancestors. The silver light seemed to whisper ancient wisdom, reminding me that I am part of something much larger than myself. I set intentions for healing and growth in the coming lunar cycle.',
    date: '2023-06-15T21:30:00',
    tags: ['Full Moon', 'Ritual', 'Intentions'],
    cosmicInsights: [
      'The Full Moon in Sagittarius is illuminating your path to higher knowledge',
      'Jupiter's influence suggests expansion in spiritual understanding',
    ]
  },
  {
    id: 2,
    title: 'Strange Dream of Flying',
    content: 'I dreamt I was flying over a vast ocean at night. The stars reflected in the water, creating the illusion of flying through space. A white owl guided me to an island with a single tree that bore fruit made of crystals. I woke feeling both energized and peaceful.',
    date: '2023-06-10T08:15:00',
    tags: ['Dream', 'Flight', 'Symbols'],
    dreamAnalysis: {
      symbols: [
        { symbol: 'Flying', meaning: 'Represents freedom, transcendence of limitations, or desire for escape' },
        { symbol: 'Ocean', meaning: 'Your emotional depths, the unconscious mind, or feelings of vastness' },
        { symbol: 'White Owl', meaning: 'Wisdom, intuition, and the ability to see what others cannot' },
        { symbol: 'Crystal Fruit', meaning: 'Spiritual nourishment, clarity of thought, or manifestation of desires' }
      ],
      cosmicConnections: 'This dream occurred during Mercury retrograde in Gemini, suggesting a reconnection with forgotten wisdom and alternate forms of communication.'
    }
  },
];

const Journal = () => {
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '' });
  const [entries, setEntries] = useState(mockEntries);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dreamAnalysis, setDreamAnalysis] = useState(null);
  
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const handleSaveEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    
    // Create new entry
    const newEntry = {
      id: Date.now(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date().toISOString(),
      tags: [] // In a real app, we'd extract tags from content or let user add them
    };
    
    // Add to entries
    setEntries([newEntry, ...entries]);
    
    // Clear current entry
    setCurrentEntry({ title: '', content: '' });
  };
  
  const handleAnalyzeDream = () => {
    if (!currentEntry.content) return;
    
    // Show loading state
    setIsAnalyzing(true);
    
    // In a real app, we'd call the AI endpoint to analyze the dream
    // For demo purposes, we'll simulate a loading state and then show mock results
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Sample dream analysis
      setDreamAnalysis({
        symbols: [
          { symbol: 'Water', meaning: 'Emotional state, unconscious mind' },
          { symbol: 'Mountain', meaning: 'Challenges to overcome, higher perspective' },
          { symbol: 'Stars', meaning: 'Aspirations, spiritual guidance, destiny' }
        ],
        patterns: 'Your dream suggests a period of emotional processing that leads to spiritual insight.',
        cosmicConnections: 'With the Moon in Pisces today, your dream reflects deep intuitive waters being stirred.'
      });
    }, 2000);
  };
  
  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setIsEntryDrawerOpen(true);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Container>
      <Header>
        <SectionTitle>Cosmic Journal</SectionTitle>
        <Description>
          Record your thoughts, dreams, and spiritual insights. Our Soul Guide can analyze your dreams
          and connect them to cosmic patterns to deepen your self-understanding.
        </Description>
      </Header>
      
      <JournalContainer>
        <EditorContainer>
          <input
            type="text"
            placeholder="Entry Title..."
            value={currentEntry.title}
            onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
            style={{ 
              width: '100%', 
              border: 'none', 
              background: 'transparent', 
              fontSize: '1.2rem',
              fontFamily: 'Lora, serif',
              marginBottom: '16px',
              padding: '0 16px'
            }}
          />
          
          <JournalEditor
            placeholder="Write your thoughts, reflect on your day, or describe a dream..."
            value={currentEntry.content}
            onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
          />
          
          <ActionBar>
            <Button
              variant="secondary"
              size="small"
              onClick={handleAnalyzeDream}
              disabled={!currentEntry.content}
            >
              Decode My Dream
            </Button>
            
            <ButtonGroup>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setCurrentEntry({ title: '', content: '' })}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleSaveEntry}
                disabled={!currentEntry.title || !currentEntry.content}
              >
                Save Entry
              </Button>
            </ButtonGroup>
          </ActionBar>
        </EditorContainer>
        
        {dreamAnalysis && (
          <DreamAnalysisResult>
            <SectionTitle>Dream Analysis</SectionTitle>
            
            <h3>Key Symbols</h3>
            <ul>
              {dreamAnalysis.symbols.map((item, index) => (
                <li key={index}>
                  <strong>{item.symbol}:</strong> {item.meaning}
                </li>
              ))}
            </ul>
            
            <h3>Pattern</h3>
            <p>{dreamAnalysis.patterns}</p>
            
            <h3>Cosmic Connection</h3>
            <p>{dreamAnalysis.cosmicConnections}</p>
            
            <Button
              variant="secondary"
              size="small"
              onClick={() => setDreamAnalysis(null)}
              style={{ marginTop: '16px' }}
            >
              Close Analysis
            </Button>
          </DreamAnalysisResult>
        )}
        
        <SectionTitle>Previous Entries</SectionTitle>
        
        <EntriesList>
          {entries.length === 0 ? (
            <p>No entries yet. Start journaling to see your entries here.</p>
          ) : (
            entries.map(entry => (
              <EntryCard
                key={entry.id}
                onClick={() => handleEntryClick(entry)}
                whileHover={{ y: -3 }}
              >
                <EntryHeader>
                  <EntryTitle>{entry.title}</EntryTitle>
                  <EntryDate>{formatDate(entry.date)}</EntryDate>
                </EntryHeader>
                <EntryPreview>{entry.content}</EntryPreview>
                <EntryTags>
                  {entry.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </EntryTags>
              </EntryCard>
            ))
          )}
        </EntriesList>
      </JournalContainer>
      
      {/* Dream Analysis Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingCard
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3>Analyzing Your Dream</h3>
              <p>Your Soul Guide is connecting with cosmic patterns...</p>
              <div 
                style={{
                  marginTop: '16px', 
                  height: '4px', 
                  background: '#efefef', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{ 
                    height: '100%', 
                    background: user?.theme?.primary || '#87CEEB' 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </LoadingCard>
          </LoadingOverlay>
        )}
      </AnimatePresence>
      
      {/* Entry Detail Drawer */}
      <BottomDrawer
        isOpen={isEntryDrawerOpen}
        onClose={() => setIsEntryDrawerOpen(false)}
        height="80vh"
      >
        {selectedEntry && (
          <>
            <SectionTitle>{selectedEntry.title}</SectionTitle>
            <EntryDate style={{ display: 'block', marginBottom: '16px' }}>
              {formatDate(selectedEntry.date)}
            </EntryDate>
            
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedEntry.content}
            </div>
            
            {selectedEntry.tags.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3>Tags</h3>
                <EntryTags>
                  {selectedEntry.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </EntryTags>
              </div>
            )}
            
            {selectedEntry.cosmicInsights && (
              <div style={{ marginBottom: '16px' }}>
                <h3>Cosmic Insights</h3>
                <ul>
                  {selectedEntry.cosmicInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedEntry.dreamAnalysis && (
              <div>
                <h3>Dream Analysis</h3>
                <h4>Symbols</h4>
                <ul>
                  {selectedEntry.dreamAnalysis.symbols.map((item, index) => (
                    <li key={index}>
                      <strong>{item.symbol}:</strong> {item.meaning}
                    </li>
                  ))}
                </ul>
                
                <h4>Cosmic Connection</h4>
                <p>{selectedEntry.dreamAnalysis.cosmicConnections}</p>
              </div>
            )}
          </>
        )}
      </BottomDrawer>
    </Container>
  );
};

export default Journal;
