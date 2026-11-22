/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: '#f7f6f3',
        // Warm neutral scale used for text, borders and surfaces
        ink: {
          50: '#faf9f7',
          100: '#f3f2ee',
          200: '#e7e5df',
          300: '#d3d0c8',
          400: '#a9a59b',
          500: '#7d796f',
          600: '#5c5951',
          700: '#44423c',
          800: '#2b2a26',
          900: '#1a1917',
        },
        // Single accent: a muted steel blue
        brand: {
          50: '#eef3fb',
          100: '#dce6f5',
          500: '#3a5f9e',
          600: '#2c4a7c',
          700: '#223b64',
        },
        success: { 50: '#eaf4ee', 600: '#2a7a4b', 700: '#1f6b3a' },
        warn: { 50: '#fbf2de', 600: '#b7791f', 700: '#8a5a00' },
        danger: { 50: '#fbeae7', 600: '#c0392b', 700: '#a3261b' },
      },
      boxShadow: {
        panel: '0 12px 32px -8px rgb(26 25 23 / 0.28)',
      },
    },
  },
  plugins: [],
};
