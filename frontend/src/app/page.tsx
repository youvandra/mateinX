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
    <div className="space-y-10">
      {/* Hero */}
      <div
        className="relative border border-terminal-200 overflow-hidden min-h-[320px] flex items-center"
        style={{
          backgroundImage: 'url(/Hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 px-8 py-12 max-w-2xl">
          <img src="/logo.png" alt="" className="h-8 w-8 mb-4" />
          <h1 className="text-3xl font-bold text-terminal-900 leading-tight">
            Solve Chess Puzzles,
            <br />
            Earn Crypto Rewards
          </h1>
          <p className="text-terminal-700 text-sm mt-3 max-w-lg leading-relaxed">
            An Agentic Service Provider on OKX.AI. Generate a chess puzzle at your
            chosen difficulty, find the winning sequence, and earn USDT when you
            solve it — all handled automatically through the OKX Agent Payments Protocol.
          </p>
          <div className="flex gap-3 mt-5 text-xs font-mono">
            <span className="border border-terminal-300 px-2 py-1 text-terminal-600">
              100k+ puzzles
            </span>
            <span className="border border-terminal-300 px-2 py-1 text-terminal-600">
              x402 payments
            </span>
            <span className="border border-terminal-300 px-2 py-1 text-terminal-600">
              instant rewards
            </span>
          </div>
        </div>
      </div>

      {/* Puzzle Generator */}
      <div className="border border-terminal-200 bg-white max-w-xl mx-auto p-6 space-y-4">
        <p className="text-xs font-mono text-terminal-400">{'// start solving'}</p>

        <div>
          <label className="text-xs text-terminal-600 block mb-1">$ wallet_address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => saveAddress(e.target.value)}
            placeholder="0x..."
            className="w-full terminal-input font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs text-terminal-600 block mb-1">$ difficulty</label>
          <div className="grid grid-cols-4 gap-1">
            {difficulties.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`px-2 py-1.5 text-xs font-mono border transition-colors ${
                  difficulty === d.key
                    ? 'bg-terminal-800 text-white border-terminal-800'
                    : 'bg-white text-terminal-600 border-terminal-200 hover:bg-terminal-100'
                }`}
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

        {error && <p className="text-red-500 text-[10px]">{`// error: ${error}`}</p>}
      </div>

      {puzzle && (
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-terminal-400 mb-4">{'// puzzle received, solving...'}</p>
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
