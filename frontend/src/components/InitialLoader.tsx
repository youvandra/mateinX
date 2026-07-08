'use client';

import { useEffect, useState } from 'react';

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-terminal-50 transition-opacity duration-500">
      <div className="flex flex-col items-center gap-5">
        <img src="/Logo.svg" alt="mateinX" className="h-10 w-10 animate-pulse" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-terminal-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-terminal-400">loading mateinX...</span>
      </div>
    </div>
  );
}
