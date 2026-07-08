import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MateinX - Solve Chess Puzzles, Earn Crypto',
  description: 'An Agentic Service Provider (ASP) on OKX.AI. Solve chess puzzles and earn USDT rewards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-matein-50 text-matein-950">
        <nav className="border-b border-matein-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-matein-700 tracking-tight">
              ♟ MateinX
            </a>
            <div className="flex gap-6 text-sm font-medium text-matein-600">
              <a href="/dashboard" className="hover:text-matein-800 transition-colors">Dashboard</a>
              <a href="/leaderboard" className="hover:text-matein-800 transition-colors">Leaderboard</a>
              <a href="https://www.okx.ai" target="_blank" rel="noreferrer" className="hover:text-matein-800 transition-colors">
                OKX.AI
              </a>
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
