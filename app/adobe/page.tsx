'use client';

import Link from 'next/link';

export default function Adobe() {
  return (
    <div className="mt-8 mb-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
          Adobe | Workfront
        </h1>
        <p className="max-w-2xl mx-auto">
          Developing a tool that enables developers, project managers, and stakeholders to create and manage customized Workfront instances efficiently and securely.uh
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="https://business.adobe.com/products/workfront.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:opacity-90 transition"
          >
            Workfront
          </a>
          <a
            href="https://www.adobe.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:bg-opacity-10 transition"
          >
            Adobe
          </a>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Role Overview</h2>
        <div className="paper">
          <p className="mb-4">
            As a Software Engineer on the Adobe Workfront team, I'm developing an internal tooling system that revolutionizes how teams create and manage their Workfront instances.
            This platform streamlines development workflows by enabling technical and non-technical users to deploy, configure, and maintain customized Workfront environments.
          </p>
          <p className="mb-4">
            I've architected a comprehensive solution using a modern tech stack including Vite, TypeScript, React, and Fastify, with infrastructure powered by Docker and Kubernetes.
            The system integrates seamlessly with Okta for secure authentication and uses PostgreSQL for robust data persistence.
          </p>
          <p>
            Workfront, as a subsidiary of Adobe, provides essential work management solutions both internally and to enterprise clients.
            My contributions directly enhance Adobe's ability to efficiently develop, test, and deploy customized Workfront configurations, resulting in improved development velocity and product quality.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">System Architecture Design</h3>
            <p>
              Spearheaded the architectural design of a complex microservices-based platform that enables rapid deployment and management of Workfront instances.
              Created a scalable and maintainable foundation that supports both current requirements and future expansion.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Full-Stack Development</h3>
            <p>
              Implemented an intuitive React-based frontend with TypeScript for type safety, paired with a high-performance Fastify backend.
              Designed and implemented efficient database schemas and REST APIs to support core functionality.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Infrastructure Automation</h3>
            <p>
              Established robust Dockerization and Kubernetes deployment strategies to ensure consistent and reliable application delivery.
              Implemented automated testing using Jest to ensure code quality and prevent regressions.
            </p>
          </div>
          <div className="paper">
            <h3 className="text-lg font-semibold mb-2 text-primary">Security Integration</h3>
            <p>
              Implemented secure authentication and authorization flows using Okta, ensuring that only authorized personnel can access sensitive Workfront configuration options.
              Established secure database access patterns and proper credential management.
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
            <span className="chip chip-primary">Vite</span>
            <span className="chip chip-primary">Fastify</span>
            <span className="chip chip-primary">Docker</span>
            <span className="chip chip-primary">Kubernetes</span>
            <span className="chip chip-primary">PostgreSQL</span>
            <span className="chip chip-primary">Jest</span>
            <span className="chip chip-primary">Okta</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/resume" className="text-primary hover:underline">
          ← Back to Resume
        </Link>
      </div>
    </div>
  );
}
