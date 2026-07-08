'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-terminal-200'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/Logo.svg" alt="mateinX" className="h-7 w-7" />
          <span className={`text-base font-bold tracking-tight ${scrolled ? 'text-terminal-800' : 'text-terminal-900'}`}>
            mateinX
          </span>
        </a>
        <div className={`flex items-center gap-6 text-sm font-medium ${scrolled ? 'text-terminal-500' : 'text-terminal-700'}`}>
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
