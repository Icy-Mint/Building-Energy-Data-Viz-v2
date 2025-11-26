/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
