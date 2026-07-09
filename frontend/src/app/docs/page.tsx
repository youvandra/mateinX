export default function Docs() {
  return (
    <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <img src="/Logo.svg" alt="" className="h-6 w-6" />
        <h1 className="text-xl font-bold text-terminal-900">Documentation</h1>
      </div>

      <nav className="mb-10 flex flex-wrap gap-2 text-xs font-mono border-b border-terminal-200 pb-4">
        {['Overview', 'Architecture', 'API', 'Integration', 'Pricing', 'FAQ'].map((s) => (
          <a key={s} href={`#${s.toLowerCase()}`} className="px-3 py-1.5 border border-terminal-200 hover:bg-terminal-100 transition-colors">
            {s}
          </a>
        ))}
      </nav>

      {/* Overview */}
      <section id="overview" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">Overview</h2>
        <p className="text-terminal-600 text-sm leading-relaxed mb-4">
          MateinX is an <strong className="text-terminal-800">Agentic Service Provider (ASP)</strong> registered on the OKX.AI platform.
          It provides an A2MCP (Agent-to-MCP) service that generates chess puzzles on demand.
          AI agents call the API, pay a small entry fee via the OKX Agent Payments Protocol (x402),
          receive a puzzle position, and submit a solution. Correct solutions earn USDT rewards
          automatically.
        </p>
        <p className="text-terminal-600 text-sm leading-relaxed">
          Built for the <a href="https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon" className="text-terminal-800 underline" target="_blank" rel="noreferrer">OKX.AI Genesis Hackathon</a>.
        </p>
      </section>

      {/* Architecture */}
      <section id="architecture" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">Architecture</h2>

        <div className="border border-terminal-200 bg-terminal-50 p-4 mb-4 overflow-x-auto">
          <pre className="text-[10px] leading-relaxed font-mono text-terminal-700 whitespace-pre">
{`┌─────────────────────────────────────────────────────┐
│                    OKX.AI Platform                     │
│  ┌──────────┐    ┌──────────────┐    ┌────────────┐  │
│  │  User's   │───▶│  MateinX     │───▶│  XLayer    │  │
│  │  Agent    │◄───│  ASP (A2MCP) │◄───│  (Chain    │  │
│  │           │    │              │    │   196)     │  │
│  └──────────┘    └──────────────┘    └────────────┘  │
│       │                │                                │
│       │  POST /v1/     │  HTTP 402 +                     │
│       │  puzzle        │  x402 challenge                  │
│       ├────────────────▶│                                │
│       │                │                                │
│       │  x402 payment  │                                │
│       │────────────────▶│                                │
│       │                │                                │
│       │  POST /v1/     │                                │
│       │  puzzle/       │                                │
│       │  confirm       │                                │
│       ├────────────────▶│                                │
│       │◄───────────────│  FEN + game_id                  │
│       │                │                                │
│       │  POST /v1/     │                                │
│       │  solve         │                                │
│       ├────────────────▶│                                │
│       │◄───────────────│  Solved/Failed + reward TX      │
│       │                │                                │
└─────────────────────────────────────────────────────┘`}</pre>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="border border-terminal-200 p-4">
            <div className="text-xs font-mono text-terminal-400 mb-1">Backend</div>
            <div className="font-semibold text-terminal-800">Node.js + Express</div>
            <div className="text-terminal-600 text-xs mt-1">TypeScript, REST API, SQLite</div>
          </div>
          <div className="border border-terminal-200 p-4">
            <div className="text-xs font-mono text-terminal-400 mb-1">Frontend</div>
            <div className="font-semibold text-terminal-800">Next.js + TailwindCSS</div>
            <div className="text-terminal-600 text-xs mt-1">react-chessboard, chess.js</div>
          </div>
          <div className="border border-terminal-200 p-4">
            <div className="text-xs font-mono text-terminal-400 mb-1">Payments</div>
            <div className="font-semibold text-terminal-800">OKX x402 Protocol</div>
            <div className="text-terminal-600 text-xs mt-1">USDT on XLayer (chain 196)</div>
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">API Reference</h2>
        <p className="text-terminal-600 text-sm mb-4">
          Base URL: <code className="bg-terminal-100 px-1.5 py-0.5 text-xs font-mono">http://43.134.86.221:3006</code>
        </p>

        {/* POST /v1/puzzle */}
        <div className="border border-terminal-200 mb-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-terminal-50 border-b border-terminal-200">
            <span className="text-xs font-mono bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">POST</span>
            <code className="text-xs font-mono text-terminal-800">/v1/puzzle</code>
            <span className="text-[10px] text-terminal-400 ml-auto font-mono">Request a puzzle</span>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div>
              <div className="font-mono text-terminal-500 mb-1">Request Body</div>
              <pre className="bg-terminal-50 border border-terminal-200 p-2 text-[10px] font-mono text-terminal-700 overflow-x-auto">{JSON.stringify({ difficulty: "medium", user_address: "0x..." }, null, 2)}</pre>
            </div>
            <div>
              <div className="font-mono text-terminal-500 mb-1">Response — HTTP 402</div>
              <pre className="bg-terminal-50 border border-terminal-200 p-2 text-[10px] font-mono text-terminal-700 overflow-x-auto">{`HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: <base64-encoded x402 challenge>

{
  "error": "payment_required",
  "payment": {
    "version": "x402-v2",
    "accepts": [{
      "scheme": "exact",
      "network": "xlayer",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "amount": "500000",
      "payTo": "0x08d3...1275",
      "chainId": 196
    }]
  },
  "puzzle_preview": {
    "puzzle_id": "<id>",
    "difficulty": "medium",
    "total_moves": 5,
    "reward": 1.0
  }
}`}</pre>
            </div>
          </div>
        </div>

        {/* POST /v1/puzzle/confirm */}
        <div className="border border-terminal-200 mb-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-terminal-50 border-b border-terminal-200">
            <span className="text-xs font-mono bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">POST</span>
            <code className="text-xs font-mono text-terminal-800">/v1/puzzle/confirm</code>
            <span className="text-[10px] text-terminal-400 ml-auto font-mono">Confirm payment, receive puzzle</span>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div>
              <pre className="bg-terminal-50 border border-terminal-200 p-2 text-[10px] font-mono text-terminal-700 overflow-x-auto">{JSON.stringify({ puzzle_id: "<id>", user_address: "0x...", payment_tx: "0x..." }, null, 2)}</pre>
            </div>
            <div>
              <pre className="bg-terminal-50 border border-terminal-200 p-2 text-[10px] font-mono text-terminal-700 overflow-x-auto">{`{
  "game_id": "uuid",
  "fen": "r1bqkb1r/pppp1ppp/...",
  "difficulty": "medium",
  "reward": 1.0,
  "total_moves": 5,
  "entry_fee": 0.5,
  "status": "active",
  "expires_at": "2026-07-09T12:00:00Z"
}`}</pre>
            </div>
          </div>
        </div>

        {/* POST /v1/solve */}
        <div className="border border-terminal-200 mb-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-terminal-50 border-b border-terminal-200">
            <span className="text-xs font-mono bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">POST</span>
            <code className="text-xs font-mono text-terminal-800">/v1/solve</code>
            <span className="text-[10px] text-terminal-400 ml-auto font-mono">Submit solution</span>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div>
              <pre className="bg-terminal-50 border border-terminal-200 p-2 text-[10px] font-mono text-terminal-700 overflow-x-auto">{JSON.stringify({ game_id: "uuid", solution: "Qxd4 Nxe6 fxe6 Qxd4", user_address: "0x..." }, null, 2)}</pre>
              <p className="text-terminal-400 mt-1">Supports both UCI (<code className="bg-terminal-100 px-1">d2d4</code>) and SAN (<code className="bg-terminal-100 px-1">d4</code>) move formats.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="border border-green-200 bg-green-50 p-2">
                <div className="text-[10px] font-mono text-green-700 font-medium">Solved</div>
                <pre className="text-[10px] font-mono text-green-800 mt-1">{`{"status":"solved","correct":true,"reward":1.0,"message":"Correct! Reward sent."}`}</pre>
              </div>
              <div className="border border-red-200 bg-red-50 p-2">
                <div className="text-[10px] font-mono text-red-700 font-medium">Failed</div>
                <pre className="text-[10px] font-mono text-red-800 mt-1">{`{"status":"failed","correct":false,"hint":"The correct first move was: f3d3"}`}</pre>
              </div>
              <div className="border border-yellow-200 bg-yellow-50 p-2">
                <div className="text-[10px] font-mono text-yellow-700 font-medium">Illegal Move</div>
                <pre className="text-[10px] font-mono text-yellow-800 mt-1">{`{"status":"illegal","message":"\"Kf3\" is not legal"}`}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="border border-terminal-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1 py-0.5">GET</span>
              <code className="font-mono text-terminal-800">/v1/games/:userAddress</code>
            </div>
            <p className="text-terminal-500">Game history for a user</p>
          </div>
          <div className="border border-terminal-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1 py-0.5">GET</span>
              <code className="font-mono text-terminal-800">/v1/leaderboard</code>
            </div>
            <p className="text-terminal-500">Top solvers ranking</p>
          </div>
          <div className="border border-terminal-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1 py-0.5">GET</span>
              <code className="font-mono text-terminal-800">/v1/stats/:userAddress</code>
            </div>
            <p className="text-terminal-500">Stats and recent games</p>
          </div>
          <div className="border border-terminal-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1 py-0.5">GET</span>
              <code className="font-mono text-terminal-800">/v1/game/:gameId</code>
            </div>
            <p className="text-terminal-500">Full game with puzzle data</p>
          </div>
          <div className="border border-terminal-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1 py-0.5">GET</span>
              <code className="font-mono text-terminal-800">/v1/health</code>
            </div>
            <p className="text-terminal-500">Health check + puzzle counts</p>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section id="integration" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">Agent Integration</h2>
        <p className="text-terminal-600 text-sm leading-relaxed mb-4">
          MateinX is an A2MCP service. Any AI agent with Onchain OS installed
          can call the API. The agent handles the x402 payment flow automatically.
        </p>

        <h3 className="text-sm font-bold text-terminal-800 mb-2">Register as ASP</h3>
        <div className="border border-terminal-200 bg-terminal-50 p-3 mb-4">
          <pre className="text-[10px] font-mono text-terminal-700 overflow-x-auto">{`# Install Onchain OS
npx skills add okx/onchainos-skills --yes -g

# Then tell your agent:
"Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS"`}</pre>
        </div>

        <h3 className="text-sm font-bold text-terminal-800 mb-2">Agent Flow Example</h3>
        <div className="border border-terminal-200 bg-terminal-50 p-3">
          <pre className="text-[10px] font-mono text-terminal-700 overflow-x-auto whitespace-pre">{`1. User: "Find me a chess puzzle"
2. Agent: POST /v1/puzzle
3. Agent: Receives HTTP 402 (payment required)
4. User: "Pay 0.5 USDT" → Agent signs via x402
5. Agent: POST /v1/puzzle/confirm → receives FEN position
6. Agent: Renders board → "What's your move?"
7. User: Submits solution
8. Agent: POST /v1/solve → "Solved! +1 USDT"`}</pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">Pricing &amp; Rewards</h2>
        <div className="border border-terminal-200 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-terminal-200 bg-terminal-50 text-terminal-600">
                <th className="text-left p-3 font-medium">Difficulty</th>
                <th className="text-left p-3 font-medium">Rating Range</th>
                <th className="text-right p-3 font-medium">Entry Fee</th>
                <th className="text-right p-3 font-medium">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-100 text-terminal-700">
              <tr><td className="p-3">Easy</td><td className="p-3">800–1200</td><td className="p-3 text-right">0.5 USDT</td><td className="p-3 text-right text-green-600">0.3 USDT</td></tr>
              <tr><td className="p-3">Medium</td><td className="p-3">1200–1700</td><td className="p-3 text-right">0.5 USDT</td><td className="p-3 text-right text-green-600">1.0 USDT</td></tr>
              <tr><td className="p-3">Hard</td><td className="p-3">1700–2200</td><td className="p-3 text-right">1.0 USDT</td><td className="p-3 text-right text-green-600">3.0 USDT</td></tr>
              <tr><td className="p-3">Grandmaster</td><td className="p-3">2200+</td><td className="p-3 text-right">2.0 USDT</td><td className="p-3 text-right text-green-600">10.0 USDT</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-terminal-500 text-xs mt-2">Entry fees fund the reward pool. Higher difficulties have lower solve rates but bigger payouts.</p>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-12">
        <h2 className="text-lg font-bold text-terminal-900 mb-3">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "What is an A2MCP service?", a: "A2MCP (Agent-to-MCP) is a standardized API service on OKX.AI. AI agents call the endpoint directly, pay per request via the x402 protocol, and receive data — no negotiation needed." },
            { q: "Does my agent need Onchain OS?", a: "Yes. The agent must have Onchain OS installed to handle the x402 payment flow. Agents without it cannot process HTTP 402 responses." },
            { q: "What format should moves be in?", a: "Both UCI (e.g. d2d4) and SAN (e.g. d4) formats are accepted. The system uses chess.js to validate moves on the board, so any legal notation works." },
            { q: "What happens if my game expires?", a: "Each game has a 10-minute time limit. If no solution is submitted within that window, the game becomes expired and cannot be solved. The entry fee is retained." },
            { q: "How are rewards paid?", a: "Rewards are sent from the MateinX agent wallet to your wallet via the OKX Agentic Wallet system. Both wallets are on XLayer (chain 196)." },
            { q: "Is MateinX open source?", a: "Yes. The full source code is available at github.com/youvandra/mateinX." },
          ].map((faq) => (
            <div key={faq.q} className="border border-terminal-200 p-4">
              <div className="text-sm font-semibold text-terminal-800 mb-1">{faq.q}</div>
              <div className="text-xs text-terminal-600 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-terminal-200 pt-6 text-center text-xs text-terminal-400 font-mono">
        <p>MateinX · Agentic Service Provider on OKX.AI</p>
        <p className="mt-1">
          <a href="https://github.com/youvandra/mateinX" className="underline hover:text-terminal-600" target="_blank" rel="noreferrer">GitHub</a>
          <span className="mx-2">·</span>
          <a href="https://okx.ai/agents" className="underline hover:text-terminal-600" target="_blank" rel="noreferrer">OKX.AI</a>
        </p>
      </div>
    </div>
  );
}
