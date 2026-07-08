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
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-matein-800">Leaderboard</h1>
      <p className="text-matein-600">Top solvers ranked by puzzles solved and total earnings.</p>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-matein-200">
        {loading ? (
          <p className="p-6 text-center text-matein-400">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="p-6 text-center text-matein-400">No solvers yet. Be the first!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-matein-50 text-matein-600">
              <tr>
                <th className="text-left p-3 font-medium w-12">Rank</th>
                <th className="text-left p-3 font-medium">Solver</th>
                <th className="text-center p-3 font-medium">Solved</th>
                <th className="text-center p-3 font-medium">Failed</th>
                <th className="text-right p-3 font-medium">Earned</th>
                <th className="text-center p-3 font-medium">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-matein-100">
              {entries.map((entry, i) => (
                <tr key={entry.user_address} className="hover:bg-matein-50">
                  <td className="p-3 font-bold">{getMedal(i + 1)}</td>
                  <td className="p-3 font-mono text-xs">
                    {entry.user_address.slice(0, 6)}...{entry.user_address.slice(-4)}
                  </td>
                  <td className="p-3 text-center font-medium text-green-600">{entry.total_solved}</td>
                  <td className="p-3 text-center text-red-500">{entry.total_failed}</td>
                  <td className="p-3 text-right font-semibold text-matein-700">
                    {entry.total_earned.toFixed(2)} USDT
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                      🔥 {entry.current_streak}
                    </span>
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
