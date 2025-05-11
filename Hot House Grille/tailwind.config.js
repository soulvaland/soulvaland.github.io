/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // Scans all .html files in the current directory
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#B03C23',
        'brand-dark-blue': '#011640',
        'brand-nav-blue': '#073A59',
        'brand-beige': '#F2EBDC',
        'brand-price': '#952E19',
        'brand-border-light': '#f2c7bd',
        'brand-gray': {
          200: '#e5e7eb',
          300: '#d1d5db',
          700: '#374151', // For list view item description text
        },
        'brand-scrollbar-track': '#F2EBDC',
        'brand-scrollbar-thumb': '#bcaea0',
        'brand-scrollbar-thumb-hover': '#a19384',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
      // This fontWeight section is optional if you only use standard Tailwind weight names
      // (e.g., font-normal, font-semibold, font-bold) as v4 includes these by default.
      // Keep it if you want to ensure these specific numeric values or add custom ones.
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
