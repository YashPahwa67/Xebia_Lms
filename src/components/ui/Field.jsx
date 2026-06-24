import { useId } from 'react';
import { cn } from '@/utils/cn';

const baseInput =
  'w-full rounded-md border border-line px-3 py-2 text-sm shadow-sm placeholder-slate/40 ' +
  'focus:border-plum focus:outline-none focus:ring-1 focus:ring-plum disabled:bg-paper';

export function Input({ label, error, className, id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(baseInput, error && 'border-cta focus:ring-cta', className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-cta">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(baseInput, 'min-h-[90px] resize-y', error && 'border-cta', className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-cta">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className, id, children, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select id={inputId} className={cn(baseInput, className)} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-cta">{error}</p>}
    </div>
  );
}
