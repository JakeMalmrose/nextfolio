# Caddy Configuration for NextFolio

This directory contains the Caddy server configuration for the NextFolio project.

## Current Setup

The Caddyfile is configured to:

1. Serve the NextFolio application at malmrose.com and www.malmrose.com
2. Automatically obtain and renew SSL certificates through Let's Encrypt
3. Proxy all requests to the Next.js application running in Docker

## Important Notes

- The email address in the Caddyfile is used for Let's Encrypt registration
- Caddy automatically handles HTTPS certificate issuance and renewal
- Both the www and non-www versions of the domain are configured
- The configuration also includes a fallback for direct IP access during DNS propagation

## Troubleshooting

If you encounter issues with the Caddy setup:

1. Check DNS configuration:
   ```bash
   dig malmrose.com
   dig www.malmrose.com
   ```
   
2. Verify that ports 80 and 443 are open on your server:
   ```bash
   sudo netstat -tulpn | grep LISTEN
   ```
   
3. Check Caddy logs:
   ```bash
   sudo docker compose logs caddy
   ```

4. For certificate issues, check the Caddy data directory:
   ```bash
   sudo docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
   ```

## Custom Domain Changes

If you need to change the domain:

1. Update the Caddyfile with the new domain name
2. Update the DOMAIN environment variable in docker-compose.yml
3. Restart Caddy:
   ```bash
   sudo docker compose restart caddy
   ```
