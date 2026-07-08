'use client';

import { useState, useEffect } from 'react';
import PuzzleView from '@/components/PuzzleView';

type Difficulty = 'easy' | 'medium' | 'hard' | 'grandmaster';

export default function Home() {
  const [address, setAddress] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [puzzle, setPuzzle] = useState<{
    fen: string;
    difficulty: string;
    reward: number;
    gameId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mateinx_address');
    if (saved) setAddress(saved);
  }, []);

  const saveAddress = (val: string) => {
    setAddress(val);
    localStorage.setItem('mateinx_address', val);
  };

  const handleGetPuzzle = async () => {
    if (!address) {
      setError('Enter your XLayer wallet address first');
      return;
    }
    setLoading(true);
    setError('');
    setPuzzle(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006'}/v1/puzzle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, user_address: address }),
      });

      if (res.status === 402) {
        const body = await res.json();
        const preview = body.puzzle_preview;

        const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006'}/v1/puzzle/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            puzzle_id: preview.puzzle_id,
            user_address: address,
            payment_tx: `demo_tx_${Date.now()}`,
          }),
        });

        const confirmData = await confirmRes.json();
        setPuzzle({
          fen: confirmData.fen,
          difficulty: confirmData.difficulty,
          reward: confirmData.reward,
          gameId: confirmData.game_id,
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to get puzzle');
      }
    } catch (err) {
      setError('Could not connect to MateinX API');
    } finally {
      setLoading(false);
    }
  };

  const difficulties: { key: Difficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'Easy', desc: '800-1200' },
    { key: 'medium', label: 'Medium', desc: '1200-1700' },
    { key: 'hard', label: 'Hard', desc: '1700-2200' },
    { key: 'grandmaster', label: 'Grandmaster', desc: '2200+' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-matein-800">Solve Chess Puzzles, Earn Crypto</h1>
        <p className="text-matein-600">
          MateinX is an Agentic Service Provider on OKX.AI. Pick a difficulty, solve the puzzle, and earn USDT rewards.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-matein-200 max-w-xl mx-auto space-y-4">
        <div>
          <label className="text-sm font-medium text-matein-600 block mb-1">Your XLayer Wallet Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => saveAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-matein-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-matein-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-matein-600 block mb-2">Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {difficulties.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  difficulty === d.key
                    ? 'bg-matein-600 text-white border-matein-600'
                    : 'bg-white text-matein-600 border-matein-200 hover:bg-matein-50'
                }`}
              >
                {d.label}
                <span className="block text-xs opacity-70">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetPuzzle}
          disabled={loading}
          className="w-full py-3 bg-matein-600 text-white rounded-xl font-semibold hover:bg-matein-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating Puzzle...' : 'Get Puzzle'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {puzzle && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-matein-700 mb-4">Your Puzzle</h2>
          <PuzzleView
            fen={puzzle.fen}
            difficulty={puzzle.difficulty}
            reward={puzzle.reward}
            gameId={puzzle.gameId}
          />
        </div>
      )}
    </div>
  );
}
