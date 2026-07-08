export default function Home() {
  return (
    <div>
      {/* Nav Spacer */}
      <div className="h-14" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#34d399]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 rounded-full mb-6">
              Agentic Service Provider on OKX.AI
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Solve Chess Puzzles,<br />
              <span className="text-gradient">Earn Crypto Rewards</span>
            </h1>
            <p className="text-base md:text-lg text-[#a3a3a3] mt-4 max-w-2xl leading-relaxed">
              Generate a chess puzzle at your chosen difficulty, find the winning
              sequence, and earn USDT when you solve it — all handled automatically
              through the OKX Agent Payments Protocol.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-black bg-white hover:bg-[#e5e5e5] transition-colors rounded-lg"
              >
                Start Solving
              </a>
              <a
                href="https://okx.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-[#a3a3a3] border border-[#262626] hover:border-[#404040] hover:text-white transition-colors rounded-lg"
              >
                Learn about OKX.AI
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-[#a3a3a3] mt-2 max-w-xl mx-auto">
              Three simple steps to start earning with your chess skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Pick Your Difficulty',
                desc: 'Choose from Easy, Medium, Hard, or Grandmaster. Higher difficulty means bigger rewards.',
              },
              {
                num: '02',
                title: 'Solve the Puzzle',
                desc: 'Pay a small entry fee via the OKX Agent Payments Protocol. Find the winning move sequence and submit.',
              },
              {
                num: '03',
                title: 'Get Rewarded',
                desc: 'Solve it correctly and USDT is automatically sent to your wallet. Wrong? Try again — no hard feelings.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group relative p-6 rounded-lg border border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#262626] transition-colors"
              >
                <div className="text-xs font-mono text-[#34d399] mb-3">{step.num}</div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { value: '100K+', label: 'curated puzzles' },
              { value: 'x402', label: 'payment protocol' },
              { value: 'USDT', label: 'instant rewards' },
              { value: 'Live', label: 'on OKX.AI' },
            ].map((stat) => (
              <div key={stat.value} className="text-center p-6 rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#737373] font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Play?
          </h2>
          <p className="text-[#a3a3a3] mt-2 max-w-lg mx-auto">
            Connect your XLayer wallet and start solving. Every correct solution
            earns USDT directly to your wallet.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="/dashboard"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-black bg-white hover:bg-[#e5e5e5] transition-colors rounded-lg"
            >
              Go to Dashboard
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-[#a3a3a3] border border-[#262626] hover:border-[#404040] hover:text-white transition-colors rounded-lg"
            >
              View Leaderboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
