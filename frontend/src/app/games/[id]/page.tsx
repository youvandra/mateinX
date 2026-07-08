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
    return <div className="pt-20 text-center text-sm text-[#525252] font-mono">loading...</div>;
  }

  if (!game) {
    return (
      <div className="pt-20 text-center">
        <h1 className="text-lg font-bold text-white">Game Not Found</h1>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    solved: 'text-green-400 border-green-500/30 bg-green-500/10',
    failed: 'text-red-400 border-red-500/30 bg-red-500/10',
    pending: 'text-[#737373] border-[#262626] bg-[#1a1a1a]',
  };

  return (
    <div className="pt-20 max-w-6xl mx-auto px-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard" className="text-sm text-[#737373] hover:text-white transition-colors">
          &larr; back
        </a>
        <span className={`inline-flex px-2 py-0.5 text-xs font-mono border rounded ${statusColors[game.status] || 'text-[#737373] border-[#262626] bg-[#1a1a1a]'}`}>
          {game.status}
        </span>
        <span className="text-xs font-mono text-[#525252]">#{game.id.slice(0, 8)}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
            <Chessboard
              id="game-detail-board"
              position={fenHistory[currentMoveIndex]}
              boardWidth={400}
              arePiecesDraggable={false}
              customBoardStyle={{ borderRadius: '0px' }}
              customDarkSquareStyle={{ backgroundColor: '#739552' }}
              customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
            />
          </div>

          {fenHistory.length > 1 && (
            <div className="flex items-center justify-center gap-4 border border-[#1a1a1a] bg-[#0d0d0d] rounded-lg p-3">
              <button
                onClick={() => navigateMove(-1)}
                disabled={currentMoveIndex <= 0}
                className="px-3 py-1.5 text-xs font-medium text-[#a3a3a3] border border-[#262626] rounded hover:border-[#404040] hover:text-white disabled:opacity-30 transition-colors"
              >
                &larr; Prev
              </button>
              <span className="text-xs font-mono text-[#525252]">
                {currentMoveIndex} / {fenHistory.length - 1}
              </span>
              <button
                onClick={() => navigateMove(1)}
                disabled={currentMoveIndex >= fenHistory.length - 1}
                className="px-3 py-1.5 text-xs font-medium text-[#a3a3a3] border border-[#262626] rounded hover:border-[#404040] hover:text-white disabled:opacity-30 transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="border border-[#1a1a1a] rounded-lg bg-[#0d0d0d] p-5 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#737373] font-mono">puzzle</div>
                <div className="text-xs font-mono text-[#a3a3a3] break-all mt-1">{game.puzzle_id}</div>
              </div>
              <div>
                <div className="text-xs text-[#737373] font-mono">user</div>
                <div className="text-xs font-mono text-[#a3a3a3] mt-1">{game.user_address.slice(0, 6)}...{game.user_address.slice(-4)}</div>
              </div>
              <div>
                <div className="text-xs text-[#737373] font-mono">entry fee</div>
                <div className="text-white font-mono mt-1">{game.entry_fee} USDT</div>
              </div>
              <div>
                <div className="text-xs text-[#737373] font-mono">reward</div>
                <div className="text-[#34d399] font-mono mt-1">{game.reward} USDT</div>
              </div>
              <div>
                <div className="text-xs text-[#737373] font-mono">date</div>
                <div className="text-xs text-[#a3a3a3] mt-1">{new Date(game.created_at).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-[#737373] font-mono">solved at</div>
                <div className="text-xs text-[#a3a3a3] mt-1">{game.solved_at ? new Date(game.solved_at).toLocaleString() : '-'}</div>
              </div>
            </div>
            {game.reward_tx && (
              <div className="pt-3 border-t border-[#1a1a1a]">
                <div className="text-xs text-[#737373] font-mono mb-1">reward tx</div>
                <div className="text-xs font-mono text-[#a3a3a3] break-all">{game.reward_tx}</div>
              </div>
            )}
          </div>

          {game.solution && (
            <div className="border border-[#1a1a1a] rounded-lg bg-[#0d0d0d] p-5">
              <div className="text-xs font-mono text-[#737373] mb-3">submitted solution</div>
              <div className="flex flex-wrap gap-1">
                {game.solution.split(' ').filter(Boolean).map((m, i) => {
                  const allMoves = game.puzzle_moves?.split(' ') || [];
                  const isCorrect = i < allMoves.length &&
                    m.toLowerCase().replace(/[+#]/g, '') === allMoves[i].toLowerCase().replace(/[+#]/g, '');
                  return (
                    <span
                      key={i}
                      className={`px-2 py-0.5 text-xs font-mono border rounded ${
                        isCorrect
                          ? 'border-green-500/30 text-green-400 bg-green-500/10'
                          : 'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}
                    >
                      {m}
                    </span>
                  );
                })}
              </div>
              {game.puzzle_moves && game.status === 'failed' && (
                <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                  <div className="text-xs font-mono text-[#737373] mb-2">expected</div>
                  <div className="flex flex-wrap gap-1">
                    {game.puzzle_moves.split(' ').map((m, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs font-mono border border-green-500/30 text-green-400 bg-green-500/10 rounded">
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
