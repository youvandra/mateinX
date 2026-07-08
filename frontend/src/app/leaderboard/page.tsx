'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  user_address: string;
  total_solved: number;
  total_failed: number;
  total_earned: number;
  current_streak: number;
  best_streak: number;
  last_solved_at: string | null;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';
        const res = await fetch(`${base}/v1/leaderboard`);
        const data = await res.json();
        setEntries(data.leaderboard || []);
      } catch {
        console.error('fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="pt-20 max-w-6xl mx-auto px-6 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-bold text-white">Leaderboard</h1>
        <span className="text-xs font-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 px-2 py-0.5 rounded-full">
          $ rankings
        </span>
      </div>
      <p className="text-[#737373] text-sm mb-8 font-mono">// top solvers ranked by puzzles solved and earnings</p>

      <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm text-[#525252] font-mono">loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#525252] font-mono">no data yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-[#737373] bg-[#0d0d0d]">
                <th className="text-left px-4 py-3 font-medium w-10">#</th>
                <th className="text-left px-4 py-3 font-medium">solver</th>
                <th className="text-center px-4 py-3 font-medium">solved</th>
                <th className="text-center px-4 py-3 font-medium">failed</th>
                <th className="text-right px-4 py-3 font-medium">earned</th>
                <th className="text-center px-4 py-3 font-medium">streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {entries.map((entry, i) => (
                <tr key={entry.user_address} className="hover:bg-[#141414] transition-colors">
                  <td className="px-4 py-3 font-bold text-[#525252]">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#a3a3a3]">
                    {entry.user_address.slice(0, 6)}...{entry.user_address.slice(-4)}
                  </td>
                  <td className="px-4 py-3 text-center text-[#34d399]">{entry.total_solved}</td>
                  <td className="px-4 py-3 text-center text-red-400">{entry.total_failed}</td>
                  <td className="px-4 py-3 text-right text-white font-mono">{entry.total_earned.toFixed(2)} USDT</td>
                  <td className="px-4 py-3 text-center text-[#fbbf24]">{entry.current_streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
