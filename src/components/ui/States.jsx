import { Inbox, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

// Empty state for lists with no data.
export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon className="h-12 w-12 text-gray-300" aria-hidden="true" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {message && <p className="max-w-sm text-sm text-gray-500">{message}</p>}
      {action}
    </div>
  );
}

// Error state with optional retry.
export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center" role="alert">
      <AlertTriangle className="h-12 w-12 text-cta/70" aria-hidden="true" />
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {message && <p className="max-w-md text-sm text-gray-500">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
