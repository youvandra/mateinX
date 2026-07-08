import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mateinX — solve chess puzzles, earn crypto',
  description: 'An Agentic Service Provider (ASP) on OKX.AI. Solve chess puzzles and earn USDT rewards.',
  icons: { icon: '/Logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/Logo.svg" alt="mateinX" className="h-7 w-7" />
              <span className="text-sm font-semibold text-white">
                mateinX
              </span>
            </a>
            <div className="flex items-center gap-6 text-sm text-[#a3a3a3]">
              <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
              <a href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
              <a
                href="https://okx.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#34d399]/10 border border-[#34d399]/20 hover:bg-[#34d399]/20 transition-colors rounded-md"
              >
                OKX.AI
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
