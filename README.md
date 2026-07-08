# MateinX ♟

**Solve chess puzzles. Earn crypto rewards.**

MateinX is an [Agentic Service Provider (ASP)](https://www.okx.ai/tutorial/asp) on the [OKX.AI](https://www.okx.ai) platform. It generates chess puzzles on demand — users pay a small entry fee via the OKX Agent Payments Protocol (x402) to receive a puzzle, and if they solve it correctly, the reward is automatically sent to their wallet.

Built for the [OKX.AI Genesis Hackathon](https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon).

---

## How It Works

```
User's Agent                    MateinX API
     │                              │
     │  POST /v1/puzzle             │
     │  ──────────────────────────► │
     │  ◄───────────────────── 402  │  Payment Required
     │         (x402 challenge)     │
     │                              │
     │  Pays via OKX Agent          │
     │  Payments Protocol           │
     │                              │
     │  POST /v1/puzzle/confirm     │
     │  ──────────────────────────► │
     │  ◄─────────────────── Puzzle │  FEN + Moves
     │         (game_id, reward)    │
     │                              │
     │  POST /v1/solve              │
     │  (user submits solution)     │
     │  ──────────────────────────► │
     │  ◄──────── Solved / Failed   │
     │         + reward TX if win   │
```

1. Your agent calls the MateinX API and receives an **HTTP 402** payment challenge
2. The OKX Agent Payments Protocol handles the entry fee automatically
3. MateinX generates a chess puzzle matched to your chosen difficulty
4. Solve it by submitting your moves through your agent
5. **Correct solution** → reward is sent to your XLayer wallet
6. **Wrong solution** → try again with a new puzzle

---

## Features

- **100,000+ Chess Puzzles** — Curated from the Lichess puzzle database, rated from Easy (800) to Grandmaster (2800+)
- **x402 Payments** — Seamless pay-per-call via OKX's Agent Payments Protocol
- **Instant Rewards** — Automatic USDT payout on correct solutions
- **Web Dashboard** — Track your solved puzzles, win rate, streak, and earnings
- **Leaderboard** — Compete with other solvers
- **A2MCP** — Standardized MCP/API service, registered on OKX.AI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Agent Framework | [Onchain OS](https://github.com/okx/onchainos-skills) |
| Backend | Node.js, Express, TypeScript |
| Chess Engine | [chess.js](https://github.com/jhlywa/chess.js) (FEN, PGN, validation) |
| Puzzle Database | [Lichess Open Database](https://database.lichess.org/#puzzles) (100K curated puzzles) |
| Payment Protocol | x402 (OKX Agent Payments Protocol) |
| Rewards | OKX Agentic Wallet (USDT on XLayer) |
| Frontend | Next.js, TailwindCSS, react-chessboard |
| Storage | SQLite (via sql.js) |
| Hosting | VPS, PM2 process manager |

---

## API Endpoints

### `POST /v1/puzzle`

Request a chess puzzle. Returns HTTP 402 with a payment challenge.

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
    "accepts": [
      {
        "scheme": "exact",
        "network": "xlayer",
        "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
        "amount": "500000",
        "payTo": "0x...",
        "chainId": 196
      }
    ]
  },
  "puzzle_preview": {
    "puzzle_id": "...",
    "difficulty": "medium",
    "total_moves": 5,
    "reward": 1.0
  }
}
```

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
  "status": "active"
}
```

### `POST /v1/solve`

Submit your solution.

**Request:**
```json
{
  "game_id": "uuid",
  "solution": "e5 Nf3 Nc6",
  "user_address": "0x..."
}
```

**Response (solved):**
```json
{
  "status": "solved",
  "correct": true,
  "reward": 1.0,
  "message": "Correct! Reward is being sent to your wallet."
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

### `GET /v1/games/:userAddress`

Get puzzle history for a user.

### `GET /v1/leaderboard`

Get top solvers ranked by puzzles solved and earnings.

### `GET /v1/stats/:userAddress`

Get stats for a specific user.

### `GET /v1/health`

Health check endpoint.

---

## Getting Started (Register as ASP)

To register MateinX as an ASP on OKX.AI, you need an AI coding agent with [Onchain OS](https://github.com/okx/onchainos-skills) installed:

```bash
# 1. Install Onchain OS
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
- **Pricing:** Fixed per-call (entry fee varies by difficulty)

Once registered, list your ASP:

```
Help me list my ASP on OKX.AI using Onchain OS
```

---

## Categories

MateinX is eligible for these hackathon categories:

| Category | Why MateinX Fits |
|---|---|
| **Creative Genius** | Novel concept — chess puzzles with crypto rewards |
| **Software Utility** | Provides a useful service (chess training + skill challenge) |
| **Best Product** | Full-stack product with web dashboard, API, and agent integration |
| **Social Buzz** | Competitive leaderboard, shareable puzzle results |
| **Revenue Rocket** | Pay-per-puzzle model with potential for revenue |

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
npm run seed    # seeds sample puzzles
npm run dev     # starts on port 3006

# Frontend (separate terminal)
cd frontend
npm install
npm run dev     # starts on port 3007
```

---

## License

MIT
