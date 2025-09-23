/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        accent: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
          light: '#2dd4bf',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(16,185,129,0.25)',
      },
    },
  },
  plugins: [],
};


