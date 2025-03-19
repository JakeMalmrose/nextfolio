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

        <div className="flex gap-6">
          <Link href="/newsbites" className={`nav-link ${isActive('/newsbites')}`}>
            NewsBites
          </Link>
          <Link href="/projects" className={`nav-link ${isActive('/projects')}`}>
            Projects
          </Link>
          <Link href="/resume" className={`nav-link ${isActive('/resume')}`}>
            Resume
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
