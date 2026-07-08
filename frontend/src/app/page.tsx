export default function Home() {
  return (
    <div>
      {/* Hero — Full Screen */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/Hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 w-full px-8 md:px-16 py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-terminal-900 leading-tight">
              Solve Chess Puzzles,<br />
              <span className="text-terminal-600">Earn Crypto Rewards</span>
            </h1>
            <p className="text-base md:text-xl text-terminal-700 mt-4 leading-relaxed">
              An Agentic Service Provider (ASP) on OKX.AI. Generate a chess puzzle at your
              chosen difficulty, find the winning sequence, and earn USDT when you
              solve it — all handled automatically through the OKX Agent Payments Protocol.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-terminal-800 text-white text-sm font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
              >
                <span>♟</span> Start Solving
              </a>
              <a
                href="https://okx.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-terminal-800 text-sm font-mono hover:bg-terminal-50 transition-colors border border-terminal-300"
              >
                <span>→</span> Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-terminal-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-terminal-400 uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-terminal-900">
              Play. Solve. Earn.
            </h2>
            <p className="text-terminal-600 mt-2 max-w-xl mx-auto">
              Three simple steps to start earning USDT with your chess skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-terminal-200 bg-white p-8 text-center">
              <div className="w-12 h-12 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-terminal-700">01</span>
              </div>
              <h3 className="text-lg font-bold text-terminal-900 mb-3">Pick Your Difficulty</h3>
              <p className="text-terminal-600 text-sm leading-relaxed">
                Choose from Easy, Medium, Hard, or Grandmaster. Higher difficulty means
                bigger rewards.
              </p>
            </div>

            <div className="border border-terminal-200 bg-white p-8 text-center">
              <div className="w-12 h-12 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-terminal-700">02</span>
              </div>
              <h3 className="text-lg font-bold text-terminal-900 mb-3">Solve the Puzzle</h3>
              <p className="text-terminal-600 text-sm leading-relaxed">
                Pay a small entry fee via the OKX Agent Payments Protocol. Find the
                winning move sequence and submit your solution.
              </p>
            </div>

            <div className="border border-terminal-200 bg-white p-8 text-center">
              <div className="w-12 h-12 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-terminal-700">03</span>
              </div>
              <h3 className="text-lg font-bold text-terminal-900 mb-3">Get Rewarded</h3>
              <p className="text-terminal-600 text-sm leading-relaxed">
                Solve it correctly and USDT is automatically sent to your wallet.
                Wrong? Try a new puzzle — no hard feelings.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-terminal-800 text-white text-sm font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
            >
              ♟ Start Solving
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-terminal-200 bg-terminal-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-terminal-900">100K+</p>
              <p className="text-terminal-600 text-sm font-mono mt-1">curated puzzles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terminal-900">x402</p>
              <p className="text-terminal-600 text-sm font-mono mt-1">payment protocol</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terminal-900">USDT</p>
              <p className="text-terminal-600 text-sm font-mono mt-1">instant rewards</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terminal-900">Open</p>
              <p className="text-terminal-600 text-sm font-mono mt-1">on OKX.AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-terminal-900">
            Ready to Play?
          </h2>
          <p className="text-terminal-600 mt-3 max-w-xl mx-auto">
            Connect your XLayer wallet and start solving puzzles. Every correct
            solution earns USDT directly to your wallet.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-terminal-800 text-white text-sm font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
            >
              ♟ Dashboard
            </a>
            <a
              href="https://okx.ai/agents"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-terminal-800 text-sm font-mono hover:bg-terminal-50 transition-colors border border-terminal-300"
            >
              → Try on OKX.AI
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
