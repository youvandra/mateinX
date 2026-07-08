'use client';

import { useEffect, useState } from 'react';

interface TerminalLoaderProps {
  text?: string;
  className?: string;
}

export default function TerminalLoader({ text = 'loading', className = '' }: TerminalLoaderProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 font-mono text-sm text-terminal-400 ${className}`}>
      <span className="animate-pulse">$</span>
      <span>{text}</span>
      <span className="w-6">{dots}</span>
    </div>
  );
}
