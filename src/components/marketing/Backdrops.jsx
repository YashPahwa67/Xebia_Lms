import { motion, useReducedMotion } from 'framer-motion';

// Faint grid overlay (masked so it fades toward edges).
export function GridOverlay({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] ${className}`}
    />
  );
}

// Slow-drifting soft color blobs for depth.
export function MeshBlobs({ className = '' }) {
  const reduce = useReducedMotion();
  const float = (dx, dy) =>
    reduce
      ? {}
      : {
          animate: { x: [0, dx, 0], y: [0, dy, 0] },
          transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
        };

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        {...float(40, -30)}
        className="absolute -left-24 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-magenta/20 blur-[120px]"
      />
      <motion.div
        {...float(-50, 40)}
        className="absolute right-[-12%] top-1/4 h-[30rem] w-[30rem] rounded-full bg-teal/20 blur-[130px]"
      />
      <motion.div
        {...float(30, 30)}
        className="absolute bottom-[-15%] left-1/3 h-[28rem] w-[28rem] rounded-full bg-plum/20 blur-[120px]"
      />
    </div>
  );
}

// subtle noise overlay
export function Noise({ opacity = 0.035 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-soft-light"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
