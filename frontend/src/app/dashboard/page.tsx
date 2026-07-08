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
  fen: string | null;
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
    } catch {
      console.error('fetch failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchData();
  }, [address]);

  const statusColors: Record<string, string> = {
    active: 'border-blue-500 text-blue-400',
    solved: 'border-green-500 text-green-400',
    failed: 'border-red-500 text-red-400',
    pending: 'border-terminal-500 text-terminal-400',
    illegal: 'border-yellow-500 text-yellow-400',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-terminal-50">$ DASHBOARD</h1>

      <div className="max-w-md">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full terminal-input font-mono text-xs"
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="solved" value={stats.total_solved} />
          <StatCard label="failed" value={stats.total_failed} />
          <StatCard label="earned" value={`${stats.total_earned.toFixed(2)} USDT`} />
          <StatCard label="streak" value={stats.current_streak} />
          <StatCard label="best" value={stats.best_streak} />
        </div>
      )}

      <div className="border border-terminal-700">
        <p className="text-xs text-terminal-500 border-b border-terminal-700 p-3 font-mono">
          {`// game history (${games.length})`}
        </p>
        {loading ? (
          <p className="p-4 text-terminal-500 text-xs font-mono">$ loading...</p>
        ) : games.length === 0 ? (
          <p className="p-4 text-terminal-500 text-xs font-mono">$ no games found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-terminal-700 text-terminal-500">
                  <th className="text-left p-3 font-medium">puzzle</th>
                  <th className="text-left p-3 font-medium">status</th>
                  <th className="text-right p-3 font-medium">reward</th>
                  <th className="text-right p-3 font-medium">date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terminal-800">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-terminal-800 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/games/${game.id}`}
                  >
                    <td className="p-3 text-terminal-400 text-[10px]">{game.puzzle_id.slice(0, 10)}</td>
                    <td className="p-3">
                      <span className={`inline-block px-1.5 py-0.5 text-[10px] border ${statusColors[game.status] || 'border-terminal-500 text-terminal-400'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-terminal-300">{game.reward.toFixed(2)} USDT</td>
                    <td className="p-3 text-right text-terminal-500 text-[10px]">{new Date(game.created_at).toLocaleDateString()}</td>
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-terminal-700 bg-terminal-900 p-3">
      <p className="text-[10px] text-terminal-500 uppercase tracking-wider font-mono">{label}</p>
      <p className="text-base font-bold text-terminal-50 mt-1 font-mono">{value}</p>
    </div>
  );
}
