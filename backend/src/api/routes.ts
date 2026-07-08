import { Router, Request, Response } from 'express';
import { Chess } from 'chess.js';
import { generatePuzzle, validateSolution, getEntryFeeForDifficulty } from '../chess/engine';
import { createGame, getGame, solveGame, failGame, setRewardTx, getGamesByUser, getGameDetail } from '../db/games';
import { getLeaderboard, getUserStats, recordSolve, recordFail } from '../db/leaderboard';
import { buildPaymentRequiredResponse, verifyPayment } from '../payments/x402';
import { sendReward } from '../rewards/dispatcher';
import { getPuzzleCountByDifficulty } from '../db/puzzles';
import { getDb } from '../db';

const router = Router();

router.post('/v1/puzzle', (req: Request, res: Response) => {
  const { difficulty = 'medium', user_address } = req.body;

  const validDifficulties = ['easy', 'medium', 'hard', 'grandmaster'];
  if (!validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      error: 'invalid_difficulty',
      message: `Must be one of: ${validDifficulties.join(', ')}`,
    });
  }

  if (!user_address) {
    return res.status(400).json({
      error: 'missing_user_address',
      message: 'user_address is required',
    });
  }

  const puzzle = generatePuzzle(difficulty);
  if (!puzzle) {
    return res.status(503).json({
      error: 'no_puzzles',
      message: 'No puzzles available for this difficulty. Try another level.',
    });
  }

  const entryFee = getEntryFeeForDifficulty(difficulty);
  const paymentResponse = buildPaymentRequiredResponse(entryFee, user_address);

  res.set(paymentResponse.headers);
  return res.status(402).json({
    ...JSON.parse(paymentResponse.body),
    puzzle_preview: {
      puzzle_id: puzzle.puzzleId,
      difficulty: puzzle.difficulty,
      total_moves: puzzle.totalMoves,
      reward: puzzle.reward,
    },
  });
});

router.post('/v1/puzzle/confirm', (req: Request, res: Response) => {
  const { puzzle_id, user_address, payment_tx, authorization } = req.body;

  if (!puzzle_id || !user_address || !payment_tx) {
    return res.status(400).json({
      error: 'missing_fields',
      message: 'puzzle_id, user_address, and payment_tx are required',
    });
  }

  const db = getDb();
  const stmt = db.prepare('SELECT fen, moves, difficulty FROM puzzles WHERE id = ?');
  stmt.bind([puzzle_id]);
  const puzzle = stmt.step() ? stmt.getAsObject() as any : null;
  stmt.free();

  if (!puzzle) {
    return res.status(404).json({ error: 'puzzle_not_found' });
  }

  const entryFee = getEntryFeeForDifficulty(puzzle.difficulty);
  const reward = getReward(puzzle.difficulty);

  const verification = verifyPayment(authorization || '', entryFee, payment_tx);
  if (!verification.valid) {
    return res.status(402).json({
      error: 'payment_invalid',
      message: verification.reason || 'Payment verification failed',
    });
  }

  const fenStart = getPuzzleStartFen(puzzle.fen, puzzle.moves);
  const game = createGame(puzzle_id, user_address, entryFee, reward, payment_tx);

  return res.json({
    game_id: game.id,
    puzzle_id,
    fen: fenStart,
    difficulty: puzzle.difficulty,
    reward,
    total_moves: puzzle.moves.split(' ').length,
    entry_fee: entryFee,
    status: game.status,
  });
});

router.post('/v1/solve', (req: Request, res: Response) => {
  const { game_id, solution, user_address } = req.body;

  if (!game_id || !solution || !user_address) {
    return res.status(400).json({
      error: 'missing_fields',
      message: 'game_id, solution, and user_address are required',
    });
  }

  const game = getGame(game_id);
  if (!game) {
    return res.status(404).json({ error: 'game_not_found' });
  }

  if (game.user_address !== user_address) {
    return res.status(403).json({
      error: 'unauthorized',
      message: 'This game does not belong to you',
    });
  }

  if (game.status !== 'active') {
    return res.status(400).json({
      error: 'game_already_resolved',
      message: `Game status is: ${game.status}`,
    });
  }

  const db = getDb();
  const stmt = db.prepare('SELECT fen, moves FROM puzzles WHERE id = ?');
  stmt.bind([game.puzzle_id]);
  const puzzle = stmt.step() ? stmt.getAsObject() as any : null;
  stmt.free();

  if (!puzzle) {
    return res.status(404).json({ error: 'puzzle_not_found' });
  }

  const fenStart = getPuzzleStartFen(puzzle.fen, puzzle.moves);
  const result = validateSolution(fenStart, puzzle.moves, solution);

  if (result.correct) {
    solveGame(game_id, solution);
    recordSolve(user_address, game.reward);

    sendReward(user_address, game.reward, game_id).then((rewardResult) => {
      if (rewardResult.success && rewardResult.txHash) {
        setRewardTx(game_id, rewardResult.txHash);
      }
    });

    return res.json({
      status: 'solved',
      correct: true,
      reward: game.reward,
      game_id,
      message: 'Correct! Reward is being sent to your wallet.',
      solution: result.expected,
    });
  } else {
    failGame(game_id, solution);
    recordFail(user_address);

    return res.json({
      status: 'failed',
      correct: false,
      game_id,
      message: 'Incorrect solution. Try again with a new puzzle.',
      your_moves: result.solution,
      expected_first_moves: result.expected.slice(0, 3),
      hint: result.expected.length > 0
        ? `The correct first move was: ${result.expected[0]}`
        : undefined,
    });
  }
});

router.get('/v1/games/:userAddress', (req: Request, res: Response) => {
  const userAddress = String(req.params.userAddress);
  const games = getGamesByUser(userAddress);
  res.json({ games });
});

router.get('/v1/leaderboard', (_req: Request, res: Response) => {
  const leaderboard = getLeaderboard();
  res.json({ leaderboard });
});

router.get('/v1/stats/:userAddress', (req: Request, res: Response) => {
  const userAddress = String(req.params.userAddress);
  const stats = getUserStats(userAddress);
  const recentGames = getGamesByUser(userAddress, 5);
  res.json({ stats, recent_games: recentGames });
});

router.get('/v1/game/:gameId', (req: Request, res: Response) => {
  const gameId = String(req.params.gameId);
  const detail = getGameDetail(gameId);
  if (!detail) {
    return res.status(404).json({ error: 'game_not_found' });
  }
  res.json({ game: detail });
});

router.get('/v1/health', (_req: Request, res: Response) => {
  const puzzleCounts = getPuzzleCountByDifficulty();
  res.json({
    status: 'ok',
    puzzles: puzzleCounts,
    timestamp: new Date().toISOString(),
  });
});

function getPuzzleStartFen(baseFen: string, moves: string): string {
  const game = new Chess(baseFen);
  const moveList = moves.split(' ');
  for (let i = 0; i < moveList.length - 1; i++) {
    try {
      game.move(moveList[i]);
    } catch {
      break;
    }
  }
  return game.fen();
}

function getReward(difficulty: string): number {
  const rewards: Record<string, number> = {
    easy: 0.3,
    medium: 1.0,
    hard: 3.0,
    grandmaster: 10.0,
  };
  return rewards[difficulty] || 0.5;
}

export default router;
