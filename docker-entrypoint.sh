#!/bin/sh
set -e

echo "Running database migrations..."

# Run Prisma migrations with the pinned CLI baked into the image at
# /opt/prisma-cli (see Dockerfile.next); npx here would download the latest
# CLI at container start, which broke when Prisma 7 began rejecting v6 schemas
node /opt/prisma-cli/node_modules/prisma/build/index.js migrate deploy --schema ./prisma/schema.prisma

echo "Migrations completed successfully!"

# Start the Next.js server
echo "Starting Next.js server..."
exec node server.js
