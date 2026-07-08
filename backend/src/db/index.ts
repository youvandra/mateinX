import initSqlJs, { Database as SqlJsDb } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

let db: SqlJsDb | null = null;

const dbDir = path.dirname(config.databasePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export async function initDatabase(): Promise<SqlJsDb> {
  const SQL = await initSqlJs();

  if (fs.existsSync(config.databasePath)) {
    const buffer = fs.readFileSync(config.databasePath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS puzzles (
      id TEXT PRIMARY KEY,
      fen TEXT NOT NULL,
      moves TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 1500,
      rating_deviation INTEGER NOT NULL DEFAULT 0,
      popularity INTEGER NOT NULL DEFAULT 0,
      themes TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL DEFAULT 'medium',
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      puzzle_id TEXT NOT NULL,
      user_address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      entry_fee REAL NOT NULL DEFAULT 0,
      reward REAL NOT NULL DEFAULT 0,
      payment_tx TEXT,
      reward_tx TEXT,
      solution TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      solved_at TEXT,
      expires_at TEXT NOT NULL DEFAULT (datetime('now', '+10 minutes')),
      FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
      user_address TEXT NOT NULL,
      total_solved INTEGER NOT NULL DEFAULT 0,
      total_failed INTEGER NOT NULL DEFAULT 0,
      total_earned REAL NOT NULL DEFAULT 0,
      current_streak INTEGER NOT NULL DEFAULT 0,
      best_streak INTEGER NOT NULL DEFAULT 0,
      last_solved_at TEXT,
      PRIMARY KEY (user_address)
    );

    CREATE TABLE IF NOT EXISTS x402_nonces (
      nonce TEXT PRIMARY KEY,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  try {
    db.run('CREATE INDEX IF NOT EXISTS idx_games_user ON games(user_address)');
    db.run('CREATE INDEX IF NOT EXISTS idx_games_status ON games(status)');
    db.run('CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles(difficulty)');
    db.run('CREATE INDEX IF NOT EXISTS idx_puzzles_used ON puzzles(used)');
  } catch {
    // indexes may already exist
  }

  saveDb();
  return db;
}

export function getDb(): SqlJsDb {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export function saveDb(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(config.databasePath, buffer);
}

export default db;
