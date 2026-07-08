import { Chess } from 'chess.js';
import { getRandomPuzzle } from '../db/puzzles';
import type { Puzzle } from '../db/puzzles';

export interface PuzzleResponse {
  puzzleId: string;
  fen: string;
  difficulty: string;
  reward: number;
  totalMoves: number;
}

export interface SolveResult {
  correct: boolean;
  solution: string[];
  expected: string[];
  illegal_move?: string;
}

export function generatePuzzle(difficulty: string): PuzzleResponse | null {
  const puzzle = getRandomPuzzle(difficulty);
  if (!puzzle) return null;

  const moves = puzzle.moves.split(' ');
  const reward = getRewardForDifficulty(puzzle.difficulty);

  const startFen = getStartFen(puzzle.fen, moves.slice(0, -1));

  return {
    puzzleId: puzzle.id,
    fen: startFen,
    difficulty: puzzle.difficulty,
    reward,
    totalMoves: moves.length,
  };
}

function getStartFen(baseFen: string, preMoves: string[]): string {
  const game = new Chess(baseFen);
  for (const move of preMoves) {
    try {
      game.move(move);
    } catch {
      break;
    }
  }
  return game.fen();
}

function getRewardForDifficulty(difficulty: string): number {
  const rewards: Record<string, number> = {
    easy: 0.3,
    medium: 1.0,
    hard: 3.0,
    grandmaster: 10.0,
  };
  return rewards[difficulty] || 0.5;
}

export function validateSolution(
  puzzleFen: string,
  puzzleMoves: string,
  userSolution: string
): SolveResult & { illegal_move?: string } {
  const allMoves = puzzleMoves.split(' ');
  const userMoves = userSolution.split(' ').filter(Boolean);

  const game = new Chess(puzzleFen);
  const checkGame = new Chess(puzzleFen);

  let allCorrect = true;
  const expected: string[] = [];
  const played: string[] = [];

  for (let i = 0; i < allMoves.length; i++) {
    try {
      checkGame.move(allMoves[i]);
      expected.push(checkGame.history().pop()!);
    } catch {
      expected.push(allMoves[i]);
    }
  }

  for (let i = 0; i < userMoves.length; i++) {
    const raw = userMoves[i];

    try {
      const result = game.move(raw, { strict: true });
      played.push(result.san);

      if (i >= allMoves.length) {
        allCorrect = false;
        continue;
      }

      if (result.san !== expected[i]) {
        allCorrect = false;
      }
    } catch {
      return {
        correct: false,
        solution: [...played, raw],
        expected,
        illegal_move: raw,
      };
    }
  }

  if (userMoves.length < allMoves.length) {
    allCorrect = false;
  }

  return {
    correct: allCorrect,
    solution: played,
    expected,
  };
}

export function getDifficultyLabel(rating: number): string {
  if (rating <= 1200) return 'easy';
  if (rating <= 1700) return 'medium';
  if (rating <= 2200) return 'hard';
  return 'grandmaster';
}

export function getEntryFeeForDifficulty(difficulty: string): number {
  const fees: Record<string, number> = {
    easy: 0.5,
    medium: 0.5,
    hard: 1.0,
    grandmaster: 2.0,
  };
  return fees[difficulty] || 0.5;
}
