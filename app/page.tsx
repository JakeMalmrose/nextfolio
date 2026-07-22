import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

interface Engagement {
  company: string;
  role: string;
  date: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

interface CompactEntry {
  company: string;
  role: string;
  date: string;
  summary: string;
  tech: string[];
}

interface PersonalProject {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  links: { label: string; href: string }[];
}

const engagements: Engagement[] = [
  {
    company: 'MeritsAI',
    role: 'Software Engineer (Contract)',
    date: 'Oct 2025 – Present',
    summary:
      'Legal-tech SaaS for ediscovery: document intake, OCR, AI-assisted review, semantic search, and case management, sold to law firms. Core contributor across the entire platform: a Laravel webapp, a FastAPI RAG service, three Azure Function apps, and a PyQt desktop client.',
    highlights: [
      'Ship features end-to-end across 5+ services: the document pipeline runs Upload → Azure Blob → Event Grid → Durable Functions orchestration → LibreOffice/Tesseract conversion and OCR → AI enrichment workers on Service Bus.',
      'Designed and built a two-tier RBAC system: firm-level access plus per-case ACLs, with custom Laravel middleware, policies, and a centralized authorization service.',
      'Rebuilt the desktop uploader to stream directly to Azure Blob with chunked resume and mid-upload SAS refresh, so multi-hour evidence uploads survive network drops and sleep.',
      'Drive feature scoping directly with law-firm stakeholders in weekly working sessions, then translate it into shipped work.',
    ],
    tech: ['Laravel', 'FastAPI', 'Azure Functions', 'PostgreSQL + pgvector', 'LangChain', 'OpenAI', 'Service Bus', 'Event Grid'],
  },
  {
    company: 'Wasatch Global Investors',
    role: 'Software Engineer (Contract)',
    date: 'Oct 2025 – Present',
    summary:
      'Investment-management firm. I own dev work on the public website and internal tooling: a .NET Web API serving fund performance data to a custom WordPress theme, plus internal apps on Azure.',
    highlights: [
      'Built an internal Client Agreement Tracker on Azure Static Web Apps with Entra ID auth, Key Vault, an Azure Function backend, and a SharePoint poller.',
      'Maintain a .NET Framework Web API (Dapper, repository pattern) serving fund performance, holdings, and characteristics data.',
      'Built a React + TypeScript SPA for digitizing DuPont financial review sheets, backed by a .NET Core API with Azure AD OIDC.',
    ],
    tech: ['.NET', 'React', 'TypeScript', 'Azure', 'WordPress', 'Dapper', 'Entra ID'],
  },
  {
    company: 'DSD Laboratories',
    role: 'Full Stack Engineer',
    date: 'May 2026 – Present',
    summary:
      'Full-time engineering for a defense-sector software firm, building and deploying Laravel applications across both commercial Azure and GCC High (US Government) clouds.',
    highlights: [
      'Built GitLab CI/CD pipelines deploying Laravel apps to Azure App Service in both commercial and GCC High clouds, with separate dev/prod environments and per-environment config.',
      'Built the corporate site from scratch (Laravel, Tailwind, Vite), wiring public lead-capture forms cross-app into an internal recruiting database with Cloudflare Turnstile bot protection.',
    ],
    tech: ['Laravel', 'GitLab CI/CD', 'Azure App Service', 'GCC High', 'Tailwind', 'Vite'],
  },
];

const earlier: CompactEntry[] = [
  {
    company: 'Aabo Home',
    role: 'Software Engineer',
    date: 'Jul – Oct 2025',
    summary:
      'Architected an internal OAuth 2.0 authentication server from scratch with Laravel Passport, centralizing auth across multiple third-party services.',
    tech: ['Laravel', 'OAuth 2.0', 'Postgres'],
  },
  {
    company: 'Adobe',
    role: 'Software Engineer Intern',
    date: 'Mar – Jun 2025',
    summary:
      'Built an internal developer tool for managing Workfront instances, with integrations into Adobe IAM, Okta, and internal services. Architected the system design and mentored coworkers.',
    tech: ['Node', 'React', 'Okta', 'IAM'],
  },
  {
    company: 'Firefly Events',
    role: 'Full Stack Developer Intern',
    date: 'Jan – Mar 2025',
    summary:
      'Built a venue rental management app with an end-to-end Stripe reservation and payment flow.',
    tech: ['Next.js', 'Prisma', 'MongoDB', 'Stripe'],
  },
];

const projects: PersonalProject[] = [
  {
    title: 'Draupforge',
    tagline: 'Hardcore browser ARPG',
    description:
      'A solo-self-found dungeon-crawling ARPG: descend floors, cut and socket skill gems, manage flasks, die permanently, rise again. Go server with a web client, self-hosted and playable in your browser.',
    tech: ['Go', 'TypeScript', 'systemd', 'GitHub Actions'],
    links: [
      { label: 'Play it', href: 'https://draupforge.malmrose.com' },
      { label: 'Source', href: 'https://github.com/JakeMalmrose/draupforge' },
    ],
  },
  {
    title: 'NewsBites',
    tagline: 'AI news summarization',
    description:
      'College capstone: processed thousands of news articles with LLM tool-calling and prompt caching to serve summaries with sub-300ms latency.',
    tech: ['React', 'TypeScript', 'AWS', 'Generative AI'],
    links: [{ label: 'Source', href: 'https://github.com/JakeMalmrose/Capstone' }],
  },
  {
    title: 'This site + homelab',
    tagline: 'Self-hosted everything',
    description:
      'This portfolio runs on a NUC in my house: Next.js in Docker Compose behind Caddy and a Cloudflare Tunnel, deployed by a self-hosted GitHub Actions runner on every push. The same box runs Home Assistant, Frigate NVR, and the Draupforge game server.',
    tech: ['Next.js', 'Docker', 'Caddy', 'Cloudflare Tunnel', 'GitHub Actions'],
    links: [{ label: 'Source', href: 'https://github.com/JakeMalmrose/nextfolio' }],
  },
];

interface LifePhoto {
  file: string;
  alt: string;
  caption: string;
}

// Drop files with these names into public/personal/ and they appear on the
// next deploy; anything missing renders as a placeholder tile.
const lifePhotos: LifePhoto[] = [
  {
    file: 'romeo-jasper.jpg',
    alt: 'Romeo and Jasper, two cats',
    caption: 'Romeo & Jasper. Hobbies: eating, waiting to eat.',
  },
  {
    file: 'ponyo.jpg',
    alt: 'Ponyo, a standard poodle',
    caption: 'Ponyo. Standard poodle, too smart for her own good.',
  },
  {
    file: 'new-zealand.jpg',
    alt: 'New Zealand, seen from the camper years',
    caption: 'New Zealand, somewhere between the top of the North Island and the bottom of the South.',
  },
  {
    file: 'linux-conference.jpg',
    alt: 'Jake and his wife at a Linux conference booth',
    caption: 'My wife and me at a Linux conference, back when my parents built Linux PCs for a living.',
  },
  {
    file: 'linux-kid.jpg',
    alt: 'Jake as a young kid at a Linux conference',
    caption: 'Same conference circuit, much earlier.',
  },
  {
    file: 'wedding.jpg',
    alt: 'Wedding photo',
    caption: 'From highschool sweethearts, to married.',
  },
  {
    file: 'me.jpg',
    alt: 'Jake Malmrose',
    caption: 'Me, more recently.',
  },
];

const personalDir = path.join(process.cwd(), 'public', 'personal');

const skillGroups: { name: string; skills: string[] }[] = [
  {
    name: 'Languages',
    skills: ['PHP', 'Python', 'C# / .NET', 'TypeScript', 'Go', 'SQL', 'Bash'],
  },
  {
    name: 'Frameworks',
    skills: ['Laravel', 'FastAPI', 'React', 'Next.js', 'Vue', 'ASP.NET Web API', 'WordPress'],
  },
  {
    name: 'Cloud & Infra',
    skills: ['Azure Functions', 'Durable Functions', 'Service Bus', 'Event Grid', 'Blob Storage', 'Key Vault', 'Static Web Apps', 'Docker', 'Bicep', 'GitLab CI/CD'],
  },
  {
    name: 'AI & Data',
    skills: ['OpenAI APIs', 'LangChain', 'LangGraph', 'RAG', 'pgvector', 'Hybrid search', 'Tesseract OCR', 'PostgreSQL', 'Redis'],
  },
  {
    name: 'Auth & Patterns',
    skills: ['JWT', 'OIDC', 'OAuth 2.0', 'Entra ID', 'RBAC design', 'Multi-tenant SaaS', 'Event-driven pipelines'],
  },
];

export default function Home() {
  const availablePhotos = new Set(
    lifePhotos.filter((p) => fs.existsSync(path.join(personalDir, p.file))).map((p) => p.file)
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero-glow border-b border-line">
        <div className="container grid gap-10 py-20 md:py-28 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div>
            <p className="section-label mb-4">jake malmrose · salt lake city, ut</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              I build <span className="gradient-text">backend, cloud, and AI systems</span> that run in production.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Full-stack engineer. Right now that means a multi-tenant
              legal-tech platform, fund-data infrastructure for an investment
              firm, and government-cloud deployments, all shipped end-to-end
              from schema to UI to infra.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#work" className="btn btn-primary">
                See the work
              </a>
              <Link href="/resume" className="btn btn-ghost">
                Resume
              </Link>
            </div>
          </div>

          <div className="terminal hidden lg:block">
            <div className="terminal-bar">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
            </div>
            <div className="p-5 text-muted">
              <p>
                <span className="text-primary">$</span> jake --current
              </p>
              <p className="mt-2">
                <span className="text-foreground">DSD Laboratories</span> · full-time
              </p>
              <p className="pl-4">Laravel → Azure GCC High</p>
              <p className="mt-1">
                <span className="text-foreground">MeritsAI</span> · contract
              </p>
              <p className="pl-4">ediscovery platform, 5+ services</p>
              <p className="mt-1">
                <span className="text-foreground">Wasatch Global</span> · contract
              </p>
              <p className="pl-4">.NET fund-data APIs + internal apps</p>
              <p className="mt-3">
                <span className="text-primary">$</span> <span className="animate-pulse">▊</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="scroll-mt-20 border-b border-line">
        <div className="container py-20">
          <p className="section-label mb-2">work</p>
          <h2 className="mb-10 text-3xl font-bold">What I&apos;m building</h2>

          <div className="flex flex-col gap-6">
            {engagements.map((job) => (
              <article key={job.company} className="card">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold">
                    {job.company}
                    <span className="ml-3 text-sm font-normal text-muted">{job.role}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted">{job.date}</span>
                </div>
                <p className="mb-4 max-w-3xl text-muted">{job.summary}</p>
                <ul className="mb-5 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed">
                  {job.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {job.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <h3 className="mb-6 mt-14 font-mono text-sm uppercase tracking-widest text-muted">Earlier</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {earlier.map((job) => (
              <article key={job.company} className="card flex flex-col">
                <div className="mb-2">
                  <h4 className="font-semibold">{job.company}</h4>
                  <p className="font-mono text-xs text-muted">
                    {job.role} · {job.date}
                  </p>
                </div>
                <p className="mb-4 flex-grow text-sm text-muted">{job.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {job.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Personal projects */}
      <section id="projects" className="scroll-mt-20 border-b border-line">
        <div className="container py-20">
          <p className="section-label mb-2">projects</p>
          <h2 className="mb-10 text-3xl font-bold">After hours</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="card flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="font-mono text-xs text-primary">{project.tagline}</p>
                </div>
                <p className="mb-4 flex-grow text-sm text-muted">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accent text-sm"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="scroll-mt-20 border-b border-line">
        <div className="container py-20">
          <p className="section-label mb-2">skills</p>
          <h2 className="mb-10 text-3xl font-bold">Toolbox</h2>

          <div className="flex flex-col gap-6">
            {skillGroups.map((group) => (
              <div key={group.name} className="flex flex-col gap-3 md:flex-row md:items-baseline">
                <h3 className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-muted">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span key={skill} className="chip chip-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life */}
      <section id="life" className="scroll-mt-20 border-b border-line">
        <div className="container py-20">
          <p className="section-label mb-2">life</p>
          <h2 className="mb-10 text-3xl font-bold">Off the clock</h2>

          <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
            <div className="flex max-w-3xl flex-col gap-4 text-muted">
              <p>
                Born in Texas. Raised in California, then Utah, then New
                Zealand, where my parents drove us in a camper from the top of
                the North Island to the bottom of the South while I did school
                from a laptop in the back. Remote work stopped being scary
                around age ten.
              </p>
              <p>
                The tech thing is hereditary: my parents ran a Linux PC
                building business, so I grew up on conference expo floors
                before I could see over the booths.
              </p>
              <p>
                Eventually I settled in Salt Lake City for Neumont and stayed.
                I married my high school sweetheart, we filled the house with
                animals, and I automated everything in it that would hold
                still. Home Assistant runs the lights, the cameras, and the
                server that is rendering this page.
              </p>
            </div>

            <div className="terminal">
              <div className="terminal-bar">
                <span className="terminal-dot" />
                <span className="terminal-dot" />
                <span className="terminal-dot" />
              </div>
              <div className="p-5 text-muted">
                <p>
                  <span className="text-primary">$</span> jake --off-duty
                </p>
                <p className="mt-2">
                  <span className="text-foreground">wife</span> · high school sweetheart
                </p>
                <p>
                  <span className="text-foreground">cats</span> · Romeo, Jasper{' '}
                  <span className="opacity-60"># gluttons</span>
                </p>
                <p>
                  <span className="text-foreground">dog</span> · Ponyo, standard poodle{' '}
                  <span className="opacity-60"># menace</span>
                </p>
                <p>
                  <span className="text-foreground">house</span> · runs on Home Assistant
                </p>
                <p className="mt-2">
                  <span className="text-primary">$</span> jake --hobbies
                </p>
                <p className="mt-1">path-of-exile <span className="text-foreground">(running)</span></p>
                <p className="opacity-60">error: no other hobbies found</p>
                <p className="mt-3">
                  <span className="text-primary">$</span> <span className="animate-pulse">▊</span>
                </p>
              </div>
            </div>
          </div>

          <h3 className="mb-6 mt-14 font-mono text-sm uppercase tracking-widest text-muted">
            Evidence
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {lifePhotos.map((photo) => (
              <figure key={photo.file} className="flex flex-col gap-2">
                {availablePhotos.has(photo.file) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/personal/${photo.file}`}
                    alt={photo.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-xl border border-line object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-line bg-background-paper">
                    <span className="font-mono text-xs text-muted opacity-70">photo incoming</span>
                  </div>
                )}
                <figcaption className="font-mono text-xs leading-relaxed text-muted">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <div className="container py-20">
          <p className="section-label mb-2">contact</p>
          <h2 className="mb-4 text-3xl font-bold">Get in touch</h2>
          <p className="mb-8 max-w-xl text-muted">
            The fastest way to reach me is email. I&apos;m always happy to talk
            systems, pipelines, or interesting problems.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:jake.malmrose@gmail.com" className="btn btn-primary">
              jake.malmrose@gmail.com
            </a>
            <a
              href="https://github.com/JakeMalmrose"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jake-malmrose/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
