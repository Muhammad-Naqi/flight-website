/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f9',
          100: '#b3e6ed',
          200: '#80d5e1',
          300: '#4dc4d5',
          400: '#1ab3c9',
          500: '#0d7ea8', // Expedia primary blue
          600: '#0a6b8f',
          700: '#085876',
          800: '#06455d',
          900: '#043244',
        },
        accent: {
          50: '#fff9e6',
          100: '#ffedb3',
          200: '#ffe180',
          300: '#ffd54d',
          400: '#ffc91a',
          500: '#ffb800', // Expedia yellow accent
          600: '#cc9300',
          700: '#996e00',
          800: '#664900',
          900: '#332400',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
