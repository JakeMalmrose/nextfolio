'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-primary border-b-2 border-primary' : '';
  };

  return (
    <nav className="bg-background-paper py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold nav-link">
          Jake Malmrose
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/adobe" className={`nav-link ${isActive('/adobe')}`}>
            Adobe
          </Link>
          <Link href="/projects" className={`nav-link ${isActive('/projects')}`}>
            Projects
          </Link>
          <Link href="/resume" className={`nav-link ${isActive('/resume')}`}>
            Resume
          </Link>
          <Link href="/newsbites" className={`nav-link ${isActive('/newsbites')}`}>
            NewsBites
          </Link>
          <a 
            href="https://llm.malmrose.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1 rounded-md bg-primary text-black font-medium hover:bg-opacity-90 transition-colors"
          >
            AI Studio
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
