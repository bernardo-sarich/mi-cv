/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f7f8f7',
        navBg: 'rgba(247,248,247,0.85)',
        surface: '#ffffff',
        border: '#dbe2de',
        text: '#101513',
        textDim: '#5b6863',
        accent: '#1f9d5c',
        accentDim: 'rgba(31,157,92,0.10)',
        onAccent: '#ffffff',
        'dark-bg': '#0a0d0c',
        'dark-navBg': 'rgba(10,13,12,0.82)',
        'dark-surface': '#11161a',
        'dark-border': '#1f2a28',
        'dark-text': '#e6ede9',
        'dark-textDim': '#8a9a94',
        'dark-accent': '#3ddc84',
        'dark-accentDim': 'rgba(61,220,132,0.14)',
        'dark-onAccent': '#08130d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
