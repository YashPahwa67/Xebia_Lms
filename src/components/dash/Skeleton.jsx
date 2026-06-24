import { cn } from '@/utils/cn';

// Base shimmer block.
export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-lg bg-mist/50', className)} {...props} />;
}

export function StatSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-line/70 bg-white p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className }) {
  return (
    <div className={cn('rounded-3xl border border-line/70 bg-white p-5', className)}>
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 flex h-56 items-end gap-3">
        {[60, 80, 45, 90, 70, 55].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-white p-5">
      <Skeleton className="h-4 w-32" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
