# Create the project directory
mkdir SoulSyncBackend
cd SoulSyncBackend

# Initialize the project with npm
npm init -y

# Install core dependencies
npm install express typescript @types/express ts-node nodemon dotenv
npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
npm install pg prisma @prisma/client mongoose
npm install axios socket.io @types/socket.io
npm install redis express-rate-limit rate-limit-redis

# Setup TypeScript
npx tsc --init

# Create the directory structure
mkdir -p src/controllers src/middleware src/models src/services src/utils src/db src/data
