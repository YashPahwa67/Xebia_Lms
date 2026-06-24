import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#6C1D5F', '#84117C', '#01AC9F', '#FF6200', '#B8AFCF'];

// quick confetti burst, no library needed
export function Confetti({ count = 80 }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 0.2,
        dur: 1.6 + Math.random() * 1.2,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] flex justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-5%]"
          style={{ width: p.size, height: p.size * 0.6, background: p.color, borderRadius: 2 }}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: p.x, rotate: p.rot, opacity: [1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
