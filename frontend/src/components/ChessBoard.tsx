'use client';

import { Chessboard } from 'react-chessboard';

interface ChessBoardProps {
  fen: string;
  onMove?: (san: string) => void;
  disabled?: boolean;
  orientation?: 'white' | 'black';
  height?: number;
}

export default function ChessBoard({ fen, onMove, disabled, orientation, height = 400 }: ChessBoardProps) {
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (disabled || !onMove) return false;
    onMove(`${sourceSquare}${targetSquare}`);
    return true;
  };

  return (
    <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
      <Chessboard
        id="matein-board"
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        boardWidth={height}
        customBoardStyle={{ borderRadius: '0px' }}
        customDarkSquareStyle={{ backgroundColor: '#739552' }}
        customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
        arePiecesDraggable={!disabled}
      />
    </div>
  );
}
