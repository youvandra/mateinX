import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './db';
import routes from './api/routes';
import { config } from './config';

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get('/', (_req, res) => {
  res.json({
    name: 'MateinX',
    version: '1.0.0',
    description: 'Solve chess puzzles. Earn crypto rewards.',
  });
});

async function start(): Promise<void> {
  await initDatabase();
  console.log('[DB] Database initialized');

  app.use(routes);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'internal_server_error', message: 'An unexpected error occurred.' });
  });

  app.listen(config.port, () => {
    console.log(`MateinX API running on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
