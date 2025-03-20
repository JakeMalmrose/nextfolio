'use client';

import Link from 'next/link';

export default function FireflyEvents() {
  return (
    <div className="mt-8 mb-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Firefly Events
        </h1>
        <p className="max-w-2xl mx-auto">
          A comprehensive venue rental platform that streamlines the process of finding and booking venues for events.
          Built with the Reserved team using modern web technologies and secure authentication.
        </p>
        <div className="mt-6">
          <a
            href="https://ff.events/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:opacity-90 transition"
          >
            Visit Live Site
          </a>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <div className="paper">
          <p className="mb-4">
            As a Full Stack Developer on the Reserved team at Firefly Events, I contribute to building and maintaining 
            a platform that helps event planners and venue owners connect seamlessly. The platform provides a comprehensive 
            solution for venue discovery, booking management, and payment processing.
          </p>
          <p className="mb-4">
            My role involves developing both frontend and backend components, implementing testing frameworks,
            and creating secure authentication flows. I work with a modern tech stack including React, TypeScript, Next.js,
            Tailwind CSS, MongoDB, and Clerk for authentication.
          </p>
          <p>
            The platform aims to simplify the venue booking process while providing venue owners with tools to
            manage their listings, availability, and booking requests efficiently.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Full-Stack Implementation</h3>
            <p>
              Built complete pages from scratch, handling everything from the frontend UI components
              to the backend API endpoints and database interactions.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Testing Infrastructure</h3>
            <p>
              Implemented a comprehensive testing framework and created end-to-end, integration, and unit tests
              to ensure application reliability and stability.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Secure Backend</h3>
            <p>
              Used Prisma ORM and Clerk authentication to implement fast, secure backend endpoints
              with proper data validation and authorization checks.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Performance Optimization</h3>
            <p>
              Optimized application performance through efficient database queries, component-level
              code splitting, and strategic caching.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
        <div className="paper">
          <div className="flex flex-wrap gap-2">
            <span className="chip chip-primary">React</span>
            <span className="chip chip-primary">TypeScript</span>
            <span className="chip chip-primary">Next.js</span>
            <span className="chip chip-primary">Tailwind CSS</span>
            <span className="chip chip-primary">MongoDB</span>
            <span className="chip chip-primary">Prisma ORM</span>
            <span className="chip chip-primary">Clerk</span>
            <span className="chip chip-primary">Testing Libraries</span>
            <span className="chip chip-primary">CI/CD</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/projects" className="text-primary hover:underline">
          ← Back to All Projects
        </Link>
      </div>
    </div>
  );
}
