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
    active: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    solved: 'text-green-400 border-green-500/30 bg-green-500/10',
    failed: 'text-red-400 border-red-500/30 bg-red-500/10',
    pending: 'text-[#737373] border-[#262626] bg-[#1a1a1a]',
  };

  const statCards = stats
    ? [
        { label: 'Solved', value: stats.total_solved },
        { label: 'Failed', value: stats.total_failed },
        { label: 'Earned', value: `${stats.total_earned.toFixed(2)} USDT` },
        { label: 'Streak', value: stats.current_streak },
        { label: 'Best', value: stats.best_streak },
      ]
    : [];

  return (
    <div className="pt-20 max-w-6xl mx-auto px-6 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <span className="text-xs font-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 px-2 py-0.5 rounded-full">
          $ status
        </span>
      </div>

      <div className="max-w-md mb-8">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x... (wallet address)"
          className="w-full px-3 py-2 text-sm bg-[#141414] border border-[#262626] rounded-lg text-[#e5e5e5] placeholder-[#525252] focus:outline-none focus:border-[#34d399]/50 font-mono"
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="border border-[#1a1a1a] bg-[#0d0d0d] rounded-lg p-4">
              <div className="text-xs text-[#737373] font-mono">{s.label}</div>
              <div className="text-lg font-bold text-white mt-1">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="text-xs text-[#737373] font-mono border-b border-[#1a1a1a] px-4 py-3 bg-[#0d0d0d]">
          // game history ({games.length})
        </div>
        {loading ? (
          <div className="p-6 text-center text-sm text-[#525252] font-mono">loading...</div>
        ) : games.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#525252] font-mono">no games found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#737373]">
                  <th className="text-left px-4 py-3 font-medium">puzzle</th>
                  <th className="text-left px-4 py-3 font-medium">status</th>
                  <th className="text-right px-4 py-3 font-medium">reward</th>
                  <th className="text-right px-4 py-3 font-medium">date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-[#141414] cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/games/${game.id}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#737373]">{game.puzzle_id.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-mono border rounded ${statusColors[game.status] || 'text-[#737373] border-[#262626] bg-[#1a1a1a]'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">{game.reward.toFixed(2)} USDT</td>
                    <td className="px-4 py-3 text-right text-[#525252] text-xs font-mono">{new Date(game.created_at).toLocaleDateString()}</td>
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
