'use client';

import { useEffect, useState, useRef } from 'react';

export default function InitialLoader() {
  const [ready, setReady] = useState(false);
  const minTime = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/Hero.png';

    let done = false;
    const checkReady = () => {
      if (done) return;
      done = true;
      if (minTime.current) {
        setReady(true);
      }
    };

    img.onload = checkReady;
    img.onerror = checkReady;

    setTimeout(() => {
      minTime.current = true;
      if (done) setReady(true);
    }, 600);

    return () => { done = true; };
  }, []);

  if (ready) return null;

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
