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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <div className="w-full px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/Logo.svg" alt="mateinX" className="h-7 w-7" />
              <span className="text-base font-bold text-terminal-900 tracking-tight">
                mateinX
              </span>
            </a>
            <div className="flex items-center gap-6 text-sm font-medium text-terminal-700">
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
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
