#!/bin/sh
set -e

echo "Running database migrations..."

# Run Prisma migrations (deploy to production)
npx prisma migrate deploy

echo "Migrations completed successfully!"

# Start the Next.js server
echo "Starting Next.js server..."
exec node server.js
