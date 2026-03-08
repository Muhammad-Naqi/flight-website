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
          50: '#f6f8f5',
          100: '#eef1eb',
          200: '#dce3d8',
          300: '#c2cfbb',
          400: '#a3b597',
          500: '#819972',
          600: '#627c52',
          700: '#486734', // Forest Green CTA
          800: '#3e522f',
          900: '#344528',
          950: '#1b2613',
        },
        background: {
          DEFAULT: '#f5f4ef',
        },
        foreground: {
          DEFAULT: '#1a1716',
        }
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
