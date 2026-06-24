import { cn } from '@/utils/cn';

// White content card with an optional titled header.
export function Panel({ title, subtitle, action, className, bodyClassName, children }) {
  return (
    <section className={cn('rounded-3xl border border-line/70 bg-white shadow-sm', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line/60 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="text-xs text-slate/70">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}
