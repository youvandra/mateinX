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
): SolveResult {
  const allMoves = puzzleMoves.split(' ');
  const game = new Chess(puzzleFen);

  const userMoves = userSolution.split(' ').filter(Boolean);

  const correctCount = userMoves.length <= allMoves.length
    ? allMoves.slice(0, userMoves.length)
    : allMoves;

  let allCorrect = true;
  const expected: string[] = [];

  for (let i = 0; i < userMoves.length && i < allMoves.length; i++) {
    const userMove = userMoves[i];
    const correctMove = allMoves[i];

    const isCorrect = normalizeMove(userMove) === normalizeMove(correctMove);
    if (!isCorrect) allCorrect = false;
    expected.push(correctMove);
  }

  if (userMoves.length < allMoves.length) {
    allCorrect = false;
    expected.push(...allMoves.slice(userMoves.length));
  }

  return {
    correct: allCorrect,
    solution: userMoves,
    expected,
  };
}

function normalizeMove(move: string): string {
  return move.replace(/[+#]$/, '').toLowerCase();
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
