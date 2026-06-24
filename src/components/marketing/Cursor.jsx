import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Custom cursor: small dot + a ring that trails behind and grows on hover.
// Only on desktop / fine pointers, skipped for touch and reduced motion.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, label');
      setHovering(!!interactive);
    };
    const down$ = () => setDown(true);
    const up$ = () => setDown(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down$);
    window.addEventListener('pointerup', up$);
    document.documentElement.style.cursor = 'none';
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down$);
      window.removeEventListener('pointerup', up$);
      document.documentElement.style.cursor = '';
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      <motion.div
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum"
        style={{ left: x, top: y, scale: down ? 0.6 : 1 }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-plum/40"
        style={{ left: ringX, top: ringY }}
        animate={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          borderColor: hovering ? 'rgba(1,172,159,0.7)' : 'rgba(108,29,95,0.4)',
          backgroundColor: hovering ? 'rgba(1,172,159,0.08)' : 'rgba(108,29,95,0)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />
    </div>
  );
}
