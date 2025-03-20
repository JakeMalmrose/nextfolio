import Link from 'next/link';

export default function Home() {
  return (
    <div className="mt-16 flex flex-col items-center gap-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center gradient-text">
        Jake Malmrose's Portfolio
      </h1>
      
      <h2 className="text-xl md:text-2xl text-center text-opacity-80 mb-8">
        Full Stack Developer | Software Engineer | AI Integration Specialist
      </h2>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link 
          href="/firefly-events"
          className="px-6 py-3 bg-primary text-background font-medium rounded-md hover:opacity-90 transition"
        >
          View Firefly Events
        </Link>
        
        <Link 
          href="/projects"
          className="px-6 py-3 border border-secondary text-secondary font-medium rounded-md hover:bg-secondary hover:bg-opacity-10 transition"
        >
          See My Projects
        </Link>
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <p className="text-lg mb-4">
          Welcome to my portfolio website. I'm a software engineer focused on building modern web applications, 
          distributed systems, and AI-powered solutions.
        </p>
        <p className="text-lg">
          Explore my projects to see examples of my work, or check out my resume to learn more about my 
          skills and experience.
        </p>
      </div>
    </div>
  );
}
