# SoulSync ✨


*Your personal spiritual companion app*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-14.x-green.svg)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-18.x-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org)
[![Backend](https://img.shields.io/badge/backend-Express-black.svg)](https://expressjs.com)

</div>

## 🌟 Overview

SoulSync is a comprehensive spiritual companion app that integrates astrology, tarot, Kabbalah, and wellness into a personalized, adaptive experience. It's designed to evolve with your spiritual journey, providing insights and guidance based on your emotional state, cosmic events, and personal growth.

With an ethereal, minimalistic aesthetic and an ultra-intuitive interface, SoulSync feels like a sanctuary in digital form—a calming space for reflection, growth, and connection.

## ✨ Key Features

- **🌙 Living Soul Map**: A dynamic natal chart that fuses with the Kabbalistic Tree of Life, evolving as you grow
- **🔮 Mood-Driven Tarot & Rituals**: Personalized readings and wellness rituals based on your current mood and cosmic events
- **💬 AI Soul Guide**: Conversational AI providing tailored spiritual advice based on your chart, mood, and journey
- **📔 Cosmic Journal & Dream Decoder**: Track your spiritual journey and decode dreams with astrological insights
- **⚡ Wellness Quests**: Gamified tasks tied to moon phases and planetary shifts 
- **🕯️ Virtual Altar**: Set intentions with digital candles, crystals, and tarot cards
- **👥 Moon Circles**: Join live virtual rituals and connect with friends on similar paths
- **🌳 Spiritual Skill Tree**: A gamified learning path to master astrology, tarot, and Kabbalah

## 📱 Platforms Supported

- **Web**: Desktop and tablet browsers
- **Mobile**: iOS and Android via React Native 

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL
- MongoDB
- Redis (for caching and sessions)

### Installation

#### Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/soulsync.git
cd soulsync/backend

# Install dependencies
npm install

# Set up environment variables 
cp .env.example .env
# Update .env with your database URLs and secrets

# Initialize the database
npx prisma migrate dev --name init

# Start the server
npm run dev
```

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### AI Soul Guide Setup (Optional)

```bash
# Navigate to the AI service directory
cd ../ai-service

# Set up a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the AI service
uvicorn main:app --reload
```

## 🏗️ Architecture

SoulSync follows a modern, scalable architecture:

### Frontend

- **Framework**: React (web) + React Native (mobile)
- **State Management**: Redux Toolkit
- **Styling**: Styled-Components
- **Animations**: Framer Motion
- **UI Libraries**: Minimal use of Material-UI/Chakra UI with custom styling

### Backend

- **Framework**: Express.js with TypeScript
- **API**: RESTful endpoints with WebSocket support via Socket.IO
- **Databases**: 
  - PostgreSQL (via Prisma): Structured data (users, charts, progress)
  - MongoDB (via Mongoose): Unstructured data (journals, altar configurations)
- **Caching**: Redis for session management and frequently accessed data
- **Authentication**: JWT-based with refresh tokens
- **Security**: AES-256 encryption for sensitive data

### AI Soul Guide

- **Framework**: FastAPI (Python)
- **Model**: Fine-tuned language model for spiritual guidance
- **Integration**: Communicates with main backend via HTTP requests

## 📂 Project Structure

```
soulsync/
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── db/             # Database connections
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   └── prisma/             # Prisma schema and migrations
├── frontend/               # React/React Native frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens/pages
│   │   ├── store/          # Redux store setup
│   │   ├── styles/         # Theme and styling
│   │   └── assets/         # Images, fonts, etc.
└── ai-service/             # Python FastAPI service for AI
    ├── main.py             # FastAPI app
    └── model/              # Language model and utilities
```

## 🔒 Security

SoulSync prioritizes user data privacy and security:

- JWT-based authentication with token refresh
- AES-256 encryption for sensitive data (birth details, journals)
- HTTPS-only communication
- Rate limiting to prevent abuse
- CORS protection
- Regular security audits

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment

The backend can be deployed using Docker:

```bash
cd backend
docker build -t soulsync-backend .
docker run -p 5000:5000 soulsync-backend
```

For production environments, we recommend:
- AWS EC2 for hosting
- AWS RDS for PostgreSQL
- MongoDB Atlas for MongoDB
- ElastiCache for Redis
- S3 for static assets

### Frontend Deployment

The web version can be deployed to Vercel:

```bash
cd frontend
npm run build
vercel --prod
```

Mobile apps are built using Expo EAS and submitted to the App Store and Google Play.

## 🛣️ Roadmap

- **Phase 1**: Core features and platform stability
- **Phase 2**: Enhanced AI capabilities and personalization
- **Phase 3**: Community features expansion
- **Phase 4**: Integration with wearable devices for mood tracking
- **Phase 5**: AR/VR altar experiences

## 🤝 Contributing

We welcome contributions to SoulSync! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Have questions? Reach out to us:

- Email: contact@soulsync.app
- Twitter: [@SoulSyncApp](https://twitter.com/soulsyncapp)
- Discord: [SoulSync Community](https://discord.gg/soulsync)

---

<div align="center">
  
*SoulSync: Where technology meets spirituality*

</div>
