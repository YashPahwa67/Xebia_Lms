// Tiny className combiner (truthy values joined). Avoids a clsx dependency.
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
