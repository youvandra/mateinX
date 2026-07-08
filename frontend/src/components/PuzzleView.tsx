'use client';

import { useState } from 'react';
import ChessBoard from './ChessBoard';

interface PuzzleData {
  fen: string;
  difficulty: string;
  reward: number;
  gameId?: string;
}

interface SolveResult {
  status: string;
  correct: boolean;
  reward?: number;
  message: string;
  your_solution?: string[];
  expected_first_moves?: string[];
  hint?: string;
}

export default function PuzzleView({ fen, difficulty, reward, gameId: initialGameId }: PuzzleData) {
  const [gameId, setGameId] = useState(initialGameId);
  const [moves, setMoves] = useState<string[]>([]);
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState<SolveResult | null>(null);

  const handleMove = async (san: string) => {
    const updated = [...moves, san];
    setMoves(updated);
  };

  const handleSubmit = async () => {
    if (!gameId || moves.length === 0) return;
    setSolving(true);

    try {
      const userAddress = localStorage.getItem('mateinx_address') || 'demo_user';

      const res = await fetch('/api/v1/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: gameId,
          solution: moves.join(' '),
          user_address: userAddress,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        status: 'error',
        correct: false,
        message: 'Failed to submit solution. Check your connection.',
      });
    } finally {
      setSolving(false);
    }
  };

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-orange-100 text-orange-800',
    grandmaster: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-shrink-0">
        <ChessBoard fen={fen} onMove={handleMove} />
      </div>

      <div className="flex-1 space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-matein-200">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
              {difficulty}
            </span>
            <span className="text-sm text-matein-600">
              Reward: <strong className="text-matein-700">{reward} USDT</strong>
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-matein-600">Your moves:</p>
            <div className="flex flex-wrap gap-1">
              {moves.length === 0 ? (
                <span className="text-matein-400 text-sm italic">Make a move on the board...</span>
              ) : (
                moves.map((m, i) => (
                  <span key={i} className="bg-matein-100 text-matein-800 px-2 py-1 rounded text-sm font-mono">
                    {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}{m}
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!gameId || moves.length === 0 || solving}
            className="mt-4 w-full px-4 py-2.5 bg-matein-600 text-white rounded-lg font-medium hover:bg-matein-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {solving ? 'Checking...' : 'Submit Solution'}
          </button>
        </div>

        {result && (
          <div className={`rounded-xl p-6 border shadow-sm ${
            result.correct
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-semibold text-lg ${result.correct ? 'text-green-700' : 'text-red-700'}`}>
              {result.correct ? '✅ Solved!' : '❌ Incorrect'}
            </p>
            <p className="text-sm mt-1 text-matein-600">{result.message}</p>
            {result.correct && result.reward && (
              <p className="text-sm font-medium text-matein-700 mt-2">
                +{result.reward} USDT sent to your wallet
              </p>
            )}
            {result.hint && (
              <p className="text-sm text-amber-600 mt-2 italic">{result.hint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
