'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import PuzzleSlideshow from '@/components/PuzzleSlideshow';

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref} className="text-3xl font-bold text-terminal-900">{count.toLocaleString()}{suffix}</div>;
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function PuzzleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.241.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M15 9.5c0-.83-.67-1.5-1.5-1.5h-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5" />
    </svg>
  );
}

function StepCard({ num, title, desc, icon: Icon, delay }: { num: string; title: string; desc: string; icon: React.ComponentType<{ className?: string }>; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal delay={delay}>
      <div
        className="relative border border-terminal-200 bg-white p-8 h-full cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terminal-800 to-terminal-400 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`w-16 h-16 mb-4 transition-all duration-500 ${hovered ? 'scale-110 rotate-6' : ''}`}>
          <Icon className="w-full h-full text-terminal-700" />
        </div>
        <div className="text-xs font-mono text-terminal-400 mb-2">STEP {num}</div>
        <h3 className="text-lg font-bold text-terminal-900 mb-3">{title}</h3>
        <p className="text-terminal-600 text-sm leading-relaxed">{desc}</p>
        <div className={`absolute bottom-4 right-4 text-2xl font-bold text-terminal-100 transition-all duration-500 ${hovered ? 'text-terminal-200 scale-110' : ''}`}>
          {num}
        </div>
      </div>
    </ScrollReveal>
  );
}

function FloatingPiece({ piece, delay, left }: { piece: string; delay: number; left: string }) {
  return (
    <div
      className="absolute text-4xl opacity-10 pointer-events-none select-none"
      style={{
        left,
        animation: `floatPiece 6s ease-in-out ${delay}s infinite`,
      }}
    >
      {piece}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/Hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-terminal-900 leading-tight">
              Solve Chess Puzzles,<br />
              <span className="text-terminal-600">Earn Crypto Rewards</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-terminal-700 mt-6 sm:mt-10 leading-relaxed">
              An Agentic Service Provider (ASP) on OKX.AI. Generate a chess puzzle at your
              chosen difficulty, find the winning sequence, and earn USDT when you
              solve it — all handled automatically through the OKX Agent Payments Protocol.
            </p>

            <div className="flex flex-wrap gap-3 mt-8 sm:mt-16">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-terminal-800 text-white text-xs sm:text-sm font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
              >
                <span></span> Start Solving
              </a>
              <a
                href="https://okx.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-terminal-800 text-xs sm:text-sm font-mono hover:bg-terminal-50 transition-colors border border-terminal-300"
              >
                <span>→</span> Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Now — Puzzle Slideshow */}
      <section className="border-b border-terminal-200 overflow-hidden">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-xs font-mono text-terminal-400 uppercase tracking-widest mb-2">Try It Now</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-terminal-900 leading-tight">
                  Puzzles in Action
                </h2>
                <p className="text-sm sm:text-base text-terminal-600 mt-4 leading-relaxed">
                  Watch real chess puzzles cycle automatically. Each position
                  is a challenge from our database — hand-picked for difficulty
                  and quality.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-terminal-800 text-white text-xs sm:text-sm font-mono hover:bg-terminal-700 transition-colors border border-terminal-800"
                  >
                    ♟ Start Solving
                  </a>
                </div>
              </div>
              <div className="flex justify-center">
                <PuzzleSlideshow />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* How It Works — Interactive */}
      <section className="border-b border-terminal-200 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs font-mono text-terminal-400 uppercase tracking-widest mb-2">How It Works</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-terminal-900">
                Three Steps to Earn
              </h2>
              <p className="text-sm sm:text-base text-terminal-600 mt-2 max-w-xl mx-auto">
                From puzzle to payout in under a minute.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <StepCard
              num="01"
              title="Pick Your Difficulty"
              desc="Choose from Easy, Medium, Hard, or Grandmaster. Higher difficulty means bigger rewards."
              icon={TargetIcon}
              delay={0}
            />
            <StepCard
              num="02"
              title="Solve the Puzzle"
              desc="Pay a small entry fee via the OKX Agent Payments Protocol. Find the winning move sequence and submit."
              icon={PuzzleIcon}
              delay={150}
            />
            <StepCard
              num="03"
              title="Get Rewarded"
              desc="Solve correctly and USDT is sent to your wallet. Wrong? Try again — no hard feelings."
              icon={CoinIcon}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Stats — Animated Counters */}
      <section className="border-b border-terminal-200 bg-terminal-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <FloatingPiece piece="♔" delay={0} left="10%" />
          <FloatingPiece piece="♕" delay={1} left="30%" />
          <FloatingPiece piece="♖" delay={2} left="50%" />
          <FloatingPiece piece="♗" delay={3} left="70%" />
          <FloatingPiece piece="♘" delay={4} left="85%" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <AnimatedCounter target={100} suffix="K+" />
              <p className="text-xs sm:text-sm text-terminal-600 font-mono mt-1">curated puzzles</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-terminal-900">x402</div>
              <p className="text-xs sm:text-sm text-terminal-600 font-mono mt-1">payment protocol</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-terminal-900">USDT</div>
              <p className="text-xs sm:text-sm text-terminal-600 font-mono mt-1">instant rewards</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-terminal-900 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </div>
              <p className="text-xs sm:text-sm text-terminal-600 font-mono mt-1">on OKX.AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Dynamic */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terminal-50 via-white to-terminal-100" />
        <div className="absolute top-10 left-10 text-6xl sm:text-8xl opacity-5 select-none pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 text-6xl sm:text-8xl opacity-5 select-none pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-terminal-100 border border-terminal-200 rounded-full text-xs font-mono text-terminal-600 mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Ready to play?
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-terminal-900">
              Your Move.
            </h2>
            <p className="text-sm sm:text-base text-terminal-600 mt-3 max-w-xl mx-auto">
              Connect your XLayer wallet and start solving puzzles. Every correct
              solution earns USDT directly to your wallet.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6 sm:mt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-terminal-800 text-white text-xs sm:text-sm font-mono hover:bg-terminal-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-terminal-800"
              >
                ♟ Dashboard
              </a>
              <a
                href="https://okx.ai/agents"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-white text-terminal-800 text-xs sm:text-sm font-mono hover:bg-terminal-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-terminal-300"
              >
                → Try on OKX.AI
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @keyframes floatPiece {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
