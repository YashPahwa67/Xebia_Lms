// Formatting helpers used across views.

// Indian-rupee formatter. `compact` shows lakhs (e.g. ₹1.2L).
export function inr(n = 0, compact = false) {
  if (compact) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function formatDate(value, opts = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, opts);
}

export function formatDateTime(value) {
  return formatDate(value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

// Normalize a possibly-paginated API list response into an array.
export function toArray(payload, ...keys) {
  if (Array.isArray(payload)) return payload;
  for (const k of keys) {
    if (Array.isArray(payload?.[k])) return payload[k];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}
