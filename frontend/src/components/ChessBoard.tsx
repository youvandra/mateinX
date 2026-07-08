'use client';

import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  onMove?: (san: string) => void;
  disabled?: boolean;
  orientation?: 'white' | 'black';
  height?: number;
}

export default function ChessBoard({ fen, onMove, disabled, orientation, height = 400 }: ChessBoardProps) {
  const [game] = useState(() => new Chess(fen));

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    if (disabled) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move) {
        onMove?.(move.san);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [game, disabled, onMove]);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-matein-200">
      <Chessboard
        id="matein-board"
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        boardWidth={height}
        customBoardStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        customDarkSquareStyle={{ backgroundColor: '#3d8d6f' }}
        customLightSquareStyle={{ backgroundColor: '#e8f5e9' }}
        arePiecesDraggable={!disabled}
      />
    </div>
  );
}
