/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#e3e7dc',
          200: '#c8d1ba',
          300: '#a8b693',
          400: '#8a9b72',
          500: '#6d7f56',
          600: '#556543',
          700: '#434f36',
          800: '#38412e',
          900: '#303828',
        },
        earth: {
          50: '#faf8f5',
          100: '#f0ebe3',
          200: '#e0d5c6',
          300: '#cdbaa3',
          400: '#b89c7f',
          500: '#a88464',
          600: '#9a7358',
          700: '#805e4a',
          800: '#694d40',
          900: '#564136',
        },
      },
    },
  },
  plugins: [],
}


