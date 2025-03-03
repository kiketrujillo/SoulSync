#!/bin/bash
# scripts/db-migrate.sh
# Run Prisma migrations in production

set -e

echo "Starting database migration..."

# Check for production environment
if [ "$NODE_ENV" != "production" ]; then
  echo "Warning: Running migration in non-production environment: $NODE_ENV"
fi

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database migration completed successfully."
