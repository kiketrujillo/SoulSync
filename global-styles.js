// src/styles/global.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Lora:wght@400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    line-height: 1.6;
    background: ${props => props.theme.gradient || 'linear-gradient(to bottom, #87CEEB, #FFFFFF)'};
    color: ${props => props.theme.text?.primary || '#333333'};
    overflow-x: hidden;
    transition: background 0.5s ease;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Lora', serif;
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  button, input, select, textarea {
    font-family: 'Montserrat', sans-serif;
  }
  
  button {
    cursor: pointer;
    background: transparent;
    border: 1px solid ${props => props.theme.primary || '#87CEEB'};
    color: ${props => props.theme.text?.primary || '#333333'};
    padding: 0.5em 1em;
    border-radius: 20px;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${props => props.theme.primary || '#87CEEB'};
      color: ${props => props.theme.text?.light || '#FFFFFF'};
    }
  }
  
  a {
    color: ${props => props.theme.accent || '#4B0082'};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.primary || '#87CEEB'};
    }
  }
  
  // Add a subtle texture overlay for the misty background effect
  body:after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.15;
    pointer-events: none;
    z-index: -1;
  }
`;

export default GlobalStyle;
