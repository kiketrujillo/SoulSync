// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onUpdate: registration => {
    // New content is available; notify the user
    const updateConfirmation = window.confirm(
      'New version of SoulSync is available. Would you like to refresh now to use the latest version?'
    );

    if (updateConfirmation) {
      // Wait for the service worker to take control
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to use the updated version
      window.location.reload();
    }
  },
  onSuccess: registration => {
    console.log('SoulSync is now available offline!');
  }
});
