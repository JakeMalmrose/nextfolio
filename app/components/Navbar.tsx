'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
          jake@malmrose.com<span className="text-primary">:~$</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link href="/#work" className="nav-link hidden sm:inline">
            Work
          </Link>
          <Link href="/#projects" className="nav-link hidden sm:inline">
            Projects
          </Link>
          <Link href="/#life" className="nav-link hidden sm:inline">
            Life
          </Link>
          <Link href="/resume" className="nav-link">
            Resume
          </Link>
          <Link href="/#contact" className="nav-link">
            Contact
          </Link>
          <span
            className="pill-disabled hidden md:inline-flex"
            title="OpenWebUI instance, temporarily offline. Coming back soon."
          >
            AI Studio
            <span className="font-mono text-[0.65rem] uppercase tracking-wider">soon</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
