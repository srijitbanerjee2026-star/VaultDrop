/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#FDFBF7',         // Warm Ivory
          card: '#FFFFFF',       // Pure White
          navy: '#0A192F',       // Deep Navy
          slate: '#475569',      // Slate Body
          accent: '#2563EB',     // Cobalt Blue
          'accent-hover': '#1D4ED8',
          border: '#E2E8F0',     // Light Border
          muted: '#F1F5F9',      // Subtle Grey
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};