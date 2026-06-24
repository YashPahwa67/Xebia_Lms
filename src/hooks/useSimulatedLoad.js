import { useEffect, useState } from 'react';

// Fakes a short network delay so the skeletons actually show with the static data.
export function useSimulatedLoad(delay = 550) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setLoading(false);
      return undefined;
    }
    const id = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return loading;
}
