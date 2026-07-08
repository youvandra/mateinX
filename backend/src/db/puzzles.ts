import { getDb, saveDb } from './index';

export interface Puzzle {
  id: string;
  fen: string;
  moves: string;
  rating: number;
  difficulty: string;
  themes: string;
}

export function getRandomPuzzle(difficulty: string): Puzzle | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, fen, moves, rating, difficulty, themes
    FROM puzzles
    WHERE difficulty = ? AND used < 50
    ORDER BY RANDOM()
    LIMIT 1
  `);
  stmt.bind([difficulty]);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();

  if (row && (row as any).id) {
    const updateStmt = db.prepare('UPDATE puzzles SET used = used + 1 WHERE id = ?');
    updateStmt.bind([(row as any).id]);
    updateStmt.step();
    updateStmt.free();
    saveDb();
    return row as unknown as Puzzle;
  }

  return undefined;
}

export function getPuzzleCount(): number {
  const db = getDb();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM puzzles');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return (row as any).count as number;
}

export function getPuzzleCountByDifficulty(): Record<string, number> {
  const db = getDb();
  const stmt = db.prepare('SELECT difficulty, COUNT(*) as count FROM puzzles GROUP BY difficulty');
  const result: Record<string, number> = {};

  while (stmt.step()) {
    const row = stmt.getAsObject() as any;
    result[row.difficulty] = row.count;
  }
  stmt.free();

  return result;
}
