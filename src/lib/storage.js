import { STORAGE_KEYS } from '@/constants';

// small localStorage wrapper for the auth session
export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  getRole: () => localStorage.getItem(STORAGE_KEYS.ROLE),

  getUser: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession: ({ token, user, role }) => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (role) localStorage.setItem(STORAGE_KEYS.ROLE, role);
  },

  clear: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem('userData'); // legacy key cleanup
  },
};

// Decode a JWT payload without verification (used to derive user info on OAuth).
export function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
