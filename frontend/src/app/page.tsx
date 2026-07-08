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

  const difficulties: { key: Difficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'easy', desc: '800-1200' },
    { key: 'medium', label: 'medium', desc: '1200-1700' },
    { key: 'hard', label: 'hard', desc: '1700-2200' },
    { key: 'grandmaster', label: 'gm', desc: '2200+' },
  ];

  const handleGetPuzzle = async () => {
    if (!address) {
      setError('wallet address required');
      return;
    }
    setLoading(true);
    setError('');
    setPuzzle(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';
      const res = await fetch(`${base}/v1/puzzle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, user_address: address }),
      });

      if (res.status === 402) {
        const body = await res.json();
        const preview = body.puzzle_preview;

        const confirmRes = await fetch(`${base}/v1/puzzle/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            puzzle_id: preview.puzzle_id,
            user_address: address,
            payment_tx: `demo_${Date.now()}`,
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
        setError(data.message || 'failed to get puzzle');
      }
    } catch {
      setError('connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center border border-terminal-700 bg-terminal-900 p-8">
        <p className="text-xs text-terminal-500 mb-1">$ cat README.md</p>
        <h1 className="text-2xl font-bold text-terminal-50">Solve Chess Puzzles</h1>
        <p className="text-terminal-400 text-xs mt-2">
          generate puzzle → solve → earn USDT rewards
        </p>
        <p className="text-terminal-500 text-[10px] mt-4">
          {`// an Agentic Service Provider (ASP) on OKX.AI`}
        </p>
      </div>

      <div className="border border-terminal-700 bg-terminal-900 max-w-xl mx-auto p-6 space-y-4">
        <div>
          <label className="text-xs text-terminal-400 block mb-1">$ wallet_address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => saveAddress(e.target.value)}
            placeholder="0x..."
            className="w-full terminal-input font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs text-terminal-400 block mb-1">$ difficulty</label>
          <div className="grid grid-cols-4 gap-1">
            {difficulties.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`px-2 py-1.5 text-xs font-mono border ${
                  difficulty === d.key
                    ? 'bg-terminal-100 text-terminal-900 border-terminal-100'
                    : 'bg-terminal-900 text-terminal-400 border-terminal-700 hover:bg-terminal-800 hover:text-terminal-200'
                } transition-colors`}
              >
                {d.label}
                <span className="block text-[9px] opacity-60">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetPuzzle}
          disabled={loading}
          className="w-full py-2.5 terminal-btn-primary font-mono text-xs"
        >
          {loading ? '$ generating...' : '$ generate_puzzle --difficulty ' + difficulty}
        </button>

        {error && <p className="text-red-400 text-[10px]">{`// error: ${error}`}</p>}
      </div>

      {puzzle && (
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-terminal-500 mb-4">{`// puzzle received, solving...`}</p>
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
