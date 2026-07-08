'use client';

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useParams } from 'next/navigation';

interface GameDetail {
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
  puzzle_moves: string | null;
  created_at: string;
  solved_at: string | null;
}

export default function GameDetail() {
  const params = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [game_, setGame_] = useState<Chess | null>(null);
  const [fenHistory, setFenHistory] = useState<string[]>([]);
  const [startFen, setStartFen] = useState('');

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

  useEffect(() => {
    if (!params.id) return;
    const fetchGame = async () => {
      try {
        const res = await fetch(`${base}/v1/game/${params.id}`);
        const data = await res.json();
        setGame(data.game);

        if (data.game.fen && data.game.puzzle_moves) {
          const allMoves = data.game.puzzle_moves.split(' ');
          setStartFen(data.game.fen);

          const history = [data.game.fen];
          const replayChess = new Chess(data.game.fen);

          if (data.game.solution) {
            const userMoves = data.game.solution.split(' ').filter(Boolean);
            for (const m of userMoves) {
              try {
                replayChess.move(m);
                history.push(replayChess.fen());
              } catch { break; }
            }
          }

          const expectedChess = new Chess(data.game.fen);
          for (const m of allMoves) {
            try {
              expectedChess.move(m);
              if (!history.includes(expectedChess.fen())) {
                history.push(expectedChess.fen());
              }
            } catch { break; }
          }

          setFenHistory(history);
          setGame_(new Chess(data.game.fen));
        }
      } catch (err) {
        console.error('Failed to fetch game', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [params.id]);

  const navigateMove = (direction: number) => {
    const newIdx = Math.max(0, Math.min(fenHistory.length - 1, currentMoveIndex + direction));
    setCurrentMoveIndex(newIdx);
    if (game_ && fenHistory[newIdx]) {
      game_.load(fenHistory[newIdx]);
      setGame_(new Chess(fenHistory[newIdx]));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-matein-400">Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-matein-800">Game Not Found</h1>
        <p className="text-matein-500 mt-2">This game does not exist.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800',
    solved: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };

  const difficulty = game.fen ? 'N/A' : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/dashboard" className="text-matein-500 hover:text-matein-700 text-sm">
          &larr; Dashboard
        </a>
        <h1 className="text-2xl font-bold text-matein-800">Game Detail</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-matein-200">
            <Chessboard
              id="game-detail-board"
              position={fenHistory[currentMoveIndex] || startFen || 'start'}
              boardWidth={400}
              arePiecesDraggable={false}
              customBoardStyle={{ borderRadius: '12px' }}
              customDarkSquareStyle={{ backgroundColor: '#3d8d6f' }}
              customLightSquareStyle={{ backgroundColor: '#e8f5e9' }}
            />
          </div>

          {fenHistory.length > 1 && (
            <div className="flex items-center justify-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-matein-200">
              <button
                onClick={() => navigateMove(-1)}
                disabled={currentMoveIndex <= 0}
                className="px-4 py-2 bg-matein-100 text-matein-700 rounded-lg disabled:opacity-40 hover:bg-matein-200 transition-colors font-medium"
              >
                &larr; Prev
              </button>
              <span className="text-sm text-matein-600 font-medium">
                Move {currentMoveIndex} / {fenHistory.length - 1}
              </span>
              <button
                onClick={() => navigateMove(1)}
                disabled={currentMoveIndex >= fenHistory.length - 1}
                className="px-4 py-2 bg-matein-100 text-matein-700 rounded-lg disabled:opacity-40 hover:bg-matein-200 transition-colors font-medium"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-matein-200 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[game.status] || 'bg-gray-100 text-gray-800'}`}>
                {game.status}
              </span>
              <span className="text-sm text-matein-500">
                ID: {game.id.slice(0, 8)}...
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">Puzzle</p>
                <p className="font-mono text-xs text-matein-700 mt-1 break-all">{game.puzzle_id}</p>
              </div>
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">User</p>
                <p className="font-mono text-xs text-matein-700 mt-1">{game.user_address.slice(0, 6)}...{game.user_address.slice(-4)}</p>
              </div>
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">Entry Fee</p>
                <p className="font-medium text-matein-700 mt-1">{game.entry_fee} USDT</p>
              </div>
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">Reward</p>
                <p className="font-medium text-matein-700 mt-1">{game.reward} USDT</p>
              </div>
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">Date</p>
                <p className="text-matein-600 mt-1">{new Date(game.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-matein-400 text-xs uppercase tracking-wide">Solved At</p>
                <p className="text-matein-600 mt-1">{game.solved_at ? new Date(game.solved_at).toLocaleString() : '-'}</p>
              </div>
              {game.reward_tx && (
                <div className="col-span-2">
                  <p className="text-matein-400 text-xs uppercase tracking-wide">Reward TX</p>
                  <p className="font-mono text-xs text-matein-700 mt-1 break-all">{game.reward_tx}</p>
                </div>
              )}
            </div>
          </div>

          {game.solution && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-matein-200">
              <h3 className="text-sm font-semibold text-matein-700 mb-3">Solution Submitted</h3>
              <div className="flex flex-wrap gap-1">
                {game.solution.split(' ').filter(Boolean).map((m, i) => {
                  const allMoves = game.puzzle_moves?.split(' ') || [];
                  const isCorrect = i < allMoves.length && allMoves[i] === m;
                  const icon = i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : '';
                  return (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs font-mono ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {icon} {m}
                    </span>
                  );
                })}
              </div>
              {game.puzzle_moves && game.status === 'failed' && (
                <div className="mt-3 pt-3 border-t border-matein-100">
                  <p className="text-xs font-medium text-matein-500 mb-1">Expected solution:</p>
                  <div className="flex flex-wrap gap-1">
                    {game.puzzle_moves.split(' ').map((m, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-mono">
                        {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''} {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {game.fen && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-matein-200">
              <h3 className="text-sm font-semibold text-matein-700 mb-2">Position (FEN)</h3>
              <p className="font-mono text-xs text-matein-600 break-all">{game.fen}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
