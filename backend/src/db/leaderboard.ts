import { getDb, saveDb } from './index';

interface LeaderboardEntry {
  user_address: string;
  total_solved: number;
  total_failed: number;
  total_earned: number;
  current_streak: number;
  best_streak: number;
  last_solved_at: string | null;
}

export function ensureLeaderboardEntry(userAddress: string): void {
  const db = getDb();
  db.run(
    'INSERT OR IGNORE INTO leaderboard (user_address) VALUES (?)',
    [userAddress]
  );
  saveDb();
}

export function recordSolve(userAddress: string, reward: number): void {
  const db = getDb();
  ensureLeaderboardEntry(userAddress);
  db.run(`
    UPDATE leaderboard SET
      total_solved = total_solved + 1,
      total_earned = total_earned + ?,
      current_streak = current_streak + 1,
      best_streak = CASE WHEN current_streak + 1 > best_streak THEN current_streak + 1 ELSE best_streak END,
      last_solved_at = datetime('now')
    WHERE user_address = ?
  `, [reward, userAddress]);
  saveDb();
}

export function recordFail(userAddress: string): void {
  const db = getDb();
  ensureLeaderboardEntry(userAddress);
  db.run(
    'UPDATE leaderboard SET total_failed = total_failed + 1, current_streak = 0 WHERE user_address = ?',
    [userAddress]
  );
  saveDb();
}

export function getLeaderboard(limit = 50): LeaderboardEntry[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM leaderboard ORDER BY total_solved DESC, total_earned DESC LIMIT ?');
  stmt.bind([limit]);
  const results: LeaderboardEntry[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as LeaderboardEntry);
  }
  stmt.free();
  return results;
}

export function getUserStats(userAddress: string): LeaderboardEntry | undefined {
  const db = getDb();
  ensureLeaderboardEntry(userAddress);
  const stmt = db.prepare('SELECT * FROM leaderboard WHERE user_address = ?');
  stmt.bind([userAddress]);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return row as unknown as LeaderboardEntry | undefined;
}
