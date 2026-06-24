import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Spinner({ className }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-plum', className)} aria-hidden="true" />;
}

// Full-area centered loading state.
export function LoadingState({ label = 'Loading…', className }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-10 w-10 animate-spin text-plum" aria-hidden="true" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Full-screen loader (e.g. route guards).
export function FullScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingState label={label} />
    </div>
  );
}
