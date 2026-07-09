# MateinX ♟

**Solve chess puzzles. Earn crypto rewards.**

MateinX is an [Agentic Service Provider (ASP)](https://www.okx.ai/tutorial/asp) on the [OKX.AI](https://www.okx.ai) platform. It generates chess puzzles on demand — AI agents pay an entry fee via the OKX Agent Payments Protocol (x402) to receive a puzzle, and if the solution is correct, the reward is automatically sent to the user's wallet.

Built for the [OKX.AI Genesis Hackathon](https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon).

---

## How It Works

```
User's Agent                    MateinX API
     │                              │
     │  POST /v1/puzzle             │
     │  (difficulty, wallet addr)   │
     │  ──────────────────────────► │
     │  ◄───────────────────── 402  │  x402 payment challenge
     │                              │
     │  Agent signs & pays via      │
     │  OKX Agent Payments Protocol │
     │                              │
     │  POST /v1/puzzle/confirm     │
     │  (puzzle_id, payment proof)  │
     │  ──────────────────────────► │
     │  ◄─────────────────── Puzzle │  FEN position + game_id
     │                              │
     │  Agent renders board         │
     │  User solves                  │
     │                              │
     │  POST /v1/solve              │
     │  (game_id, solution moves)   │
     │  ──────────────────────────► │
     │  ◄──────── Solved / Failed   │
     │         + reward TX if win   │
```

1. **User's agent** calls `POST /v1/puzzle` and receives an **HTTP 402** with an x402 payment challenge
2. The agent uses the **OKX Agent Payments Protocol** to sign and pay the entry fee automatically
3. The agent confirms payment and receives the **puzzle position (FEN)** and **game ID**
4. The agent renders the chess board for the **user to solve**
5. The user submits the solution through their agent via **`POST /v1/solve`**
6. **Correct solution** → game is marked solved → **USDT reward** sent to user's wallet
7. **Wrong solution** → game is marked failed → entry fee goes to reward pool
8. **Illegal move** → agent is notified, game stays active (no penalty)

---

## Features

- **100,000+ Chess Puzzles** — Curated from the Lichess puzzle database, rated Easy (800) to Grandmaster (2800+)
- **x402 Payments** — OKX Agent Payments Protocol standard, pay-per-call
- **Instant Rewards** — Automatic USDT payout on correct solutions
- **Game Expiration** — 10-minute time limit per puzzle
- **Web Dashboard** — Track solved puzzles, win rate, streak, and earnings
- **Game Replay** — Animated move-by-move replay for every solved/failed puzzle
- **Leaderboard** — Compete with other solvers
- **Slideshow Mode** — Auto-rotating puzzle display on landing page
- **Scroll Animations** — Interactive scroll-triggered animations throughout the UI
- **Mobile Responsive** — Fully responsive design for all screen sizes
- **Rate Limited** — 100 requests per minute per IP

---

## Tech Stack

| Layer | Technology |
|---|---|
| Agent Framework | [Onchain OS](https://github.com/okx/onchainos-skills) |
| Backend | Node.js, Express, TypeScript |
| Chess Engine | [chess.js](https://github.com/jhlywa/chess.js) (FEN, PGN, move validation) |
| Puzzle Database | [Lichess Open Database](https://database.lichess.org/#puzzles) (100K puzzles, SQLite via sql.js) |
| Payment Protocol | x402 (OKX Agent Payments Protocol) |
| Rewards | OKX Agentic Wallet (USDT on XLayer, chain 196) |
| Frontend | Next.js 14, TailwindCSS, react-chessboard |
| Hosting | Ubuntu VPS, PM2 process manager |
| CI/CD | GitHub Actions (typecheck + auto-deploy) |

---

## Pricing & Rewards

| Difficulty | Rating Range | Entry Fee | Reward |
|---|---|---|---|
| Easy | 800–1200 | 0.5 USDT | 0.3 USDT |
| Medium | 1200–1700 | 0.5 USDT | 1.0 USDT |
| Hard | 1700–2200 | 1.0 USDT | 3.0 USDT |
| Grandmaster | 2200+ | 2.0 USDT | 10.0 USDT |

Entry fees fund the reward pool. Profitability scales with solve rates (lower difficulties profit from failed attempts).

---

## API Endpoints

### `POST /v1/puzzle`

Request a chess puzzle. Returns **HTTP 402** with an x402 payment challenge.

**Request:**
```json
{
  "difficulty": "medium",
  "user_address": "0x..."
}
```

**Response (402):**
```json
{
  "error": "payment_required",
  "payment": {
    "version": "x402-v2",
    "accepts": [{
      "scheme": "exact",
      "network": "xlayer",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "amount": "500000",
      "payTo": "0x...",
      "chainId": 196
    }]
  },
  "puzzle_preview": {
    "puzzle_id": "...",
    "difficulty": "medium",
    "total_moves": 5,
    "reward": 1.0
  }
}
```

The agent's OKX Payments Protocol handler automatically decodes the `PAYMENT-REQUIRED` header, prompts the user, signs the payment, and replays the request.

### `POST /v1/puzzle/confirm`

Confirm payment and receive the puzzle.

**Request:**
```json
{
  "puzzle_id": "...",
  "user_address": "0x...",
  "payment_tx": "0x..."
}
```

**Response:**
```json
{
  "game_id": "uuid",
  "fen": "r1bqkb1r/pppp1ppp/...",
  "difficulty": "medium",
  "reward": 1.0,
  "total_moves": 5,
  "entry_fee": 0.5,
  "status": "active",
  "expires_at": "2026-07-09T12:00:00.000Z"
}
```

### `POST /v1/solve`

Submit a solution. Moves can be in **UCI** (`d2d4`) or **SAN** (`d4`) format.

**Request:**
```json
{
  "game_id": "uuid",
  "solution": "Qxd4 Nxe6 fxe6 Qxd4",
  "user_address": "0x..."
}
```

**Response (solved):**
```json
{
  "status": "solved",
  "correct": true,
  "reward": 1.0,
  "message": "Correct! Reward is being sent to your wallet.",
  "solution": ["Qxd4", "Nxe6", "fxe6", "Qxd4"]
}
```

**Response (failed):**
```json
{
  "status": "failed",
  "correct": false,
  "message": "Incorrect solution. Try again with a new puzzle.",
  "your_moves": ["e5"],
  "expected_first_moves": ["f3d3"],
  "hint": "The correct first move was: f3d3"
}
```

**Response (illegal move):**
```json
{
  "status": "illegal",
  "correct": false,
  "message": "\"Kf3\" is not a legal move in this position.",
  "illegal_move": "Kf3",
  "legal_moves_so_far": []
}
```

**Response (expired):**
```json
{
  "error": "game_expired",
  "message": "Time limit exceeded. The puzzle has expired."
}
```

### `POST /v1/cleanup`

Mark all expired active games as expired. Useful as a cron job.

### `GET /v1/games/:userAddress`

Get puzzle history for a user.

### `GET /v1/leaderboard`

Get top solvers ranked by puzzles solved and earnings.

### `GET /v1/stats/:userAddress`

Get stats and recent games for a specific user.

### `GET /v1/game/:gameId`

Get full game detail with puzzle FEN and solution moves.

### `GET /v1/health`

Health check — returns puzzle counts per difficulty.

---

## Example Agent Interaction

**User tells their agent:**
> "Find me a chess puzzle on MateinX, difficulty medium"

**Agent's internal flow:**
1. Calls `POST /v1/puzzle` → gets HTTP 402 with payment challenge
2. Presents to user: *"This puzzle costs 0.5 USDT. Pay?"*
3. User confirms → agent signs via x402
4. Calls `POST /v1/puzzle/confirm` → receives FEN position
5. Renders board: *"Here's your puzzle. Reward: 1 USDT. What's your move?"*
6. User plays moves → agent calls `POST /v1/solve`
7. If correct: *"Solved! +1 USDT sent to your wallet."*
8. If wrong: *"Not quite. The first move was f3d3."*

---

## Security

- **Rate limiting**: 100 requests/minute per IP (express-rate-limit)
- **Command injection prevention**: `execFileSync` with args array (not shell string)
- **Payment simulation**: `sim_` prefix only accepted in development mode
- **Game expiration**: 10-minute auto-expiry per puzzle
- **CORS**: Configured per environment
- **Input validation**: All endpoints validate required fields and difficulty levels

---

## Project Structure

```
mateinX/
├── backend/
│   └── src/
│       ├── api/routes.ts        # Express API routes
│       ├── chess/engine.ts      # Chess puzzle generation & validation
│       ├── db/
│       │   ├── index.ts         # SQLite database (sql.js)
│       │   ├── games.ts         # Game CRUD
│       │   ├── leaderboard.ts   # Leaderboard operations
│       │   └── puzzles.ts       # Puzzle selection & metadata
│       ├── payments/x402.ts     # x402 payment challenge handler
│       ├── rewards/dispatcher.ts# Reward distribution (onchainos CLI)
│       ├── config.ts            # Environment configuration
│       ├── seed.ts              # Lichess puzzle database seeder
│       └── index.ts             # Express server entry
├── frontend/
│   └── src/
│       ├── app/                 # Next.js 14 pages (App Router)
│       │   ├── page.tsx         # Landing page (hero + slideshow + sections)
│       │   ├── dashboard/       # User dashboard
│       │   ├── leaderboard/     # Leaderboard
│       │   └── games/[id]/      # Game detail with move replay
│       ├── components/
│       │   ├── Navbar.tsx       # Scroll-aware navigation
│       │   ├── ChessBoard.tsx   # Chess board wrapper
│       │   ├── PuzzleSlideshow.tsx  # Auto-rotating puzzle display
│       │   ├── PuzzleView.tsx   # Interactive puzzle solver
│       │   ├── ScrollReveal.tsx # Scroll-triggered animations
│       │   └── InitialLoader.tsx# Loading screen with image preload
│       └── app/globals.css      # Terminal-themed design system
├── .github/workflows/
│   ├── ci.yml                   # Type check CI
│   └── deploy.yml               # Auto-deploy to VPS
└── README.md
```

---

## Getting Started (Register as ASP)

To register MateinX as an ASP on OKX.AI:

```bash
npx skills add okx/onchainos-skills --yes -g
```

Then tell your agent:

```
Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS
```

Provide:
- **Name:** MateinX
- **Description:** Solve chess puzzles and earn USDT rewards
- **Endpoint:** `http://<your-server-ip>:3006`
- **Pricing:** Fixed per-call (entry fee: 0.5 USDT)

Once registered, list your ASP:

```
Help me list my ASP on OKX.AI using Onchain OS
```

---

## Local Development

```bash
# Clone
git clone git@github.com:youvandra/mateinX.git
cd mateinX

# Backend
cd backend
cp .env.example .env
npm install
npm run seed       # seeds 100K+ sample puzzles
npm run dev        # starts on port 3006

# Frontend (separate terminal)
cd frontend
npm install
npm run dev        # starts on port 3007
```

Requires Node.js 20+ and a running OKX Agentic Wallet session for reward payments.

---

## License

MIT
