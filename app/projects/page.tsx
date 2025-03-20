'use client';

import { useState } from 'react';

interface Project {
  title: string;
  date: string;
  description: string[];
  techStack: string[];
  links?: {
    demo?: string;
    github?: string;
  };
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="paper h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <span className="text-sm opacity-70">{project.date}</span>
      </div>
      
      <div className="mb-4 flex-grow">
        {project.description.map((point, index) => (
          <p key={index} className="mb-2">
            {point}
          </p>
        ))}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span key={tech} className="chip chip-primary">
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 mt-auto">
        {project.links?.demo && (
          <a 
            href={project.links.demo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Live Demo
          </a>
        )}
        {project.links?.github && (
          <a 
            href={project.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Source Code
          </a>
        )}
      </div>
    </div>
  );
};

export default function Projects() {
  const [projects] = useState<Project[]>([
    {
      title: "Firefly Events",
      date: "JAN 2025 – CURRENT",
      description: [
        "Helped build a full stack venue rental platform with the Reserved team.",
        "Implemented testing framework and created E2E, integration, and unit tests.",
        "Used Prisma ORM and Clerk to implement fast secure backend endpoints.",
        "Built pages from scratch including frontend through backend implementation."
      ],
      techStack: ["React", "Typescript", "Next.js", "Tailwind", "MongoDB", "Clerk"],
      links: {
        demo: "https://reserved.firefly.events/"
      }
    },
    {
      title: "NewsBites",
      date: "SEP 2024 – DEC 2024",
      description: [
        "Built an AI Powered News Summarization Website. Integrated AI tool calling, prompt engineering, and AI driven data transformation.",
        "Used state of the art generative AI models to transform data, and streamline UX.",
        "Processed 1000's of news articles, extracted key details with ML. Used prompt engineering and prompt caching to reduce latency below 0.3 seconds."
      ],
      techStack: ["React", "Typescript", "AWS", "Amplify", "Generative AI"],
      links: {
        demo: "https://news.malmrose.com/",
        github: "https://github.com/JakeMalmrose/Capstone"
      }
    },
    {
      title: "Vapor",
      date: "APR 2024 – MAY 2024",
      description: [
        "Architected and implemented a scalable game distribution platform using microservices architecture in Go",
        "Featuring user authentication, game management, shopping cart functionality, and admin controls"
      ],
      techStack: ["Golang", "Microservices", "Authentication", "Event-Driven Architecture"],
      links: {
        github: "https://github.com/JakeMalmrose/groupProjPro290"
      }
    },
  ]);

  return (
    <div className="mt-8 mb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
        My Projects
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
