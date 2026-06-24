import { Users, BookOpen, Trophy, Radio } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { Counter } from '@/components/marketing/Counter';

const STATS = [
  { value: 12000, suffix: '+', label: 'Learners enrolled', icon: Users },
  { value: 480, suffix: '+', label: 'Courses published', icon: BookOpen },
  { value: 96, suffix: '%', label: 'Completion rate', icon: Trophy },
  { value: 35, suffix: 'k', label: 'Live class hours', icon: Radio },
];

export default function Stats() {
  return (
    <section className="shell py-20 sm:py-28">
      <div className="relative">
        {/* connecting rail */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-transparent via-plum/25 to-transparent lg:block"
        />
        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="group relative flex flex-col items-center text-center">
                {/* node */}
                <span className="relative z-10 grid h-[84px] w-[84px] place-items-center rounded-2xl border border-ink/[0.07] bg-white shadow-glow transition-transform duration-300 group-hover:-translate-y-1">
                  <s.icon className="h-7 w-7 text-plum transition-colors group-hover:text-teal" />
                  <span className="absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-ink/[0.07] bg-white" />
                </span>
                <span className="mt-7 font-display text-5xl font-bold tracking-tightest text-gradient">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-2 text-sm font-medium text-ink/55">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
