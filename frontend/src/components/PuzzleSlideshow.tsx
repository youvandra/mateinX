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
  const [visible, setVisible] = useState(true);
  const fetching = useRef(false);

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

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
      setVisible(false);
      setTimeout(() => {
        setCurrent(prev => {
          const nextIdx = prev + 1;
          if (nextIdx >= 8) {
            fetchNext();
          }
          return nextIdx;
        });
        setVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: 480, height: 480 }}>
        <p className="text-terminal-400 text-sm font-mono">loading...</p>
      </div>
    );
  }

  const slide = slides[current % Math.max(slides.length, 1)];

  return (
    <div className="transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
      {slide && (
        <Chessboard
          id={`puzzle-slide-${slide.id}`}
          position={slide.fen}
          boardWidth={480}
          arePiecesDraggable={false}
          customBoardStyle={{ borderRadius: '0px' }}
          customDarkSquareStyle={{ backgroundColor: '#739552' }}
          customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
        />
      )}
    </div>
  );
}
