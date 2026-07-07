#!/bin/sh
set -e

echo "Running database migrations..."

# Run Prisma migrations with the CLI version baked into the image;
# npx here would download the latest CLI at container start, which broke
# when Prisma 7 began rejecting v6 schemas
node node_modules/prisma/build/index.js migrate deploy

echo "Migrations completed successfully!"

# Start the Next.js server
echo "Starting Next.js server..."
exec node server.js
