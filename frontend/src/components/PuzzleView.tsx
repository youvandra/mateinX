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

  const statusColor = (() => {
    if (!result) return 'text-[#737373]';
    if (result.status === 'illegal') return 'text-yellow-400';
    if (result.correct) return 'text-[#34d399]';
    return 'text-red-400';
  })();

  const statusLabel = (() => {
    if (!result) return 'pending';
    if (result.status === 'illegal') return 'illegal move';
    if (result.correct) return 'solved';
    return 'failed';
  })();

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <ChessBoard fen={fen} onMove={handleMove} />
      </div>

      <div className="space-y-4">
        <div className="border border-[#1a1a1a] rounded-lg bg-[#0d0d0d] p-5 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#737373] font-mono text-xs">difficulty:</span>
            <span className="text-white font-medium">{difficulty}</span>
            <span className="text-[#262626]">|</span>
            <span className="text-[#737373] font-mono text-xs">reward:</span>
            <span className="text-[#34d399] font-medium">{reward} USDT</span>
          </div>

          <div>
            <div className="text-xs font-mono text-[#737373] mb-2">$ cat solution.log</div>
            <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-3 min-h-[60px]">
              {moves.length === 0 ? (
                <span className="text-[#525252] italic text-xs">// make a move on the board...</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {moves.map((m, i) => (
                    <span key={i} className="text-[#e5e5e5] text-xs font-mono">
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
            className="w-full px-4 py-2.5 text-sm font-medium text-black bg-white hover:bg-[#e5e5e5] rounded-lg transition-colors disabled:opacity-30"
          >
            {solving ? 'verifying...' : 'Submit Solution'}
          </button>
        </div>

        {result && (
          <div className={`border border-[#1a1a1a] rounded-lg bg-[#0d0d0d] p-5`}>
            <div className={`text-sm font-semibold ${statusColor}`}>
              $ status: {statusLabel}
            </div>
            <div className="text-xs text-[#a3a3a3] mt-1">{result.message}</div>
            {result.correct && result.reward && (
              <div className="text-xs text-[#34d399] mt-1 font-mono">+{result.reward} USDT</div>
            )}
            {result.hint && (
              <div className="text-xs text-yellow-400/80 mt-1 italic">{`// ${result.hint}`}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
