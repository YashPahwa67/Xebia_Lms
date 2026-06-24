import { Card } from './Card';
import { cn } from '@/utils/cn';

const ICON_TONES = {
  indigo: 'bg-plum/[0.08] text-plum',
  plum: 'bg-plum/[0.08] text-plum',
  green: 'bg-teal/10 text-teal-soft',
  teal: 'bg-teal/10 text-teal-soft',
  blue: 'bg-magenta/10 text-magenta',
  yellow: 'bg-cta/10 text-cta',
  red: 'bg-cta/10 text-cta',
};

export function StatCard({ label, value, icon: Icon, tone = 'indigo', hint }) {
  return (
    <Card>
      <div className="flex items-center gap-4 p-5">
        {Icon && (
          <span className={cn('rounded-lg p-3', ICON_TONES[tone])}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
