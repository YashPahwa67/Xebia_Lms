import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { initials } from '@/utils/format';

/**
 * Dashboard hero: a profile block with inline KPIs + a "focus today" list.
 * metrics: [{ label, value }]   today: [{ icon, title, meta, tone? }]
 */
export function HeroCard({ name, role, subtitle, metrics = [], today = [] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="grid overflow-hidden rounded-3xl border border-line/70 bg-white shadow-sm lg:grid-cols-[1.4fr_1fr]"
    >
      {/* profile + inline metrics */}
      <div className="relative overflow-hidden bg-plum-gradient p-6 text-white sm:p-7">
        <div aria-hidden="true" className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-teal/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-lg font-semibold ring-4 ring-white/10">
            {initials(name)}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">{role}</p>
            <h1 className="font-display text-2xl font-semibold leading-tight">{name}</h1>
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
          </div>
        </div>

        {metrics.length > 0 && (
          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/10 px-3 py-2.5">
                <p className="text-[11px] text-white/60">{m.label}</p>
                <p className="font-display text-lg font-bold">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* focus today */}
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles size={15} className="text-teal" /> Focus today
        </div>
        <ul className="mt-4 space-y-3">
          {today.length ? (
            today.map((t, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t.tone === 'orange' ? 'bg-cta/10 text-cta' : t.tone === 'teal' ? 'bg-teal/10 text-teal-soft' : 'bg-plum/[0.07] text-plum'}`}>
                  <t.icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                  <p className="truncate text-xs text-slate/65">{t.meta}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate/55">Nothing needs your attention. 🎉</li>
          )}
        </ul>
      </div>
    </motion.section>
  );
}
