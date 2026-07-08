'use client';

import { useState } from 'react';
import ChessBoard from './ChessBoard';

interface PuzzleData {
  fen: string;
  difficulty: string;
  reward: number;
  gameId?: string;
}

export default function PuzzleView({ fen, difficulty, reward, gameId: initialGameId }: PuzzleData) {
  const [moves, setMoves] = useState<string[]>([]);
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    correct: boolean;
    reward?: number;
    message: string;
    hint?: string;
    expected_first_moves?: string[];
  } | null>(null);

  const handleMove = async (uci: string) => {
    setMoves(prev => [...prev, uci]);
  };

  const handleSubmit = async () => {
    if (!initialGameId || moves.length === 0) return;
    setSolving(true);

    try {
      const userAddress = localStorage.getItem('mateinx_address') || 'demo_user';
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

      const res = await fetch(`${base}/v1/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: initialGameId,
          solution: moves.join(' '),
          user_address: userAddress,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        status: 'error',
        correct: false,
        message: 'connection failed',
      });
    } finally {
      setSolving(false);
    }
  };

  const statusLine = (() => {
    if (!result) return { label: 'pending', color: 'text-terminal-500' };
    if (result.status === 'illegal') return { label: 'illegal', color: 'text-yellow-400' };
    if (result.correct) return { label: 'solved', color: 'text-green-400' };
    return { label: 'failed', color: 'text-red-400' };
  })();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <ChessBoard fen={fen} onMove={handleMove} />
      </div>

      <div className="space-y-4">
        <div className="terminal-border bg-terminal-900 p-4 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-terminal-400">difficulty:</span>
            <span className="text-terminal-50">{difficulty}</span>
            <span className="text-terminal-600">|</span>
            <span className="text-terminal-400">reward:</span>
            <span className="text-green-400">{reward} USDT</span>
          </div>

          <div className="text-xs">
            <p className="text-terminal-500 mb-1">{`$ cat solution.log`}</p>
            <div className="border border-terminal-700 bg-black p-2 min-h-[60px]">
              {moves.length === 0 ? (
                <span className="text-terminal-600 italic text-[10px]">// make a move on the board...</span>
              ) : (
                <div className="flex flex-wrap gap-0.5">
                  {moves.map((m, i) => (
                    <span key={i} className="text-terminal-300 text-[10px] font-mono">
                      {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''}{m}{' '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!initialGameId || moves.length === 0 || solving}
            className="w-full py-2 terminal-btn-primary text-xs font-mono disabled:opacity-30"
          >
            {solving ? '$ verifying...' : '$ submit_solution'}
          </button>
        </div>

        {result && (
          <div className={`terminal-border bg-terminal-900 p-4 text-xs`}>
            <p className={`font-semibold ${statusLine.color}`}>
              $ status: {statusLine.label}
            </p>
            <p className="text-terminal-400 mt-1 text-[10px]">{result.message}</p>
            {result.correct && result.reward && (
              <p className="text-green-400 text-[10px] mt-1">+{result.reward} USDT</p>
            )}
            {result.hint && (
              <p className="text-yellow-400 text-[10px] mt-1 italic">{`// ${result.hint}`}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
