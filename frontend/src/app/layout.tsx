import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mateinX :: solve chess puzzles, earn crypto',
  description: 'An Agentic Service Provider (ASP) on OKX.AI. Solve chess puzzles and earn USDT rewards.',
  icons: { icon: '/Logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-terminal-50 text-terminal-800">
        <nav className="border-b border-terminal-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/Logo.svg" alt="mateinX" className="h-6 w-6" />
              <span className="text-sm font-bold text-terminal-800 tracking-tight">
                mateinX
              </span>
            </a>
            <div className="flex gap-5 text-xs font-medium text-terminal-500 uppercase tracking-wider">
              <a href="/dashboard" className="hover:text-terminal-800 transition-colors">Dashboard</a>
              <a href="/leaderboard" className="hover:text-terminal-800 transition-colors">Leaderboard</a>
              <a href="https://okx.ai" target="_blank" rel="noreferrer" className="hover:text-terminal-800 transition-colors">OKX.AI</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
