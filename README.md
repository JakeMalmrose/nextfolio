# NextFolio - Jake Malmrose's Portfolio

[![Deploy Status](https://img.shields.io/github/actions/workflow/status/JakeMalmrose/nextfolio/deploy.yml?branch=master&label=Deployment&style=flat-square)](https://github.com/JakeMalmrose/nextfolio/actions/workflows/deploy.yml)

This repository contains the code for Jake Malmrose's personal portfolio website, built with Next.js, TypeScript, and Tailwind CSS. It showcases various software development projects, skills, and includes an online resume.

**Live Demo:** [https://malmrose.com/](https://malmrose.com/)
**AI Studio (OpenWebUI):** [https://llm.malmrose.com/](https://llm.malmrose.com/)

---

## ✨ Features

*   **Project Showcase:** Dedicated pages detailing projects like:
    *   **Firefly Events:** A full-stack venue rental platform.
    *   **NewsBites:** An AI-powered news summarization site (Neumont Capstone).
    *   **Vapor:** A Go-based microservices game distribution platform concept.
*   **Online Resume:** A dynamic resume page highlighting skills, experience, and education.
*   **AI Integration:** Demonstrates AI usage in projects like NewsBites (summarization, tool calling) and hosts an OpenWebUI instance.
*   **Modern Tech Stack:** Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.
*   **Responsive Design:** Adapts to various screen sizes.
*   **Dockerized:** Fully containerized using Docker Compose for easy deployment and dependency management.
*   **Reverse Proxy:** Uses Caddy for efficient routing, automatic HTTPS, and serving multiple applications (portfolio + OpenWebUI).
*   **CI/CD:** Automated deployment to a personal server (Ubuntu NUC) via GitHub Actions on pushes to the `master` branch.

---

## 🚀 Tech Stack

*   **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
*   **Backend (Project Specific):** Go (Vapor), Node.js (Implicit via Next.js)
*   **Database (Project Specific):** MongoDB (Firefly Events), DynamoDB (NewsBites)
*   **AI/ML (Project Specific):** Generative AI (Anthropic, OpenAI APIs, Local LLMs via Ollama/OpenWebUI), NLP
*   **Infrastructure:** Docker, Docker Compose, Caddy
*   **Deployment:** GitHub Actions, SSH, Ubuntu Server
*   **Cloud (Project Specific):** AWS (Amplify, Lambda, CloudFront, DynamoDB)
*   **Authentication (Project Specific):** Clerk (Firefly Events), Google OAuth (OpenWebUI)

---

##  B Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JakeMalmrose/nextfolio.git
    cd nextfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the portfolio website.

*Note: The OpenWebUI service (`llm.malmrose.com`) requires additional setup (Docker Compose, potentially Ollama) and environment variables for OAuth, which are not part of the standard local development setup for just the portfolio.*

---

## 🚢 Deployment

This project is automatically deployed to a personal Ubuntu NUC server using GitHub Actions.

1.  **Trigger:** Pushing to the `master` branch triggers the `.github/workflows/deploy.yml` workflow.
2.  **Process:**
    *   The workflow checks out the code on an Ubuntu runner.
    *   It connects to the NUC server via SSH using secrets (`HOST`, `USERNAME`, `SSH_KEY`, `PORT`).
    *   On the server, it navigates to the `~/nextfolio` directory, pulls the latest changes (or clones if it's the first time).
    *   It uses `sudo docker compose down` to stop existing containers.
    *   It uses `sudo docker compose build --no-cache` to rebuild the images.
    *   It uses `sudo docker compose up -d` to start the services (`nextjs`, `caddy`, `openwebui`) in detached mode.
3.  **Server Prerequisites:**
    *   Docker and Docker Compose must be installed on the target server.
    *   The deployment user (`${{ secrets.USERNAME }}`) needs passwordless sudo permissions for Docker commands. This can be set up using the `scripts/setup-passwordless-sudo.sh` script. See `scripts/README.md` for details.
    *   An `.env` file needs to exist in the `~/nextfolio` directory on the server containing secrets like `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc., for the OpenWebUI service.

---

## ⚙️ Configuration

*   **Next.js:** Configuration is in `next.config.ts` (includes `output: 'standalone'` for Docker).
*   **Tailwind CSS:** Configuration is in `tailwind.config.ts` and `app/globals.css`.
*   **Docker:**
    *   `Dockerfile.next`: Defines the build process for the Next.js application.
    *   `docker-compose.yml`: Defines the services (`nextjs`, `caddy`, `openwebui`), networks, and volumes. It references an `.env` file for secrets.
    *   `.dockerignore`: Specifies files to exclude from the Docker build context.
*   **Caddy:** The reverse proxy configuration is in `caddy/Caddyfile`. It handles routing for `malmrose.com` to the `nextjs` service and `llm.malmrose.com` to the `openwebui` service, along with automatic HTTPS via Let's Encrypt.
*   **Deployment:** The GitHub Actions workflow is defined in `.github/workflows/deploy.yml`.

---

## 📂 Project Structure  
├── .github/workflows/ # GitHub Actions CI/CD pipeline  
├── app/ # Next.js App Router directory  
│ ├── components/ # Reusable React components (e.g., Navbar)  
│ ├── firefly-events/ # Page for Firefly Events project details  
│ ├── gambling/ # Placeholder page  
│ ├── newsbites/ # Page for NewsBites project details  
│ ├── projects/ # Page listing all projects  
│ ├── resume/ # Online resume page  
│ ├── globals.css # Global styles and Tailwind directives  
│ ├── layout.tsx # Root layout component  
│ └── page.tsx # Homepage component  
├── caddy/ # Caddy configuration and setup scripts  
│ ├── Caddyfile # Caddy configuration for reverse proxy and HTTPS  
│ ├── README.md # Caddy specific documentation  
├── public/ # Static assets (images, SVGs)  
├── scripts/ # Utility scripts  
│ ├── README.md # Script documentation   
├── .dockerignore # Files to ignore in Docker build context  
├── .gitignore # Files to ignore in Git  
├── docker-compose.yml # Docker Compose configuration for services  
├── Dockerfile.next # Dockerfile for the Next.js application  
├── next.config.ts # Next.js configuration  
├── package.json # Node.js project manifest and dependencies  
├── postcss.config.mjs # PostCSS configuration (for Tailwind)  
├── README.md # This file  
├── tailwind.config.ts # Tailwind CSS configuration  
└── tsconfig.json # TypeScript configuration  
