'use client';

import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface PuzzleData {
  fen: string;
  puzzleMoves: string;
}

function generateStartFen(baseFen: string, allMoves: string[]): string {
  const game = new Chess(baseFen);
  for (let i = 0; i < allMoves.length - 1; i++) {
    try { game.move(allMoves[i]); } catch { break; }
  }
  return game.fen();
}

export default function MiniGame() {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [startFen, setStartFen] = useState('');
  const [moves, setMoves] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    setMoves([]);
    setSolved(false);
    setWrong(false);
    setShowAnimation(false);

    try {
      const res = await fetch(`${base}/v1/puzzle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'easy', user_address: 'mini_game' }),
      });
      const body = await res.json();
      const pid = body.puzzle_preview?.puzzle_id;

      const confirmRes = await fetch(`${base}/v1/puzzle/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: pid,
          user_address: 'mini_game',
          payment_tx: `sim_minigame_${Date.now()}`,
        }),
      });
      const confirmData = await confirmRes.json();

      if (confirmData.game_id) {
        setPuzzle({
          fen: confirmData.fen,
          puzzleMoves: '',
        });
        setStartFen(confirmData.fen);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  const handleDrop = (source: string, target: string) => {
    if (solved || !puzzle) return false;
    const uci = `${source}${target}`;
    setMoves(prev => [...prev, uci]);
    return true;
  };

  const handleSubmit = async () => {
    if (!puzzle || moves.length === 0) return;

    try {
      const res = await fetch(`${base}/v1/puzzle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'easy', user_address: 'mini_game' }),
      });
      const body = await res.json();
      const pid = body.puzzle_preview?.puzzle_id;

      const confirmRes = await fetch(`${base}/v1/puzzle/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: pid,
          user_address: 'mini_game',
          payment_tx: `sim_minigame_solve_${Date.now()}`,
        }),
      });
      const confirmData = await confirmRes.json();

      const solveRes = await fetch(`${base}/v1/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: confirmData.game_id,
          solution: moves.join(' '),
          user_address: 'mini_game',
        }),
      });
      const solveData = await solveRes.json();

      if (solveData.correct) {
        setSolved(true);
        setShowAnimation(true);
        setTimeout(() => {
          fetchPuzzle();
        }, 2000);
      } else {
        setWrong(true);
        setTimeout(() => setWrong(false), 1500);
        setMoves([]);
      }
    } catch {
      // silent
    }
  };

  const handleNext = () => {
    setMoves([]);
    setSolved(false);
    setWrong(false);
    setShowAnimation(false);
    fetchPuzzle();
  };

  if (loading && !puzzle) {
    return (
      <div className="border border-terminal-200 bg-white p-8 text-center">
        <p className="text-terminal-400 text-sm font-mono">loading puzzle...</p>
      </div>
    );
  }

  return (
    <div className="relative border border-terminal-200 bg-white overflow-hidden">
      {showAnimation && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-green-50/90 animate-fadeIn">
          <div className="text-center animate-bounceIn">
            <div className="text-5xl mb-2">🎉</div>
            <p className="text-green-700 font-bold text-lg font-mono">SOLVED!</p>
            <p className="text-green-600 text-xs font-mono mt-1">loading next puzzle...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-200">
        <span className="text-[10px] font-mono text-green-600 border border-green-200 bg-green-50 px-1.5 py-0.5">easy</span>
        <button
          onClick={handleNext}
          className="text-[10px] font-mono text-terminal-400 hover:text-terminal-700 transition-colors"
        >
          skip &rarr;
        </button>
      </div>

      <div className={solved ? 'opacity-50 pointer-events-none' : ''}>
        <Chessboard
          id="mini-game-board"
          position={startFen || 'start'}
          onPieceDrop={handleDrop}
          boardWidth={400}
          customBoardStyle={{ borderRadius: '0px' }}
          customDarkSquareStyle={{ backgroundColor: '#739552' }}
          customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
        />
      </div>

        <div className="p-3 border-t border-terminal-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap flex-1 min-h-[24px]">
              {moves.length === 0 ? (
                <span className="text-[10px] text-terminal-400 italic font-mono">drag a piece to move</span>
              ) : (
                moves.map((m, i) => (
                  <span key={i} className="text-[10px] font-mono text-terminal-700 bg-terminal-50 px-1.5 py-0.5 border border-terminal-100">
                    {i % 2 === 0 ? `${Math.floor(i / 2) + 1}.` : ''}{m}
                  </span>
                ))
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={moves.length === 0 || solved}
              className={`text-xs font-mono px-3 py-1 border transition-colors ${
                wrong
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : solved
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : 'bg-terminal-800 text-white border-terminal-800 hover:bg-terminal-700'
              } disabled:opacity-30`}
            >
              {wrong ? 'wrong!' : solved ? 'solved!' : 'submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
