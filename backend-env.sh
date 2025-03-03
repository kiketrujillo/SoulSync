// backend/.env
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/soulsync?schema=public"
MONGO_URI="mongodb://localhost:27017/soulsync"

# JWT Secret
JWT_SECRET="your-secret-key-replace-in-production"

# Redis for rate limiting and caching
REDIS_URL="redis://localhost:6379"

# Encryption key (32 chars for AES-256)
ENCRYPTION_KEY="32-char-long-key-here-1234567890"

# AI Service URL
AI_SERVICE_URL="http://localhost:8000"
