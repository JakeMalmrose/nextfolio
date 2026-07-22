import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume | Jake Malmrose',
  description:
    'Resume of Jake Malmrose, full-stack engineer working across Laravel, FastAPI, .NET, React, and Azure.',
};

interface Experience {
  title: string;
  company: string;
  location?: string;
  date: string;
  bullets: string[];
}

const skillRows: { name: string; items: string }[] = [
  {
    name: 'Languages',
    items: 'PHP, Python, C# (.NET Framework + Core), TypeScript/JavaScript, Go, SQL, Bash',
  },
  {
    name: 'Cloud / Infrastructure',
    items:
      'Azure (Functions, Durable Functions, Service Bus, Event Grid, Blob Storage, Key Vault, Static Web Apps, Entra ID, Azure SQL), AWS, Docker, Bicep, GitLab CI/CD, GitHub Actions',
  },
  {
    name: 'AI / Data',
    items:
      'OpenAI APIs, LangChain, LangGraph, BAML, RAG, pgvector, hybrid search (BM25 + vector), Tesseract OCR, PostgreSQL, Redis',
  },
  {
    name: 'Auth / Patterns',
    items: 'JWT, OIDC, OAuth 2.0, Azure AD / Entra ID, RBAC, multi-tenant SaaS',
  },
];

