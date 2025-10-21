# CLAUDE.md - AI Assistant Context for NextFolio

This document provides context for AI assistants (like Claude Code) working on this codebase.

## Project Overview

**NextFolio** is Jake Malmrose's personal portfolio website showcasing software development projects, skills, and an online resume. It's deployed at [malmrose.com](https://malmrose.com/).

**Key Features:**
- Project showcase pages (Firefly Events, NewsBites, Vapor, etc.)
- Online resume/portfolio
- Time tracking application with authentication
- AI Studio (OpenWebUI) integration at llm.malmrose.com
- Fully containerized deployment with Docker Compose
- Automated CI/CD via GitHub Actions

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL database
- JWT authentication (bcrypt + jsonwebtoken)

**Infrastructure:**
- Docker & Docker Compose
- Caddy (reverse proxy with automatic HTTPS)
- GitHub Actions (CI/CD)
- Ubuntu NUC server (self-hosted)

## Project Structure

```
nextfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── logout/
│   │   │   └── check/
│   │   ├── contracts/            # Contract CRUD
│   │   ├── time-entries/         # Time entry CRUD + weekly breakdown
│   │   └── users/                # User management (admin)
│   ├── components/               # Shared React components
│   │   └── Navbar.tsx            # Main navigation
│   ├── timetracker/              # Time tracking app
│   │   ├── components/           # Time tracker specific components
│   │   └── page.tsx
│   ├── projects/                 # Projects listing page
│   ├── resume/                   # Resume page
│   ├── portfolio/                # Portfolio page
│   ├── firefly-events/           # Project detail pages
│   ├── newsbites/
│   ├── adobe/
│   ├── qr/
│   ├── proofofconcept/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles + Tailwind directives
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── caddy/
│   ├── Caddyfile                 # Reverse proxy config
│   └── README.md
├── scripts/                      # Utility scripts
│   └── README.md
├── .github/workflows/
│   └── deploy.yml                # CI/CD pipeline
├── docker-compose.yml            # Multi-service orchestration
├── Dockerfile.next               # Next.js container
├── docker-entrypoint.sh          # Container startup script
├── next.config.ts                # Next.js config (standalone mode)
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies & scripts
```

## Database Schema (Prisma)

The app uses PostgreSQL via Prisma ORM. Schema location: `prisma/schema.prisma`

**Models:**

1. **User** - Authentication and authorization
   - `id` (cuid), `username` (unique), `password` (bcrypt hashed), `role` (admin/user)

2. **Contract** - Work contracts for time tracking
   - `id` (cuid), `name`, `color` (#hex), timestamps
   - Relation: `timeEntries` (one-to-many)

3. **TimeEntry** - Individual time logs
   - `id` (cuid), `contractId`, `date`, `hoursWorked`, `tasks`, `notes`
   - Relation: `contract` (many-to-one, cascade delete)
   - Indexes on `contractId` and `date`

**Database URL:** Set via `DATABASE_URL` env var (see docker-compose.yml)

## API Routes

All routes return JSON. Authentication uses JWT tokens stored in httpOnly cookies.

**Authentication (`/api/auth/`):**
- `POST /api/auth/signup` - Create admin user (only if no users exist)
- `POST /api/auth/login` - Login, returns JWT cookie
- `POST /api/auth/logout` - Clear JWT cookie
- `GET /api/auth/check` - Verify authentication status

**Contracts (`/api/contracts/`):**
- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create contract
- `PUT /api/contracts/[id]` - Update contract
- `DELETE /api/contracts/[id]` - Delete contract (cascades to time entries)

**Time Entries (`/api/time-entries/`):**
- `GET /api/time-entries?contractId=...` - List entries (optional filter)
- `POST /api/time-entries` - Create entry
- `PUT /api/time-entries/[id]` - Update entry
- `DELETE /api/time-entries/[id]` - Delete entry
- `GET /api/time-entries/weekly?weekStart=YYYY-MM-DD` - Weekly breakdown

**Users (`/api/users/`):**
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `DELETE /api/users` - Delete user (admin only)

## Key Conventions

**TypeScript:**
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES2017
- Next.js 15 requires async params handling in route handlers

**Styling:**
- Tailwind CSS 4 (no `@tailwind` directives, uses `@import`)
- Global styles in `app/globals.css`
- Component-level Tailwind classes
- Color scheme includes dark mode support

**Authentication:**
- JWT tokens in httpOnly cookies
- Passwords hashed with bcrypt
- Middleware checks in API routes
- Admin role for user management

**Code Style:**
- React Server Components by default
- Client components marked with `'use client'`
- Async/await for DB operations
- Error handling with try/catch, returns status codes

## Development Workflow

**Setup:**
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations (dev)
npm run prisma:migrate:dev

# Start dev server
npm run dev
```

**Database:**
```bash
# Open Prisma Studio (GUI)
npm run prisma:studio

# Deploy migrations (production)
npm run prisma:migrate
```

**Build:**
```bash
npm run build  # Runs prisma generate + next build
```

**Important Files:**
- `.env` - Environment variables (gitignored, required for deployment)
- `docker-compose.yml` - Defines postgres, nextjs, caddy, pgadmin, openwebui services
- `.dockerignore` - Excludes node_modules, .next, etc. from Docker builds

## Deployment

**CI/CD Pipeline** (`.github/workflows/deploy.yml`):
1. Triggers on push to `master` branch
2. Runs on self-hosted Ubuntu runner
3. SSH into NUC server using secrets (HOST, USERNAME, SSH_KEY, PORT)
4. Pulls latest code
5. Rebuilds Docker containers: `docker compose down && docker compose build --no-cache && docker compose up -d`

**Server Requirements:**
- Docker & Docker Compose installed
- `.env` file with secrets (POSTGRES_PASSWORD, JWT_SECRET, GOOGLE_CLIENT_ID, etc.)
- Passwordless sudo for Docker commands (see `scripts/setup-passwordless-sudo.sh`)
- Ports: 80 (HTTP), 443 (HTTPS), 3001 (Next.js internal), 5432 (Postgres), 5050 (pgAdmin)

**Services:**
- `nextjs` - Portfolio app (port 3001 → 3000 internal)
- `postgres` - Database (port 5432)
- `caddy` - Reverse proxy (ports 80, 443)
- `pgadmin` - Database admin UI (port 5050)
- `openwebui` - AI chat interface (llm.malmrose.com)

**Caddy Routes:**
- `malmrose.com` → nextjs:3000
- `llm.malmrose.com` → openwebui
- `db.malmrose.com` → pgadmin:80
- Automatic HTTPS via Let's Encrypt

## Environment Variables

**Required for production (.env file):**
```bash
# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://nextfolio:${POSTGRES_PASSWORD}@postgres:5432/nextfolio?schema=public

# Auth
JWT_SECRET=your_jwt_secret

# pgAdmin
PGADMIN_DEFAULT_PASSWORD=your_pgadmin_password

# OpenWebUI (optional, but needed for LLM features)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
GOOGLE_OAUTH_SCOPE=openid email profile
GOOGLE_REDIRECT_URI=https://llm.malmrose.com/oauth/google/callback
```

## Common Tasks

**Adding a new page:**
1. Create `app/your-page/page.tsx`
2. Export default async function component
3. Add navigation link in `app/components/Navbar.tsx` if needed

**Adding a new API route:**
1. Create `app/api/your-route/route.ts`
2. Export named functions: GET, POST, PUT, DELETE
3. Use Prisma for DB operations
4. Return `Response.json()` or `new Response()`

**Database changes:**
1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate:dev` (creates migration)
3. Migration files go in `prisma/migrations/`
4. Commit migration files

**Updating dependencies:**
```bash
npm update
npm run build  # Test build
```

**Debugging Docker:**
```bash
# View logs
docker compose logs -f nextjs

# Restart service
docker compose restart nextjs

# Rebuild
docker compose up -d --build nextjs
```

## Important Notes

1. **Next.js 15 Async Params:** Route handlers must handle params as async in Next.js 15. This has been fixed in recent commits.

2. **Standalone Output:** `next.config.ts` sets `output: 'standalone'` for optimized Docker builds.

3. **Package Manager:** Project uses **npm** (not pnpm or yarn). `pnpm-lock.yaml` was removed to standardize.

4. **Prisma Generate:** Build script includes `prisma generate` to ensure client is generated before Next.js build.

5. **Time Tracker Feature:** Full-featured time tracking app with authentication, contracts, and time entries. Admin users can manage other users.

6. **GitHub Actions Runner:** Uses **self-hosted runner** (not GitHub-hosted). Runner configured on the Ubuntu NUC.

7. **No Claude Knowledge File:** `.gitignore` excludes `CLAUDE_KNOWLEDGE.md` - this CLAUDE.md file serves that purpose.

8. **Browser Extension Background:** Jake Malmrose worked at Hover.gg developing browser extensions and integrations.

## Recent Changes

- Switched from pnpm to npm (removed pnpm-lock.yaml)
- Fixed Next.js 15 async params type errors in API routes
- Migrated to self-hosted GitHub Actions runner
- Added time tracker feature with Prisma + PostgreSQL
- Updated to Next.js 15 + React 19

## Contact & Resources

- **Live Site:** https://malmrose.com/
- **AI Studio:** https://llm.malmrose.com/
- **Owner:** Jake Malmrose
- **Repository:** https://github.com/JakeMalmrose/nextfolio

## Tips for AI Assistants

1. **Read Before Write:** Always use the Read tool before editing files
2. **Database Changes:** Remember to generate Prisma client after schema changes
3. **Authentication:** Many API routes require JWT authentication - check middleware
4. **Docker Context:** Be aware that development (npm run dev) differs from production (Docker)
5. **Type Safety:** TypeScript strict mode is enabled - ensure type correctness
6. **Testing Changes:** Suggest running `npm run build` to verify builds pass
7. **Git Branch:** Work on feature branches starting with `claude/` (per repository requirements)
8. **Commit Style:** Use descriptive commit messages following project conventions

---

Last updated: 2025-10-21
