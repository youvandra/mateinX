'use client';

import { useState, useEffect } from 'react';

interface Game {
  id: string;
  puzzle_id: string;
  user_address: string;
  status: string;
  entry_fee: number;
  reward: number;
  payment_tx: string | null;
  reward_tx: string | null;
  solution: string | null;
  created_at: string;
  solved_at: string | null;
}

interface Stats {
  user_address: string;
  total_solved: number;
  total_failed: number;
  total_earned: number;
  current_streak: number;
  best_streak: number;
  last_solved_at: string | null;
}

export default function Dashboard() {
  const [address, setAddress] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mateinx_address');
    if (saved) setAddress(saved);
  }, []);

  const fetchData = async () => {
    if (!address) return;
    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';
      const [gamesRes, statsRes] = await Promise.all([
        fetch(`${base}/v1/games/${address}`),
        fetch(`${base}/v1/stats/${address}`),
      ]);
      const gamesData = await gamesRes.json();
      const statsData = await statsRes.json();
      setGames(gamesData.games || []);
      setStats(statsData.stats || null);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchData();
  }, [address]);

  const statusColors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800',
    solved: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-matein-800">Dashboard</h1>

      <div className="max-w-md">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x... (XLayer wallet address)"
          className="w-full px-3 py-2 border border-matein-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-matein-400"
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Solved" value={stats.total_solved} color="green" />
          <StatCard label="Failed" value={stats.total_failed} color="red" />
          <StatCard label="Total Earned" value={`${stats.total_earned.toFixed(2)} USDT`} color="blue" />
          <StatCard label="Current Streak" value={stats.current_streak} color="amber" />
          <StatCard label="Best Streak" value={stats.best_streak} color="purple" />
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-matein-200">
        <h2 className="text-lg font-semibold text-matein-700 p-4 border-b border-matein-200">Game History</h2>
        {loading ? (
          <p className="p-4 text-matein-400">Loading...</p>
        ) : games.length === 0 ? (
          <p className="p-4 text-matein-400">No games yet. Solve a puzzle to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-matein-50 text-matein-600">
                <tr>
                  <th className="text-left p-3 font-medium">Puzzle</th>
                  <th className="text-left p-3 font-medium">Difficulty</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Reward</th>
                  <th className="text-left p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matein-100">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-matein-50">
                    <td className="p-3 font-mono text-xs">{game.puzzle_id.slice(0, 12)}...</td>
                    <td className="p-3 capitalize">{game.puzzle_id.includes('easy') ? 'Easy' : game.puzzle_id.includes('medium') ? 'Medium' : game.puzzle_id.includes('hard') ? 'Hard' : 'Grandmaster'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[game.status] || 'bg-gray-100 text-gray-800'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{game.reward.toFixed(2)} USDT</td>
                    <td className="p-3 text-matein-500 text-xs">{new Date(game.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
