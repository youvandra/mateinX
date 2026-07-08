import { initDatabase, getDb, saveDb } from './db';
import { getDifficultyLabel } from './chess/engine';
import fs from 'fs';
import path from 'path';

interface RawPuzzle {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Rating: string;
  RatingDeviation: string;
  Popularity: string;
  NbPlays: string;
  Themes: string;
  GameUrl: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function seedPuzzles(): Promise<void> {
  await initDatabase();
  const db = getDb();

  const csvPath = path.join(__dirname, '..', 'data', 'puzzles.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('No puzzles.csv found. To download Lichess puzzles:');
    console.log('  1. Visit https://database.lichess.org/#puzzles');
    console.log('  2. Download lichess_db_puzzle.csv.zst');
    console.log('  3. Extract and place as data/puzzles.csv');
    console.log('');
    console.log('Seeding sample puzzles instead...');
    seedSamplePuzzles(db);
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  const header = parseCSVLine(lines[0]);

  let inserted = 0;

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO puzzles (id, fen, moves, rating, rating_deviation, popularity, themes, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    const puzzle: RawPuzzle = {
      PuzzleId: cols[0],
      FEN: cols[1],
      Moves: cols[2],
      Rating: cols[3],
      RatingDeviation: cols[4],
      Popularity: cols[5],
      NbPlays: cols[6],
      Themes: cols[7],
      GameUrl: cols[8] || '',
    };

    const rating = parseInt(puzzle.Rating, 10);
    const difficulty = getDifficultyLabel(rating);

    insertStmt.bind([
      puzzle.PuzzleId, puzzle.FEN, puzzle.Moves, rating,
      parseInt(puzzle.RatingDeviation, 10),
      parseInt(puzzle.Popularity, 10),
      puzzle.Themes, difficulty,
    ]);
    insertStmt.step();
    insertStmt.reset();
    inserted++;

    if (inserted % 1000 === 0) {
      process.stdout.write(`\rSeeded ${inserted} puzzles...`);
    }
  }

  insertStmt.free();
  saveDb();
  console.log(`\nDone! Seeded ${inserted} puzzles.`);
}

function seedSamplePuzzles(db: any): void {
  const samples = [
    {
      id: 'sample_easy_1',
      fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
      moves: 'Re8+ Kf7 Rf8+ Kg6 Rxf6+',
      rating: 1000,
      difficulty: 'easy',
      themes: 'endgame, rook',
    },
    {
      id: 'sample_medium_1',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      moves: 'Bxf7+ Kxf7 Ng5+ Kg8 Ne6',
      rating: 1500,
      difficulty: 'medium',
      themes: 'fork, tactics',
    },
    {
      id: 'sample_hard_1',
      fen: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      moves: 'Nxf7 Kxf7 Ng5+ Kg8 Qd5+ Kh8 Qxa8',
      rating: 2000,
      difficulty: 'hard',
      themes: 'sacrifice, attack',
    },
    {
      id: 'sample_gm_1',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moves: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 c4 c6 cxb5 axb5 Nc3 Bb7 Bg5 b4 Na4 Qa5 Nc5',
      rating: 2500,
      difficulty: 'grandmaster',
      themes: 'opening, positional',
    },
  ];

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO puzzles (id, fen, moves, rating, rating_deviation, popularity, themes, difficulty)
    VALUES (?, ?, ?, ?, 0, 0, ?, ?)
  `);

  for (const s of samples) {
    insertStmt.bind([s.id, s.fen, s.moves, s.rating, s.themes, s.difficulty]);
    insertStmt.step();
    insertStmt.reset();
  }
  insertStmt.free();
  saveDb();
  console.log(`Seeded ${samples.length} sample puzzles.`);
}

seedPuzzles().catch(console.error);
