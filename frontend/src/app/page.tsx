export default function Home() {
  return (
    <div>
      {/* Hero — Full Viewport */}
      <section
        className="relative min-h-screen flex items-center border-b border-terminal-200"
        style={{
          backgroundImage: 'url(/Hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
          <img src="/Logo.svg" alt="mateinX" className="h-16 w-16 mb-6" />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-terminal-900 leading-tight">
            Solve Chess Puzzles,<br />
            <span className="text-terminal-600">Earn Crypto Rewards</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-terminal-700 mt-5 max-w-3xl leading-relaxed">
            An Agentic Service Provider on OKX.AI. Generate a chess puzzle at your
            chosen difficulty, find the winning sequence, and earn USDT when you
            solve it — all handled automatically through the OKX Agent Payments Protocol.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="/dashboard"
              className="inline-block px-10 py-4 bg-terminal-800 text-white text-base font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
            >
              $ start_solving
            </a>
            <a
              href="https://okx.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-10 py-4 bg-white text-terminal-800 text-base font-mono hover:bg-terminal-50 transition-colors border border-terminal-300"
            >
              $ learn_about_OKX.AI
            </a>
          </div>

          <div className="flex flex-wrap gap-3 mt-10 text-base font-mono">
            <span className="border border-terminal-300 px-4 py-2 text-terminal-600 bg-white/80">
              100,000+ puzzles
            </span>
            <span className="border border-terminal-300 px-4 py-2 text-terminal-600 bg-white/80">
              x402 payments
            </span>
            <span className="border border-terminal-300 px-4 py-2 text-terminal-600 bg-white/80">
              instant USDT rewards
            </span>
            <span className="border border-terminal-300 px-4 py-2 text-terminal-600 bg-white/80">
              open on OKX.AI
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-terminal-200">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-mono text-terminal-400 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-terminal-900">
              Play. Solve. Earn.
            </h2>
            <p className="text-terminal-600 mt-3 text-lg max-w-2xl mx-auto">
              Three simple steps to start earning USDT with your chess skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-terminal-200 bg-white p-10 text-center">
              <div className="w-14 h-14 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-terminal-700">01</span>
              </div>
              <h3 className="text-xl font-bold text-terminal-900 mb-4">Pick Your Difficulty</h3>
              <p className="text-terminal-600 leading-relaxed">
                Choose from Easy, Medium, Hard, or Grandmaster. Higher difficulty means
                bigger rewards.
              </p>
            </div>

            <div className="border border-terminal-200 bg-white p-10 text-center">
              <div className="w-14 h-14 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-terminal-700">02</span>
              </div>
              <h3 className="text-xl font-bold text-terminal-900 mb-4">Solve the Puzzle</h3>
              <p className="text-terminal-600 leading-relaxed">
                Pay a small entry fee via the OKX Agent Payments Protocol. Find the
                winning move sequence and submit your solution.
              </p>
            </div>

            <div className="border border-terminal-200 bg-white p-10 text-center">
              <div className="w-14 h-14 border border-terminal-300 bg-terminal-50 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-terminal-700">03</span>
              </div>
              <h3 className="text-xl font-bold text-terminal-900 mb-4">Get Rewarded</h3>
              <p className="text-terminal-600 leading-relaxed">
                Solve it correctly and USDT is automatically sent to your wallet.
                Wrong? Try a new puzzle — no hard feelings.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/dashboard"
              className="inline-block px-10 py-4 bg-terminal-800 text-white text-base font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
            >
              $ start_solving
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-terminal-200 bg-terminal-50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-terminal-900">100K+</p>
              <p className="text-terminal-600 text-base font-mono mt-2">curated puzzles</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-terminal-900">x402</p>
              <p className="text-terminal-600 text-base font-mono mt-2">payment protocol</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-terminal-900">USDT</p>
              <p className="text-terminal-600 text-base font-mono mt-2">instant rewards</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-terminal-900">Open</p>
              <p className="text-terminal-600 text-base font-mono mt-2">on OKX.AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-terminal-900">
            Ready to Play?
          </h2>
          <p className="text-terminal-600 mt-4 text-lg max-w-2xl mx-auto">
            Connect your XLayer wallet and start solving puzzles. Every correct
            solution earns USDT directly to your wallet.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a
              href="/dashboard"
              className="inline-block px-10 py-4 bg-terminal-800 text-white text-base font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
            >
              $ go_to_dashboard
            </a>
            <a
              href="/leaderboard"
              className="inline-block px-10 py-4 bg-white text-terminal-800 text-base font-mono hover:bg-terminal-50 transition-colors border border-terminal-300"
            >
              $ view_leaderboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
