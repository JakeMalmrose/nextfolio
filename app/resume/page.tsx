'use client';

import { useState } from 'react';

interface Skill {
  name: string;
  level: 'proficient' | 'intermediate' | 'learning';
}

interface Experience {
  title: string;
  company: string;
  date: string;
  description: string[];
  techStack: string[];
}

export default function Resume() {
  const [skills] = useState<Skill[]>([
    { name: 'JavaScript', level: 'proficient' },
    { name: 'React', level: 'proficient' },
    { name: 'AWS', level: 'proficient' },
    { name: 'Python', level: 'proficient' },
    { name: 'Git', level: 'proficient' },
    { name: 'Golang', level: 'proficient' },
    { name: 'AI Integration', level: 'proficient' },
    { name: 'Docker', level: 'proficient' },
    { name: 'C#', level: 'intermediate' },
    { name: 'C++', level: 'intermediate' },
    { name: 'Linux', level: 'intermediate' },
    { name: 'Vue', level: 'intermediate' },
    { name: 'Java', level: 'intermediate' },
    { name: 'Jira', level: 'intermediate' },
    { name: 'Flutter', level: 'learning' },
    { name: 'Figma', level: 'learning' },
    { name: 'Websockets', level: 'learning' },
  ]);

  const [experiences] = useState<Experience[]>([
    {
      title: "Software Engineer",
      company: "Adobe",
      date: "MAR 2025 – CURRENT",
      description: [
        "Leading the development of an advanced internal tooling system for creating and managing customized Workfront instances for developers and project managers.",
        "Spearheaded the architectural design of a complex microservices-based platform, established CI/CD pipelines, and implemented secure authentication flows.",
        "Built a full-stack solution using React, TypeScript, Vite, and Fastify with Docker and Kubernetes for infrastructure and PostgreSQL for data persistence."
      ],
      techStack: ["React", "TypeScript", "Vite", "Fastify", "Docker", "Kubernetes", "PostgreSQL", "Jest", "Okta"]
    },
    {
      title: "Software Engineer",
      company: "Firefly Events",
      date: "OCT 2024 – MAR 2025",
      description: [
        "Built a comprehensive venue rental platform that streamlines the process of finding and booking venues for events.",
        "Implemented full-stack features using React, TypeScript, and Next.js with Tailwind CSS for the frontend.",
        "Created secure backend endpoints using Prisma ORM and Clerk authentication with proper validation and authorization."
      ],
      techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "MongoDB", "Prisma ORM", "Clerk"]
    },
    {
      title: "Software Engineer",
      company: "NewsBites",
      date: "SEP 2024 – OCT 2024",
      description: [
        "Built an AI Powered News Summarization Website. Integrated AI tool calling, prompt engineering, and AI driven data transformation.",
        "Used state of the art generative AI models to transform data, and streamline UX.",
        "Processed 1000's of news articles, extracted key details with ML. Used prompt engineering and prompt caching to reduce latency below 0.5 seconds."
      ],
      techStack: ["React", "Typescript", "AWS", "Amplify", "Generative AI"]
    },
    {
      title: "Software Developer",
      company: "Vapor",
      date: "APR 2024 – MAY 2024",
      description: [
        "Architected and implemented a scalable game distribution platform using microservices architecture in Go",
        "Featuring user authentication, game management, shopping cart functionality, and admin controls"
      ],
      techStack: ["Golang", "Microservices", "Authentication", "Event-Driven Architecture"]
    }
  ]);

  return (
    <div className="mt-8 mb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">Jake Malmrose</h1>
        <h2 className="text-xl mt-2 opacity-80">Software Engineer | AI Integration Specialist</h2>
        
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <a href="mailto:jake.malmrose@gmail.com" className="hover:text-primary">
            jake.malmrose@gmail.com
          </a>
          <a href="tel:510-325-6879" className="hover:text-primary">
            510-325-6879
          </a>
          <a href="https://github.com/JakeMalmrose" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/jake-malmrose/" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://www.malmrose.com" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
        </div>
      </div>
      
      {/* Objective Section */}
      <div className="paper mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Objective</h2>
        <p>
          Software Engineer focused on developing distributed systems, microservices-based architectures, and monolithic applications. 
          I have expertise in Go, React, Java, and AWS. Experienced in building scalable full-stack applications with both traditional 
          and AI-enhanced functionalities.
        </p>
      </div>
      
      {/* Skills Section */}
      <div className="paper mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Skills</h2>
        
        <div className="mb-6">
          <h3 className="text-lg mb-2">Proficient</h3>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter(skill => skill.level === 'proficient')
              .map(skill => (
                <span key={skill.name} className="chip chip-primary">
                  {skill.name}
                </span>
              ))
            }
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg mb-2">Intermediate</h3>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter(skill => skill.level === 'intermediate')
              .map(skill => (
                <span key={skill.name} className="chip chip-secondary">
                  {skill.name}
                </span>
              ))
            }
          </div>
        </div>
        
        <div>
          <h3 className="text-lg mb-2">Actively Learning</h3>
          <div className="flex flex-wrap gap-2">
            {skills
              .filter(skill => skill.level === 'learning')
              .map(skill => (
                <span key={skill.name} className="chip">
                  {skill.name}
                </span>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Experience Section */}
      <div className="paper mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Industry Experience</h2>
        
        {experiences.map((exp, index) => (
          <div key={exp.company + exp.date} className={index < experiences.length - 1 ? "mb-8" : ""}>
            <div className="flex justify-between flex-wrap mb-1">
              <h3 className="text-lg font-semibold">{exp.company}</h3>
              <span className="text-sm opacity-70">{exp.date}</span>
            </div>
            <p className="font-medium mb-2">{exp.title}</p>
            
            <ul className="list-disc pl-5 mb-3">
              {exp.description.map((item, i) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-2">
              {exp.techStack.map(tech => (
                <span key={tech} className="chip chip-primary text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Education Section */}
      <div className="paper mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary">Education</h2>
        <h3 className="text-lg font-semibold">Neumont College of Computer Science</h3>
        <p className="mb-1">BS in Software Engineering</p>
        <p className="opacity-70">SLC, UT | GPA: 3.9/4.0</p>
      </div>
      
      {/* Achievements Section */}
      <div className="paper">
        <h2 className="text-xl font-bold mb-4 text-primary">Achievements</h2>
        <ul className="list-disc pl-5">
          <li className="mb-2">Neumont Esports League of Legends Team Captain (1.5 years)</li>
          <li>Neumont Achievement Scholarship</li>
        </ul>
      </div>
    </div>
  );
}
