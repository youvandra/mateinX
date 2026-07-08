'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-50">
      <TerminalSpinner />
    </div>
  );
}

function TerminalSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 font-mono text-sm text-terminal-400">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-terminal-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-terminal-400">loading mateinX...</span>
    </div>
  );
}
