import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mateinX :: solve chess puzzles, earn crypto',
  description: 'An Agentic Service Provider (ASP) on OKX.AI. Solve chess puzzles and earn USDT rewards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-terminal-100">
        <nav className="border-b border-terminal-700 bg-terminal-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
            <a href="/" className="text-base font-bold text-terminal-50 tracking-tight">
              $ mateinX <span className="text-terminal-500 font-normal">v1.0</span>
            </a>
            <div className="flex gap-5 text-xs font-medium text-terminal-400 uppercase tracking-wider">
              <a href="/dashboard" className="hover:text-terminal-50 transition-colors">Dashboard</a>
              <a href="/leaderboard" className="hover:text-terminal-50 transition-colors">Leaderboard</a>
              <a href="https://okx.ai" target="_blank" rel="noreferrer" className="hover:text-terminal-50 transition-colors">OKX.AI</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <div className="fixed bottom-0 left-0 right-0 border-t border-terminal-700 bg-terminal-900/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-1.5 text-[10px] text-terminal-500">
            <span className="text-terminal-400">$</span> mateinX connected <span className="text-terminal-600">|</span> puzzles: 100k+ <span className="text-terminal-600">|</span> status: operational
          </div>
        </div>
      </body>
    </html>
  );
}
