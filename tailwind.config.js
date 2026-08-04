/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          surface: '#F1F5F9',
          border: '#E2E8F0',
          muted: '#64748B'
        },
        brand: {
          indigo: '#4F46E5',
          cyan: '#0891B2',
          emerald: '#059669',
          purple: '#7C3AED',
          rose: '#E11D48',
          amber: '#D97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
    },
  },
  plugins: [],
}
