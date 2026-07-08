import { v4 as uuid } from 'uuid';
import { getDb, saveDb } from './index';

export interface Game {
  id: string;
  puzzle_id: string;
  user_address: string;
  status: 'pending' | 'active' | 'solved' | 'failed' | 'expired';
  entry_fee: number;
  reward: number;
  payment_tx: string | null;
  reward_tx: string | null;
  solution: string | null;
  created_at: string;
  solved_at: string | null;
}

export function createGame(
  puzzleId: string,
  userAddress: string,
  entryFee: number,
  reward: number,
  paymentTx: string
): Game {
  const db = getDb();
  const id = uuid();
  db.run(
    'INSERT INTO games (id, puzzle_id, user_address, status, entry_fee, reward, payment_tx) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, puzzleId, userAddress, 'active', entryFee, reward, paymentTx]
  );
  saveDb();
  return getGame(id)!;
}

export function getGame(id: string): Game | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM games WHERE id = ?');
  stmt.bind([id]);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return row as unknown as Game | undefined;
}

export function solveGame(id: string, solution: string): void {
  const db = getDb();
  db.run(
    "UPDATE games SET status = 'solved', solution = ?, solved_at = datetime('now') WHERE id = ?",
    [solution, id]
  );
  saveDb();
}

export function failGame(id: string, solution: string): void {
  const db = getDb();
  db.run(
    "UPDATE games SET status = 'failed', solution = ?, solved_at = datetime('now') WHERE id = ?",
    [solution, id]
  );
  saveDb();
}

export function setRewardTx(id: string, txHash: string): void {
  const db = getDb();
  db.run('UPDATE games SET reward_tx = ? WHERE id = ?', [txHash, id]);
  saveDb();
}

export function getGamesByUser(userAddress: string, limit = 20): Game[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM games WHERE user_address = ? ORDER BY created_at DESC LIMIT ?');
  stmt.bind([userAddress, limit]);
  const results: Game[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as Game);
  }
  stmt.free();
  return results;
}

export function getRecentGames(limit = 50): Game[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM games ORDER BY created_at DESC LIMIT ?');
  stmt.bind([limit]);
  const results: Game[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as Game);
  }
  stmt.free();
  return results;
}
