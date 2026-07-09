'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-md border-b border-terminal-200'
      }`}
    >
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/Logo.svg" alt="mateinX" className="h-7 w-7" />
          <span className={`text-base font-bold tracking-tight ${transparent ? 'text-terminal-900' : 'text-terminal-800'}`}>
            mateinX
          </span>
        </a>

        {/* Desktop nav */}
        <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${transparent ? 'text-terminal-700' : 'text-terminal-500'}`}>
          <a href="/dashboard" className="hover:text-terminal-900 transition-colors">Dashboard</a>
          <a href="/leaderboard" className="hover:text-terminal-900 transition-colors">Leaderboard</a>
          <a
            href="https://okx.ai/agents"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-terminal-800 hover:bg-terminal-700 transition-colors border border-terminal-800"
          >
            Try on OKX.AI
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[2px] transition-all duration-300 ${transparent ? 'bg-terminal-900' : 'bg-terminal-600'}`}
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(4px)' : '' }} />
          <span className={`block w-5 h-[2px] transition-all duration-300 ${transparent ? 'bg-terminal-900' : 'bg-terminal-600'}`}
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className={`block w-5 h-[2px] transition-all duration-300 ${transparent ? 'bg-terminal-900' : 'bg-terminal-600'}`}
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="px-4 pb-4 flex flex-col gap-2 bg-white border-b border-terminal-200">
          <a href="/dashboard" className="px-3 py-2.5 text-sm font-medium text-terminal-700 hover:bg-terminal-50 rounded transition-colors">
            Dashboard
          </a>
          <a href="/leaderboard" className="px-3 py-2.5 text-sm font-medium text-terminal-700 hover:bg-terminal-50 rounded transition-colors">
            Leaderboard
          </a>
          <a
            href="https://okx.ai/agents"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2.5 text-sm font-medium text-white bg-terminal-800 hover:bg-terminal-700 rounded transition-colors text-center"
          >
            Try on OKX.AI
          </a>
        </div>
      </div>
    </nav>
  );
}
