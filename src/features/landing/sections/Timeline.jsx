import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { UserPlus, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';

const STEPS = [
  { icon: UserPlus, title: 'Create your account', desc: 'Sign in as a learner, trainer or admin and land in a workspace built for you.' },
  { icon: BookOpen, title: 'Discover & enroll', desc: 'Browse approved courses, enroll in one tap, and pick up exactly where you left off.' },
  { icon: GraduationCap, title: 'Learn & attend live', desc: 'Work through modular content and join live classes with trainers in real time.' },
  { icon: Trophy, title: 'Assess & advance', desc: 'Take AI-built assessments, see instant results, and watch your progress compound.' },
];

export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });

  return (
    <section id="timeline" className="relative scroll-mt-16 bg-ink/[0.015] py-24 sm:py-32">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">The journey</span>
          </Reveal>
          <AnimatedHeading
            className="display-2 mt-5"
            lines={[[{ text: 'From' }, { text: 'first' }, { text: 'login' }], [{ text: 'to' }, { text: 'mastery', accent: true }]]}
          />
        </div>

        <div ref={ref} className="relative mx-auto mt-16 max-w-3xl">
          {/* track */}
          <div className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px bg-ink/10 md:left-1/2" aria-hidden="true" />
          <motion.div
            className="absolute left-[27px] top-2 w-px origin-top bg-gradient-to-b from-magenta via-plum to-teal md:left-1/2"
            style={{ height: '100%', scaleY: fill }}
            aria-hidden="true"
          />

          <ol className="space-y-12">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`relative md:flex ${i % 2 ? 'md:flex-row-reverse' : ''}`}>
                <Reveal y={24} className="md:w-1/2">
                  <div className={`pl-16 md:pl-0 ${i % 2 ? 'md:pl-10 md:text-left' : 'md:pr-10 md:text-right'}`}>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{s.desc}</p>
                  </div>
                </Reveal>
                {/* node */}
                <span className="absolute left-3 top-1 grid h-[30px] w-[30px] place-items-center rounded-full border border-plum/20 bg-white text-plum shadow-glow md:left-1/2 md:-translate-x-1/2">
                  <s.icon size={15} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
