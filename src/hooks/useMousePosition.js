import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

// Tracks pointer position relative to an element's center, normalized to [-0.5, 0.5].
// Returns spring-smoothed MotionValues so consumers update WITHOUT re-rendering React.
export function useMousePosition() {
  const ref = useRef(null);
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const x = useSpring(mvx, { stiffness: 120, damping: 20, mass: 0.4 });
  const y = useSpring(mvy, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mvx.set((e.clientX - r.left) / r.width - 0.5);
      mvy.set((e.clientY - r.top) / r.height - 0.5);
    };
    const reset = () => {
      mvx.set(0);
      mvy.set(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
    };
  }, [mvx, mvy]);

  return { ref, x, y };
}
