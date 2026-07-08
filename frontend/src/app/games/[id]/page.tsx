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
  const [fenHistory, setFenHistory] = useState<string[]>(['start']);

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
              if (!history.some(h => h === expectedChess.fen())) {
                history.push(expectedChess.fen());
              }
            } catch { break; }
          }

          setFenHistory(history);
        }
      } catch {
        console.error('fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [params.id]);

  const navigateMove = (direction: number) => {
    const newIdx = Math.max(0, Math.min(fenHistory.length - 1, currentMoveIndex + direction));
    setCurrentMoveIndex(newIdx);
  };

  if (loading) {
    return <div className="text-terminal-400 text-xs font-mono">$ loading...</div>;
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h1 className="text-base font-bold text-terminal-800">{`$ game_not_found`}</h1>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'border-blue-500 text-blue-600',
    solved: 'border-green-500 text-green-600',
    failed: 'border-red-500 text-red-600',
    pending: 'border-terminal-300 text-terminal-500',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs font-mono">
        <a href="/dashboard" className="text-terminal-500 hover:text-terminal-800 transition-colors">
          {'<- back'}
        </a>
        <span className={`px-1.5 py-0.5 text-[10px] border ${statusColors[game.status] || 'border-terminal-300 text-terminal-500'}`}>
          {game.status}
        </span>
        <span className="text-terminal-400 text-[10px]">#{game.id.slice(0, 8)}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border border-terminal-200">
            <Chessboard
              id="game-detail-board"
              position={fenHistory[currentMoveIndex]}
              boardWidth={400}
              arePiecesDraggable={false}
              customBoardStyle={{ borderRadius: '0px' }}
              customDarkSquareStyle={{ backgroundColor: '#b58863' }}
              customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
            />
          </div>

          {fenHistory.length > 1 && (
            <div className="flex items-center justify-center gap-4 border border-terminal-200 bg-terminal-50 p-2">
              <button
                onClick={() => navigateMove(-1)}
                disabled={currentMoveIndex <= 0}
                className="px-3 py-1 terminal-btn text-[10px] disabled:opacity-30"
              >
                {'<- prev'}
              </button>
              <span className="text-[10px] text-terminal-500 font-mono">
                {currentMoveIndex} / {fenHistory.length - 1}
              </span>
              <button
                onClick={() => navigateMove(1)}
                disabled={currentMoveIndex >= fenHistory.length - 1}
                className="px-3 py-1 terminal-btn text-[10px] disabled:opacity-30"
              >
                {'next ->'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="border border-terminal-200 bg-white p-4 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">puzzle</p>
                <p className="text-terminal-600 text-[10px] break-all">{game.puzzle_id}</p>
              </div>
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">user</p>
                <p className="text-terminal-600 text-[10px]">{game.user_address.slice(0, 6)}...{game.user_address.slice(-4)}</p>
              </div>
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">entry fee</p>
                <p className="text-terminal-800">{game.entry_fee} USDT</p>
              </div>
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">reward</p>
                <p className="text-green-600">{game.reward} USDT</p>
              </div>
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">date</p>
                <p className="text-terminal-500 text-[10px]">{new Date(game.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">solved at</p>
                <p className="text-terminal-500 text-[10px]">{game.solved_at ? new Date(game.solved_at).toLocaleString() : '-'}</p>
              </div>
            </div>
            {game.reward_tx && (
              <div>
                <p className="text-terminal-400 text-[10px] uppercase">reward tx</p>
                <p className="text-terminal-600 text-[10px] break-all">{game.reward_tx}</p>
              </div>
            )}
          </div>

          {game.solution && (
            <div className="border border-terminal-200 bg-white p-4">
              <p className="text-terminal-500 text-[10px] uppercase mb-2">submitted solution</p>
              <div className="flex flex-wrap gap-0.5">
                {game.solution.split(' ').filter(Boolean).map((m, i) => {
                  const allMoves = game.puzzle_moves?.split(' ') || [];
                  const isCorrect = i < allMoves.length &&
                    m.toLowerCase().replace(/[+#]/g, '') === allMoves[i].toLowerCase().replace(/[+#]/g, '');
                  return (
                    <span
                      key={i}
                      className={`px-1 py-0.5 text-[10px] font-mono border ${
                        isCorrect
                          ? 'border-green-300 text-green-700 bg-green-50'
                          : 'border-red-300 text-red-700 bg-red-50'
                      }`}
                    >
                      {m}
                    </span>
                  );
                })}
              </div>
              {game.puzzle_moves && game.status === 'failed' && (
                <div className="mt-3 pt-3 border-t border-terminal-200">
                  <p className="text-terminal-500 text-[10px] uppercase mb-1">expected</p>
                  <div className="flex flex-wrap gap-0.5">
                    {game.puzzle_moves.split(' ').map((m, i) => (
                      <span key={i} className="px-1 py-0.5 text-[10px] font-mono border border-green-300 text-green-700 bg-green-50">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
