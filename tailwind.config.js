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
          50: '#f4f6f1',
          100: '#e4e9dd',
          200: '#cdd7c0',
          300: '#adc09b',
          400: '#8ba273',
          500: '#6c8554',
          600: '#455a30', // Hutstuf forest green
          700: '#384828',
          800: '#2f3c22',
          900: '#27321e',
        },
        background: {
          DEFAULT: '#f5f4ef',
        },
      },
      fontFamily: {
        sans: ['"Rethink Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'md': '4px',
        'lg': '8px',
      },
    },
  },
  plugins: [],
};
