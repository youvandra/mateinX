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
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-terminal-50">$ LEADERBOARD</h1>
      <p className="text-terminal-500 text-xs font-mono">{`// top solvers ranked by puzzles solved and earnings`}</p>

      <div className="border border-terminal-700">
        {loading ? (
          <p className="p-4 text-terminal-500 text-xs font-mono">$ loading...</p>
        ) : entries.length === 0 ? (
          <p className="p-4 text-terminal-500 text-xs font-mono">$ no data yet</p>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-terminal-700 text-terminal-500">
                <th className="text-left p-3 font-medium w-10">#</th>
                <th className="text-left p-3 font-medium">solver</th>
                <th className="text-center p-3 font-medium">solved</th>
                <th className="text-center p-3 font-medium">failed</th>
                <th className="text-right p-3 font-medium">earned</th>
                <th className="text-center p-3 font-medium">streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-800">
              {entries.map((entry, i) => (
                <tr key={entry.user_address} className="hover:bg-terminal-800 transition-colors">
                  <td className="p-3 font-bold text-terminal-400">{i + 1}</td>
                  <td className="p-3 text-terminal-300 text-[10px]">
                    {entry.user_address.slice(0, 6)}...{entry.user_address.slice(-4)}
                  </td>
                  <td className="p-3 text-center text-green-400">{entry.total_solved}</td>
                  <td className="p-3 text-center text-red-400">{entry.total_failed}</td>
                  <td className="p-3 text-right text-terminal-50 font-medium">{entry.total_earned.toFixed(2)} USDT</td>
                  <td className="p-3 text-center">
                    <span className="text-yellow-400 text-[10px]">{entry.current_streak}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
