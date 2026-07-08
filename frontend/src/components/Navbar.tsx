'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-md border-b border-terminal-200'
      }`}
    >
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/Logo.svg" alt="mateinX" className="h-7 w-7" />
          <span className={`text-base font-bold tracking-tight ${transparent ? 'text-terminal-900' : 'text-terminal-800'}`}>
            mateinX
          </span>
        </a>
        <div className={`flex items-center gap-6 text-sm font-medium ${transparent ? 'text-terminal-700' : 'text-terminal-500'}`}>
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
      </div>
    </nav>
  );
}
