import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import InitialLoader from '@/components/InitialLoader';

export const metadata: Metadata = {
  title: 'mateinX :: solve chess puzzles, earn crypto',
  description: 'An Agentic Service Provider (ASP) on OKX.AI. Solve chess puzzles and earn USDT rewards.',
  icons: { icon: '/Logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-terminal-50 text-terminal-800">
        <InitialLoader />
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
