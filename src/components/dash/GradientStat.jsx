import { motion } from 'framer-motion';
import { Counter } from '@/components/marketing/Counter';
import { cn } from '@/utils/cn';

// Gradient KPI card (brand palette only). Pass `count` (+ optional prefix/suffix)
// for an animated count-up, or `value` for a pre-formatted string.
const TONES = {
  plum: 'from-magenta to-plum',
  velvet: 'from-plum to-plum-dark',
  emerald: 'from-teal to-teal-soft',
  slate: 'from-[#5C4F61] to-[#4A1E47]',
};

export function GradientStat({ label, value, count, prefix, suffix, hint, icon: Icon, tone = 'plum', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn('relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-float', TONES[tone])}
    >
      <div aria-hidden="true" className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">
            {count != null ? <Counter value={count} prefix={prefix} suffix={suffix} /> : value}
          </p>
          {hint && <p className="mt-1 text-xs text-white/65">{hint}</p>}
        </div>
        {Icon && (
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}
