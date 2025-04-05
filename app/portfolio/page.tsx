'use client';

import Link from 'next/link';

export default function Portfolio() {
  return (
    <div className="mt-8 mb-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Portfolio Website
        </h1>
        <p className="max-w-2xl mx-auto">
          A modern, responsive portfolio website built with Next.js 15, React 19, and TailwindCSS 4, 
          showcasing my projects, experience, and technical skills.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="https://malmrose.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:opacity-90 transition"
          >
            Live Website
          </a>
          <a
            href="https://github.com/JakeMalmrose/nextfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:bg-opacity-10 transition"
          >
            GitHub Repo
          </a>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <div className="paper">
          <p className="mb-4">
            This portfolio website serves as a showcase for my projects, skills, and professional experience. 
            Built with the latest versions of Next.js and React, it demonstrates my ability to work with modern 
            web technologies while maintaining an accessible, responsive, and visually appealing design.
          </p>
          <p className="mb-4">
            I chose to implement the site using the App Router pattern introduced in Next.js 13+, which 
            offers improved routing capabilities, server components, and optimized performance. The dark-themed 
            design provides a clean, professional look while highlighting important content.
          </p>
          <p>
            The site is deployed using Docker and Caddy for automatic HTTPS, with CI/CD handled by GitHub Actions 
            for seamless updates whenever changes are pushed to the repository.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Modern Tech Stack</h3>
            <p>
              Built with Next.js 15, React 19, and TailwindCSS 4, leveraging the latest features and optimizations 
              these frameworks offer, including improved performance and developer experience.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Responsive Design</h3>
            <p>
              Optimized for viewing on devices of all sizes, from mobile phones to large desktop monitors, 
              ensuring a consistent and accessible experience for all visitors.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Docker Deployment</h3>
            <p>
              Containerized for consistent deployment across environments, using Docker and Caddy for 
              automatic HTTPS certification and secure hosting.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">CI/CD Pipeline</h3>
            <p>
              Automated deployment process using GitHub Actions, allowing for seamless updates and ensuring 
              the live site always reflects the latest code changes.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
        <div className="paper">
          <div className="flex flex-wrap gap-2">
            <span className="chip chip-primary">Next.js 15</span>
            <span className="chip chip-primary">React 19</span>
            <span className="chip chip-primary">TypeScript</span>
            <span className="chip chip-primary">TailwindCSS 4</span>
            <span className="chip chip-primary">Docker</span>
            <span className="chip chip-primary">Caddy</span>
            <span className="chip chip-primary">GitHub Actions</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
        <div className="paper">
          <p className="mb-4">
            The portfolio is structured around the Next.js App Router pattern, with dedicated pages for each 
            project and section. Components are organized for maximum reusability, with a focus on maintaining 
            a consistent look and feel throughout the site.
          </p>
          <p className="mb-4">
            The dark theme is implemented using CSS variables and TailwindCSS custom colors, allowing for easy 
            maintenance and potential future expansion to include a light theme toggle. Typography leverages 
            Google's Geist Sans and Geist Mono fonts for optimal readability.
          </p>
          <p>
            The deployment architecture uses Docker containers orchestrated with Docker Compose, with Caddy 
            serving as a reverse proxy that handles automatic HTTPS certification through Let's Encrypt. 
            This setup ensures high availability and security with minimal maintenance overhead.
          </p>
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
