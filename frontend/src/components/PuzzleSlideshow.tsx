'use client';

import { useEffect, useState, useRef } from 'react';
import { Chessboard } from 'react-chessboard';

interface PuzzleSlide {
  id: string;
  fen: string;
}

export default function PuzzleSlideshow() {
  const [slides, setSlides] = useState<PuzzleSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [boardWidth, setBoardWidth] = useState(480);
  const fetching = useRef(false);

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('slideshow-container');
      if (container) {
        const width = Math.min(container.offsetWidth, 480);
        setBoardWidth(width);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const fetchNext = async () => {
    if (fetching.current) return;
    fetching.current = true;

    try {
      const res = await fetch(`${base}/v1/puzzle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'easy', user_address: 'slideshow' }),
      });

      if (res.status === 402) {
        const body = await res.json();
        const pid = body.puzzle_preview?.puzzle_id;

        const confirmRes = await fetch(`${base}/v1/puzzle/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            puzzle_id: pid,
            user_address: 'slideshow',
            payment_tx: `sim_slide_${Date.now()}`,
          }),
        });
        const data = await confirmRes.json();

        if (data.fen) {
          setSlides(prev => {
            const next = [...prev, { id: pid, fen: data.fen }];
            return next.slice(-10);
          });
        }
      }
    } catch {
      // silent
    } finally {
      fetching.current = false;
    }
  };

  useEffect(() => {
    fetchNext();
    const interval = setInterval(() => {
      setAnimate(true);
      setCurrent(prev => {
        const nextIdx = prev + 1;
        if (nextIdx >= 8) fetchNext();
        return nextIdx;
      });
      setTimeout(() => setAnimate(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: boardWidth }}>
        <p className="text-terminal-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  const slide = slides[current % Math.max(slides.length, 1)];

  return (
    <div id="slideshow-container" className="w-full max-w-[480px] mx-auto">
      <div
        className={animate ? 'animate-swap' : ''}
        onAnimationEnd={() => setAnimate(false)}
      >
        <Chessboard
          id="puzzle-slideshow"
          position={slide.fen}
          boardWidth={boardWidth}
          arePiecesDraggable={false}
          customBoardStyle={{ borderRadius: '0px' }}
          customDarkSquareStyle={{ backgroundColor: '#b58863' }}
          customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        />
      </div>
      <style>{`
        .animate-swap {
          animation: pieceSwap 0.4s ease-out;
        }
        @keyframes pieceSwap {
          0% { filter: saturate(0.3); }
          50% { filter: saturate(1.3); }
          100% { filter: saturate(1); }
        }
      `}</style>
    </div>
  );
}