const experiences: Experience[] = [
  {
    title: 'Full Stack Engineer',
    company: 'DSD Labs',
    location: 'Salt Lake City, UT',
    date: 'May 2026 – Present',
    bullets: [
      'Built GitLab CI/CD pipelines that deploy Laravel apps to Azure App Service across both commercial and GCC High (US Government) clouds, with separate dev and prod environments and per-environment config.',
      "Built DSD's corporate site from scratch (Laravel 13, Tailwind v4, Vite), wiring public lead-capture forms cross-app into the HAL recruiting database with Cloudflare Turnstile bot protection and shared Azure Blob resume storage.",
    ],
  },
  {
    title: 'Software Engineer (Contract)',
    company: 'Wasatch Global Investors',
    location: 'Salt Lake City, UT',
    date: 'Oct 2025 – Present',
    bullets: [
      'Built an internal Client Agreement Tracker on Azure Static Web Apps with Entra ID auth, Key Vault, an Azure Function backend, and a SharePoint poller.',
      'Develop and maintain a .NET Framework 4.7.2 Web API 2 backend (Dapper ORM, repository pattern, Unity DI) serving fund performance, holdings, and characteristics data to a custom WordPress PHP theme.',
      'Built a React 18 + TypeScript SPA for digitizing DuPont financial review sheets, backed by a separate .NET Core 6 API with Azure AD OIDC authentication.',
    ],
  },
  {
    title: 'Software Engineer (Contract)',
    company: 'MeritsAI',
    date: 'Oct 2025 – Present',
    bullets: [
      'Core contributor across a multi-tenant ediscovery SaaS platform spanning a Laravel 10 webapp, FastAPI RAG service, three Azure Function apps, and a PyQt desktop client; ship features end-to-end across 5+ services.',
      'Architected the document ingestion pipeline using Azure Blob, Event Grid, Service Bus, and Durable Functions, integrating LibreOffice conversion, Tesseract OCR, and handwriting detection feeding AI enrichment workers on OpenAI + BAML.',
      'Designed and implemented a two-tier RBAC system (firm-level + per-case ACL) with custom Laravel middleware, policies, and a centralized authorization service across multiple role types.',
      'Drive feature scoping directly with law-firm stakeholders in weekly working sessions; translate requirements into shipped features across the full stack.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Aabo Home',
    location: 'Salt Lake City, UT',
    date: 'Jul 2025 – Oct 2025',
    bullets: [
      'Architected and developed a complete internal OAuth 2.0 authentication server from scratch using PHP Laravel and the Passport framework, including secure service integrations enabling centralized authentication across multiple third-party services.',
      'Built responsive frontend administration UI and established a comprehensive test suite covering authentication and security compliance.',
    ],
  },
  {
    title: 'Software Engineer Intern',
    company: 'Adobe',
    location: 'Lehi, UT',
    date: 'Mar 2025 – Jun 2025',
    bullets: [
      'Built an internal developer tool for managing Workfront instances, eliminating manual setup errors and reducing onboarding time.',
      'Architected the system design and mentored coworkers on the tech stack and best practices.',
      'Implemented integrations between the application and Adobe IAM, the internal Redrock service, and Okta.',
    ],
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'Firefly Events',
    date: 'Jan 2025 – Mar 2025',
    bullets: [
      'Built a full-stack venue rental management application using Next.js, Prisma, MongoDB, React, and TailwindCSS.',
      'Integrated an end-to-end Stripe flow for reserving and finalizing payments.',
    ],
  },
];

export default function Resume() {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Jake Malmrose</h1>
        <p className="mt-1 text-lg text-muted">Full Stack Engineer</p>

        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-sm text-muted">
          <a href="mailto:jake.malmrose@gmail.com" className="hover:text-primary">
            jake.malmrose@gmail.com
          </a>
          <a href="tel:510-325-6879" className="hover:text-primary">
            510-325-6879
          </a>
          <a
            href="https://github.com/JakeMalmrose"
            className="hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/JakeMalmrose
          </a>
          <a
            href="https://www.linkedin.com/in/jake-malmrose/"
            className="hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/jake-malmrose
          </a>
        </div>

        <div className="mt-6">
          <a href="/JMalmrose_Resume.docx" download className="btn btn-ghost text-sm">
            Download resume ↓
          </a>
        </div>
      </div>

      {/* Skills */}
      <div className="card mb-8">
        <p className="section-label mb-4">skills</p>
        <div className="flex flex-col gap-3">
          {skillRows.map((row) => (
            <div key={row.name} className="flex flex-col gap-1 md:flex-row">
              <span className="w-56 shrink-0 font-mono text-xs uppercase tracking-wider text-primary">
                {row.name}
              </span>
              <span className="text-sm text-muted">{row.items}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="card mb-8">
        <p className="section-label mb-6">experience</p>
        <div className="flex flex-col gap-8">
          {experiences.map((exp) => (
            <div key={exp.company + exp.date}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {exp.company}
                  {exp.location && (
                    <span className="ml-2 text-sm font-normal text-muted">{exp.location}</span>
                  )}
                </h3>
                <span className="font-mono text-xs text-muted">{exp.date}</span>
              </div>
              <p className="mb-2 text-sm font-medium text-primary">{exp.title}</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="card mb-8">
        <p className="section-label mb-6">projects</p>
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">Draupforge</h3>
              <span className="font-mono text-xs text-muted">2026</span>
            </div>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              <li>
                Designed and built a hardcore browser ARPG with a Go game server and web client;
                self-hosted with CI/CD via GitHub Actions.{' '}
                <a
                  href="https://draupforge.malmrose.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                >
                  Playable at draupforge.malmrose.com ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">
                ASD Prediction Project
                <span className="ml-2 text-sm font-normal text-muted">
                  1st Place, Neumont College Hackathon
                </span>
              </h3>
              <span className="font-mono text-xs text-muted">May 2025</span>
            </div>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              <li>
                Won 1st place in a weekend hackathon with a machine-learning solution predicting
                autism status from questionnaire and demographic data; compared XGBoost, CatBoost,
                Random Forest, and Neural Network approaches in Python/Jupyter.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="card">
        <p className="section-label mb-4">education</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">Neumont College of Computer Science</h3>
            <p className="text-sm text-muted">
              B.S. Computer Science &amp; Software Engineering · GPA: 3.98
            </p>
          </div>
          <span className="font-mono text-xs text-muted">Sep 2025</span>
        </div>
      </div>
    </div>
  );
}
