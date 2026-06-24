import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

/**
 * Wraps an async action with loading + toast error/success handling.
 * Returns { run, loading }.
 */
export function useAsyncAction(action, { successMessage, onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      try {
        const result = await action(...args);
        if (successMessage) toast.success(successMessage);
        onSuccess?.(result);
        return result;
      } catch (error) {
        toast.error(error.message || 'Action failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [action, successMessage, onSuccess, toast],
  );

  return { run, loading };
}
