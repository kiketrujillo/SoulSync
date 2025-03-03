// src/components/soul-guide/SoulGuide.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import soulGuideService from '../../services/soulGuideService';

const SoulGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { profile } = useSelector(state => state.user);
  const currentMood = profile?.mood || 'reflective';

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await soulGuideService.getResponse(currentMood, question);
      setResponse(result.response);
    } catch (err) {
      setError('The soul guide is meditating. Please try again shortly.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating chat bubble button */}
      <motion.button
        className="soul-guide-bubble"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        Ask Your Soul Guide
      </motion.button>
      
      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="soul-guide-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="modal-header">
              <h3>Your Soul Guide</h3>
              <button onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className="chat-area">
              {response && (
                <div className="guide-response">
                  <p>{response}</p>
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
            </div>
            
            <div className="question-area">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`What's on your ${currentMood} mind?`}
                disabled={loading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={askQuestion}
                disabled={loading || !question.trim()}
              >
                {loading ? 'Connecting...' : 'Ask'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SoulGuide;