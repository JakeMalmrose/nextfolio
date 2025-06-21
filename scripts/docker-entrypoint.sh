#!/bin/sh

echo "🔄 Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  echo "Waiting for postgres..."
  sleep 1
done

echo "✅ PostgreSQL is ready!"

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations complete! Starting Next.js..."
exec node server.js