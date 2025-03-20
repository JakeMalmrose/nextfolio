# Caddy Configuration for NextFolio

This directory contains the Caddy configuration for the NextFolio project.

## Setup

1. Modify the `Caddyfile` to use your actual domain name instead of the placeholder.
2. For production, update the TLS settings to use your email for Let's Encrypt notifications.

## Running with Docker Compose

From the project root, run:

```bash
docker-compose up -d
```

This will start both the Next.js application and Caddy as a reverse proxy.

## Manual Setup (Without Docker)

If you prefer to run Caddy manually:

1. [Download Caddy](https://caddyserver.com/download)
2. Run it with: `caddy run --config ./caddy/Caddyfile`

Make sure your Next.js application is running on port 3000 (or update the Caddyfile to match your port).

## Managing Caddy

- Reload config: `caddy reload --config ./caddy/Caddyfile`
- Stop Caddy: `caddy stop`
