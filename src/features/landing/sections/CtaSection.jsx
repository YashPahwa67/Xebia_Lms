import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';
import { MagneticButton } from '@/components/marketing/MagneticButton';
import { Reveal } from '@/components/marketing/Reveal';

export default function CtaSection() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  return (
    <section className="shell py-12 sm:py-20">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-plum-gradient px-6 py-20 text-center sm:px-12">
        {/* animated background orbs */}
        <div aria-hidden="true" className="absolute inset-0">
          <motion.div
            className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-teal/30 blur-3xl"
            animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-magenta/40 blur-3xl"
            animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -25, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        </div>

        <div className="relative z-10">
          <AnimatedHeading
            as="h2"
            className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-tightest text-white"
            lines={[[{ text: 'Ready' }, { text: 'to' }, { text: 'advance' }], [{ text: 'your' }, { text: 'career' }, { text: 'path?' }]]}
          />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-md text-white/75">
              Join thousands of learners and trainers building skills that compound — start in under a minute.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                onClick={() => navigate('/login')}
                className="btn bg-white px-7 py-3.5 text-base text-plum hover:bg-white/90"
              >
                Get started <ArrowRight size={18} />
              </MagneticButton>
              <a href="#features" className="btn px-6 py-3.5 text-base text-white/90 hover:text-white">
                Explore the platform
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
