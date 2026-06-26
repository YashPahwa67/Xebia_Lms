import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Button/link that gently follows the cursor with a spring.
export function MagneticButton({ as = 'button', strength = 0.4, className, children, ...props }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const Comp = motion[as] || motion.button;
  return (
    <Comp ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} whileTap={{ scale: 0.96 }} className={className} {...props}>
      {children}
    </Comp>
  );
}
