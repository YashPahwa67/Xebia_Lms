import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';

const FAQS = [
  { q: 'Can I enroll in multiple courses at once?', a: 'Absolutely. Enroll in as many courses as you like and pick each one up at your own pace — your progress is tracked independently.' },
  { q: 'What kind of support can I expect from instructors?', a: 'Trainers offer live Q&A sessions, personalized feedback and one-on-one mentoring throughout your learning journey.' },
  { q: 'Are courses self-paced or scheduled?', a: 'Both. Choose self-paced modules or instructor-led courses with live classes and specific schedules — whatever fits your style.' },
  { q: 'Are there any prerequisites?', a: 'Prerequisites vary by course. Each course page clearly outlines the recommended background knowledge before you enroll.' },
];

function Item({ faq, open, onToggle, id }) {
  return (
    <div className="card-surface overflow-hidden">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${id}`}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span className="font-medium text-ink">{faq.q}</span>
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-plum text-white transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-ink/60">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="shell scroll-mt-16 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="eyebrow">Questions</span>
          </Reveal>
          <AnimatedHeading
            className="display-2 mt-5"
            lines={[[{ text: 'Frequently' }], [{ text: 'asked', accent: true }, { text: 'questions' }]]}
          />
          <Reveal delay={0.1}>
            <p className="lede mt-5 max-w-sm">
              Still curious? Reach our team at{' '}
              <a href="mailto:support@xebia.com" className="font-medium text-plum hover:underline">
                support@xebia.com
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.06}>
              <Item faq={faq} id={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
