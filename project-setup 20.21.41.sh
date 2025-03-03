# Initialize React Native project for mobile
npx react-native init SoulSync

# Initialize React project for web
npx create-react-app SoulSyncWeb

# Install common dependencies for both projects
cd SoulSync
npm install styled-components framer-motion @reduxjs/toolkit react-redux axios socket.io-client

# Setup web project dependencies
cd ../SoulSyncWeb
npm install styled-components framer-motion @reduxjs/toolkit react-redux axios socket.io-client
