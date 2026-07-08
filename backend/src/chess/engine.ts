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

  return {
    puzzleId: puzzle.id,
    fen: puzzle.fen,
    difficulty: puzzle.difficulty,
    reward,
    totalMoves: moves.length,
  };
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

  const expected: string[] = [];

  const expectedGame = new Chess(puzzleFen);
  for (let i = 0; i < allMoves.length; i++) {
    try {
      expectedGame.move(allMoves[i]);
      expected.push(expectedGame.history().pop()!);
    } catch {
      expected.push(allMoves[i]);
    }
  }

  const game = new Chess(puzzleFen);
  const played: string[] = [];

  for (let i = 0; i < userMoves.length; i++) {
    const raw = userMoves[i];

    try {
      const result = game.move(raw);
      played.push(result.san);
    } catch {
      return {
        correct: false,
        solution: played,
        expected,
        illegal_move: raw,
      };
    }
  }

  for (let i = 0; i < expected.length && i < played.length; i++) {
    if (played[i] !== expected[i]) {
      return {
        correct: false,
        solution: played,
        expected,
      };
    }
  }

  const allCorrect = played.length === expected.length &&
    played.every((m, i) => m === expected[i]);

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
