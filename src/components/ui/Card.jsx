import { cn } from '@/utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-gray-100 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

const BADGE_TONES = {
  gray: 'bg-mist/50 text-slate',
  slate: 'bg-mist/50 text-slate',
  plum: 'bg-plum/[0.08] text-plum',
  magenta: 'bg-magenta/10 text-magenta',
  teal: 'bg-teal/10 text-teal-soft',
  orange: 'bg-cta/10 text-cta',
  // legacy aliases mapped onto the brand palette
  green: 'bg-teal/10 text-teal-soft',
  yellow: 'bg-cta/10 text-cta',
  red: 'bg-cta/10 text-cta',
  blue: 'bg-plum/[0.08] text-plum',
  indigo: 'bg-plum/[0.08] text-plum',
};

export function Badge({ tone = 'gray', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        BADGE_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
