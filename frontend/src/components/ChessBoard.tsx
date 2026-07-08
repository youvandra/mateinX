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
    <div className="terminal-border">
      <Chessboard
        id="matein-board"
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={orientation}
        boardWidth={height}
        customBoardStyle={{
          borderRadius: '0px',
        }}
        customDarkSquareStyle={{ backgroundColor: '#262626' }}
        customLightSquareStyle={{ backgroundColor: '#171717' }}
        customPieces={{}}
        arePiecesDraggable={!disabled}
      />
    </div>
  );
}
