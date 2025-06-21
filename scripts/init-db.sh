#!/bin/bash

# Wait for postgres to be ready
echo "🔄 Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  sleep 1
done

echo "📦 PostgreSQL is ready! Running Prisma migrations..."

# Deploy migrations
npx prisma migrate deploy

# Generate Prisma client (in case it's not already generated)
npx prisma generate

echo "✅ Database initialization complete!"