#!/bin/bash
# scripts/db-backup.sh
# Automated database backup script for SoulSync

set -e

# Load environment variables
if [ -f .env ]; then
  source .env
fi

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
PG_BACKUP_FILE="$BACKUP_DIR/postgres_backup_$TIMESTAMP.sql"
MONGO_BACKUP_DIR="$BACKUP_DIR/mongodb_backup_$TIMESTAMP"
S3_BUCKET="${S3_BACKUP_BUCKET:-soulsync-backups}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# PostgreSQL backup
echo "Backing up PostgreSQL database..."
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
  echo "PostgreSQL environment variables not set, using defaults from DATABASE_URL"
  # Extract values from DATABASE_URL if available
  if [ -n "$DATABASE_URL" ]; then
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
  else
    echo "No database connection information available for PostgreSQL"
    exit 1
  fi
fi

# Perform PostgreSQL backup
PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$PG_BACKUP_FILE"
gzip "$PG_BACKUP_FILE"
echo "PostgreSQL backup completed: ${PG_BACKUP_FILE}.gz"

# MongoDB backup
echo "Backing up MongoDB database..."
if [ -z "$MONGO_URI" ]; then
  echo "MONGO_URI not set, using default localhost connection"
  MONGO_URI="mongodb://localhost:27017/soulsync"
fi

# Extract MongoDB connection details from URI
MONGO_HOST=$(echo $MONGO_URI | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
MONGO_PORT=$(echo $MONGO_URI | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
MONGO_DB=$(echo $MONGO_URI | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$MONGO_PORT" ]; then
  MONGO_PORT="27017"
fi

# Check for authentication in MongoDB URI
if [[ "$MONGO_URI" == *"@"* ]]; then
  MONGO_USER=$(echo $MONGO_URI | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
  MONGO_PASSWORD=$(echo $MONGO_URI | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')
  mongodump --host "$MONGO_HOST" --port "$MONGO_PORT" --username "$MONGO_USER" --password "$MONGO_PASSWORD" --db "$MONGO_DB" --out "$MONGO_BACKUP_DIR"
else
  mongodump --host "$MONGO_HOST" --port "$MONGO_PORT" --db "$MONGO_DB" --out "$MONGO_BACKUP_DIR"
fi

# Compress MongoDB backup
tar -czf "${MONGO_BACKUP_DIR}.tar.gz" -C "$BACKUP_DIR" "mongodb_backup_$TIMESTAMP"
rm -rf "$MONGO_BACKUP_DIR"
echo "MongoDB backup completed: ${MONGO_BACKUP_DIR}.tar.gz"

# Upload to S3 if AWS credentials are available
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "Uploading backups to S3..."
  aws s3 cp "${PG_BACKUP_FILE}.gz" "s3://${S3_BUCKET}/postgres/"
  aws s3 cp "${MONGO_BACKUP_DIR}.tar.gz" "s3://${S3_BUCKET}/mongodb/"
  echo "S3 upload completed"
else
  echo "AWS credentials not set, skipping S3 upload"
fi

# Clean up old backups (keeping last 7 days)
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -type f -name "postgres_backup_*.sql.gz" -mtime +7 -delete
find "$BACKUP_DIR" -type f -name "mongodb_backup_*.tar.gz" -mtime +7 -delete

echo "Backup process completed successfully!"
