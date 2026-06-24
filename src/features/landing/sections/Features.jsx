import { BookOpen, Video, Sparkles, BarChart3, Users, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/marketing/Reveal';
import { AnimatedHeading } from '@/components/marketing/AnimatedHeading';
import { TiltCard } from '@/components/marketing/TiltCard';

function FeatureCard({ icon: Icon, title, desc, className = '', tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <TiltCard className={`h-full ${className}`}>
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 ${
          dark ? 'bg-plum-gradient text-white' : 'card-surface'
        }`}
      >
        {dark && (
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal/30 blur-3xl"
          />
        )}
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl ${
            dark ? 'bg-white/15 text-white' : 'bg-plum/[0.06] text-plum'
          }`}
        >
          <Icon size={22} />
        </span>
        <h3 className={`mt-5 font-display text-xl font-semibold ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-white/75' : 'text-ink/55'}`}>
          {desc}
        </p>
      </div>
    </TiltCard>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative shell scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="eyebrow">The platform</span>
        </Reveal>
        <AnimatedHeading
          className="display-2 mt-5"
          lines={[[{ text: 'Everything' }, { text: 'a' }, { text: 'modern' }], [{ text: 'academy', accent: true }, { text: 'needs' }]]}
        />
        <Reveal delay={0.1}>
          <p className="lede mx-auto mt-5 max-w-lg">
            One workspace for admins, trainers and learners — crafted for clarity at every step.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-4 md:grid-cols-3">
        <Reveal className="md:col-span-2 md:row-span-1">
          <FeatureCard
            tone="dark"
            icon={Sparkles}
            title="AI-assisted assessments"
            desc="Generate balanced question sets from a topic, difficulty and count — then auto-grade submissions against a passing threshold in seconds."
            className="md:min-h-[15rem]"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <FeatureCard icon={Video} title="Live classes" desc="Host and join interactive sessions right in the browser." />
        </Reveal>
        <Reveal delay={0.1}>
          <FeatureCard icon={BookOpen} title="Course authoring" desc="Build modular courses with video, PDFs and assignments." />
        </Reveal>
        <Reveal delay={0.15}>
          <FeatureCard icon={Users} title="Batches & enrollment" desc="Organize learners into cohorts and track every journey." />
        </Reveal>
        <Reveal delay={0.2}>
          <FeatureCard icon={ShieldCheck} title="Role-based access" desc="Dedicated, secure workspaces per role." />
        </Reveal>
        <Reveal className="md:col-span-2">
          <FeatureCard
            icon={BarChart3}
            title="Progress analytics"
            desc="Dashboards that turn activity into insight — completion, performance trends and live-class hours, all in real time."
            className="md:min-h-[12rem]"
          />
        </Reveal>
      </div>
    </section>
  );
}
