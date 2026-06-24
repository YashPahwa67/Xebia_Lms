import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';
import { MagneticButton } from '@/components/marketing/MagneticButton';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';
import { useMousePosition } from '@/hooks/useMousePosition';
import img1 from '@/assets/landing/img1.png';
import img3 from '@/assets/landing/img3.jpg';
import img4 from '@/assets/landing/img4.jpg';
import img5 from '@/assets/landing/img5.jpg';
import img6 from '@/assets/landing/img6.jpg';

const FLOATERS = [
  { src: img3, cls: 'left-[4%] top-[20%] h-28 w-28', depth: 26, label: 'Live cohorts' },
  { src: img1, cls: 'left-[12%] bottom-[14%] h-20 w-20', depth: 40, label: 'Mentors' },
  { src: img6, cls: 'right-[5%] top-[16%] h-32 w-32', depth: 30, label: 'Campus' },
  { src: img5, cls: 'right-[10%] bottom-[18%] h-24 w-24', depth: 46, label: 'Workshops' },
  { src: img4, cls: 'right-[26%] bottom-[6%] h-16 w-16', depth: 60, label: 'Teams' },
];

// Single floating image; parallax is driven by MotionValues (no React re-render).
function Floater({ f, i, mx, my, reduce }) {
  const x = useTransform(mx, (v) => v * f.depth);
  const y = useTransform(my, (v) => v * f.depth);
  return (
    <motion.div
      className={`absolute overflow-hidden rounded-full border-4 border-plum/70 shadow-float ${f.cls}`}
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <img src={f.src} alt="" className="h-full w-full object-cover" loading="lazy" />
    </motion.div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { ref, x, y } = useMousePosition();

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-28"
    >
      <MeshBlobs />
      <GridOverlay />

      {/* Floating imagery with mouse parallax (decorative). */}
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        {FLOATERS.map((f, i) => (
          <Floater key={i} f={f} i={i} mx={x} my={y} reduce={reduce} />
        ))}
      </div>

      <div className="shell relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="eyebrow">
            <Sparkles size={13} /> Learning, elevated
          </span>
        </motion.div>

        <AnimatedHeading
          as="h1"
          className="display-1 mx-auto mt-7 max-w-4xl"
          delay={0.15}
          lines={[
            [{ text: 'Up' }, { text: 'your' }, { text: 'skills', accent: true }],
            [{ text: 'to' }, { text: 'advance' }, { text: 'your' }],
            [{ text: 'career', accent: true }, { text: 'path' }],
          ]}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="lede mx-auto mt-7 max-w-xl"
        >
          A premium learning platform where trainers craft courses, run live classes and
          build AI-powered assessments — and learners grow, every single day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton onClick={() => navigate('/login')} className="btn-primary px-7 py-3.5 text-base shadow-glow">
            Get started <ArrowRight size={18} />
          </MagneticButton>
          <a href="#features" className="btn-ghost group px-6 py-3.5 text-base">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 transition-colors group-hover:border-teal group-hover:text-teal">
              <Play size={14} className="ml-0.5 fill-current" />
            </span>
            See how it works
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex h-10 w-6 justify-center rounded-full border border-ink/15 pt-2">
            <motion.span
              className="h-2 w-1 rounded-full bg-plum"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
