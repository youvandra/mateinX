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
    if (!result) return { label: 'pending', color: 'text-terminal-400' };
    if (result.status === 'illegal') return { label: 'illegal', color: 'text-yellow-600' };
    if (result.correct) return { label: 'solved', color: 'text-green-600' };
    return { label: 'failed', color: 'text-red-600' };
  })();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <ChessBoard fen={fen} onMove={handleMove} />
      </div>

      <div className="space-y-4">
        <div className="border border-terminal-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-terminal-500">difficulty:</span>
            <span className="text-terminal-800 font-medium">{difficulty}</span>
            <span className="text-terminal-300">|</span>
            <span className="text-terminal-500">reward:</span>
            <span className="text-green-600 font-medium">{reward} USDT</span>
          </div>

          <div className="text-xs">
            <p className="text-terminal-400 mb-1">{`$ cat solution.log`}</p>
            <div className="border border-terminal-200 bg-terminal-50 p-2 min-h-[60px]">
              {moves.length === 0 ? (
                <span className="text-terminal-400 italic text-[10px]">// make a move on the board...</span>
              ) : (
                <div className="flex flex-wrap gap-0.5">
                  {moves.map((m, i) => (
                    <span key={i} className="text-terminal-700 text-[10px] font-mono">
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
          <div className={`border bg-white p-4 text-xs border-terminal-200`}>
            <p className={`font-semibold ${statusLine.color}`}>
              $ status: {statusLine.label}
            </p>
            <p className="text-terminal-500 mt-1 text-[10px]">{result.message}</p>
            {result.correct && result.reward && (
              <p className="text-green-600 text-[10px] mt-1">+{result.reward} USDT</p>
            )}
            {result.hint && (
              <p className="text-yellow-600 text-[10px] mt-1 italic">{`// ${result.hint}`}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
