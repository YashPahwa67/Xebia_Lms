import { useState, useEffect, useCallback } from 'react';

// Landing-page theme toggle. Persists choice; the caller applies the returned
// `dark` flag as a `.dark` class on its own wrapper, so dark styles stay scoped.
const KEY = 'landing-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem(KEY) === 'dark');

  useEffect(() => {
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return { dark, toggle };
}
