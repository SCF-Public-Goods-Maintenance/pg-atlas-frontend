/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3eeff',
          100: '#e4d9ff',
          200: '#cbb5ff',
          300: '#b08fff',
          400: '#a06cff',
          500: '#914cff',
          600: '#7c3aed',
          700: '#6527cc',
          800: '#4f1da8',
          900: '#3b1580',
        },
        surface: {
          dark: '#0f0f21',
          light: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
