import { Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';
import { initials } from '@/utils/format';

const ITEMS = [
  { quote: 'We replaced three tools with Xebia. Trainers ship courses in a day and our completion rate has never been higher.', name: 'Aarav Mehta', role: 'Head of L&D, FinScale' },
  { quote: 'The AI assessment builder saves me hours every week. I describe a topic and get a balanced quiz instantly.', name: 'Sara Nguyen', role: 'Senior Trainer' },
  { quote: 'Live classes and progress tracking in one place. My students always know exactly what comes next.', name: 'Daniel Okafor', role: 'Program Lead' },
  { quote: 'Onboarding 400 learners used to take a week. With bulk upload it took an afternoon.', name: 'Priya Sharma', role: 'Platform Admin' },
  { quote: 'The cleanest LMS we have used. Everything feels considered, fast and genuinely premium.', name: 'Liam Walsh', role: 'VP People' },
  { quote: 'Engagement jumped the moment we switched. The live sessions are flawless.', name: 'Mei Lin', role: 'Learning Architect' },
];

function Row({ items, reverse }) {
  const track = [...items, ...items];
  return (
    <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="flex w-max gap-5 py-3 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {track.map((t, i) => (
          <figure
            key={i}
            className="card-surface flex w-[340px] shrink-0 flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <Quote className="h-6 w-6 text-plum/25" />
              <div className="flex gap-0.5 text-teal">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} className="fill-current" />
                ))}
              </div>
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-plum/10 text-sm font-semibold text-plum">
                {initials(t.name)}
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-ink/50">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-16 py-24 sm:py-32">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">Loved by teams</span>
          </Reveal>
          <AnimatedHeading
            className="display-2 mt-5"
            lines={[[{ text: 'Trusted' }, { text: 'by' }, { text: 'people' }], [{ text: 'who' }, { text: 'teach', accent: true }, { text: '&' }, { text: 'learn' }]]}
          />
        </div>
      </div>

      <div className="mt-14 space-y-5">
        <Row items={ITEMS} />
        <Row items={[...ITEMS].reverse()} reverse />
      </div>
    </section>
  );
}
