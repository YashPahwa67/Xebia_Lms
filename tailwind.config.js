/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // App design-system scale (dashboards).
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // ── Official Xebia brand palette (single source of truth) ──
        plum: {
          DEFAULT: '#6C1D5F', // Tranquil Velvet
          dark: '#4A1E47', // Tranquil Velvet Dark
          deep: '#4A1E47',
        },
        magenta: '#84117C', // Bright Tr. Velvet
        teal: {
          DEFAULT: '#01AC9F', // Emerald (CTA)
          soft: '#019b8f',
        },
        cta: '#FF6200', // CTA Orange
        // Neutrals
        paper: '#F7F8FC', // Blueish Grey
        mist: '#DADCEA', // Medium Bl. Grey
        line: '#DEDEDE', // Light Grey
        slate: '#5A5A5A', // Dark Grey
        ink: '#000000', // Black / Text
        // Legacy alias kept for existing landing markup.
        'custom-purple': { DEFAULT: '#6C1D5F', dark: '#4A1E47' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      maxWidth: { container: '1200px' },
      boxShadow: {
        glow: '0 0 0 1px rgba(108,29,95,0.08), 0 20px 60px -20px rgba(108,29,95,0.35)',
        'glow-teal': '0 0 0 1px rgba(1,172,159,0.12), 0 20px 60px -20px rgba(1,172,159,0.35)',
        float: '0 24px 70px -28px rgba(10,10,11,0.28)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(10,10,11,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.045) 1px, transparent 1px)',
        'plum-gradient': 'linear-gradient(135deg, #84117C 0%, #6C1D5F 55%, #4A1E47 100%)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'blob-spin': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'blob-spin': 'blob-spin 26s linear infinite',
      },
    },
  },
  plugins: [],
};
