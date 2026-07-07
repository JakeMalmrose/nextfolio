# NextFolio - Jake Malmrose's Portfolio

[![Deploy Status](https://img.shields.io/github/actions/workflow/status/JakeMalmrose/nextfolio/deploy.yml?branch=master&label=Deployment&style=flat-square)](https://github.com/JakeMalmrose/nextfolio/actions/workflows/deploy.yml)

Jake Malmrose's personal portfolio — a one-page site covering current work, personal projects, and skills, plus a web resume.

**Live:** [https://malmrose.com/](https://malmrose.com/)

---

## Pages

*   **/** — one-page portfolio: hero, current work (MeritsAI, Wasatch Global Investors, DSD Laboratories), earlier roles, personal projects (Draupforge, NewsBites, homelab), skills, contact.
*   **/resume** — web resume with a downloadable copy.
*   **/timetracker** — private contract-hours tracker (auth + Postgres); intentionally unlinked from the nav.

## Tech Stack

*   **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
*   **Data:** PostgreSQL + Prisma (time tracker), JWT auth
*   **Infrastructure:** Docker Compose, Caddy, Cloudflare Tunnel
*   **Deployment:** self-hosted GitHub Actions runner on a home NUC; pushes to `master` redeploy with `--no-cache` builds

## Development

```bash
npm install
npm run dev
```

The portfolio and resume pages are static and need no database. The time tracker requires Postgres (`docker compose up postgres`) and `DATABASE_URL`/`JWT_SECRET` in `.env`.

## Deployment

Push to `master`. The self-hosted runner on the NUC (`.github/workflows/deploy.yml`) rebuilds the Docker images with `--no-cache` and restarts the stack: Next.js + Postgres + pgAdmin + OpenWebUI behind Caddy, published via Cloudflare Tunnel. An `.env` file on the server provides `POSTGRES_PASSWORD`, `JWT_SECRET`, `PGADMIN_DEFAULT_PASSWORD`, and the Google OAuth settings for OpenWebUI.

## Configuration

*   **Next.js:** `next.config.ts` (includes `output: 'standalone'` for Docker).
*   **Styling:** design tokens and shared classes live in `app/globals.css`.
*   **Docker:** `Dockerfile.next` + `docker-compose.yml` define the services, networks, and volumes.
*   **Caddy:** `caddy/Caddyfile` routes `malmrose.com` to Next.js (plus pgAdmin/OpenWebUI subdomains inside the tunnel).
