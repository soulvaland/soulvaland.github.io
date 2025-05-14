/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js",
    "./input.css"
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#B03C23',
        'brand-red-hover': '#912f1b', // Added
        'brand-dark-blue': '#011640',
        'brand-nav-blue': '#073A59',
        'brand-beige': '#F2EBDC',
        'brand-price': '#952E19',
        'brand-accent-red': '#A0301C', // Added
        'brand-border-light': '#f2c7bd',
        'brand-gray': {
          200: '#e5e7eb',
          300: '#d1d5db',
          500: '#6b7280',      // Added
          600: '#4b5563',      // Added
          700: '#374151',
        },
        'brand-scrollbar-track': '#F2EBDC',
        'brand-scrollbar-thumb': '#bcaea0',
        'brand-scrollbar-thumb-hover': '#a19384',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      }
    },
  },
  plugins: [],
}