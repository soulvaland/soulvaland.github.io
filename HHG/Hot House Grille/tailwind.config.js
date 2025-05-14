/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // Scans all .html files in the current directory
	"./js/**/*.js",   // ← add this
	"./input.css"     // optional but helps if you embed arbitrary classes there
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--md-sys-color-primary)',
        'on-primary': 'var(--md-sys-color-on-primary)',
        'primary-container': 'var(--md-sys-color-primary-container)',
        'on-primary-container': 'var(--md-sys-color-on-primary-container)',
        'secondary': 'var(--md-sys-color-secondary)',
        'on-secondary': 'var(--md-sys-color-on-secondary)',
        'secondary-container': 'var(--md-sys-color-secondary-container)',
        'on-secondary-container': 'var(--md-sys-color-on-secondary-container)',
        'tertiary': 'var(--md-sys-color-tertiary)',
        'on-tertiary': 'var(--md-sys-color-on-tertiary)',
        'tertiary-container': 'var(--md-sys-color-tertiary-container)',
        'on-tertiary-container': 'var(--md-sys-color-on-tertiary-container)',
        'error': 'var(--md-sys-color-error)',
        'on-error': 'var(--md-sys-color-on-error)',
        'error-container': 'var(--md-sys-color-error-container)',
        'on-error-container': 'var(--md-sys-color-on-error-container)',
        'background': 'var(--md-sys-color-background)',
        'on-background': 'var(--md-sys-color-on-background)',
        'surface': 'var(--md-sys-color-surface)',
        'on-surface': 'var(--md-sys-color-on-surface)',
        'surface-variant': 'var(--md-sys-color-surface-variant)',
        'on-surface-variant': 'var(--md-sys-color-on-surface-variant)',
        'outline': 'var(--md-sys-color-outline)',
        'outline-variant': 'var(--md-sys-color-outline-variant)',
        'shadow': 'var(--md-sys-color-shadow)',
        'scrim': 'var(--md-sys-color-scrim)',
        'inverse-surface': 'var(--md-sys-color-inverse-surface)',
        'inverse-on-surface': 'var(--md-sys-color-inverse-on-surface)',
        'inverse-primary': 'var(--md-sys-color-inverse-primary)',
        // Old brand colors mapped to new M3 roles or specific tokens for compatibility/transition
        'brand-red': 'var(--md-sys-color-primary)', // Original: #B03C23
        'brand-dark-blue': 'var(--md-sys-color-inverse-surface)', // Original: #011640 (example, could be a custom dark surface if needed)
        'brand-nav-blue': 'var(--md-sys-color-on-surface-variant)', // Original: #073A59
        'brand-beige': 'var(--md-sys-color-background)', // Original: #F2EBDC
        'brand-price': 'var(--md-sys-color-tertiary)', // Original: #952E19
        'brand-border-light': 'var(--md-sys-color-outline-variant)', // Original: #f2c7bd
        // Original grays - map to M3 surface variants or keep if distinct shades are needed
        'brand-gray': {
          200: 'var(--md-sys-color-surface-variant)', // approx #e5e7eb
          300: 'var(--md-sys-color-outline-variant)', // approx #d1d5db
          700: 'var(--md-sys-color-on-surface-variant)', // approx #374151 (use with caution, on-surface-variant is for text on surface-variant)
        },
        'brand-scrollbar-track': 'var(--md-sys-color-surface-container-lowest)',
        'brand-scrollbar-thumb': 'var(--md-sys-color-outline-variant)',
        'brand-scrollbar-thumb-hover': 'var(--md-sys-color-outline)',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
      fontSize: {
        'm3-display-large': ['var(--md-sys-typescale-display-large-font-size)', { lineHeight: 'var(--md-sys-typescale-display-large-line-height)', letterSpacing: 'var(--md-sys-typescale-display-large-letter-spacing)', fontWeight: 'var(--md-sys-typescale-display-large-font-weight)' }],
        'm3-display-medium': ['var(--md-sys-typescale-display-medium-font-size)', { lineHeight: 'var(--md-sys-typescale-display-medium-line-height)', letterSpacing: 'var(--md-sys-typescale-display-medium-letter-spacing)', fontWeight: 'var(--md-sys-typescale-display-medium-font-weight)' }],
        'm3-display-small': ['var(--md-sys-typescale-display-small-font-size)', { lineHeight: 'var(--md-sys-typescale-display-small-line-height)', letterSpacing: 'var(--md-sys-typescale-display-small-letter-spacing)', fontWeight: 'var(--md-sys-typescale-display-small-font-weight)' }],
        'm3-headline-large': ['var(--md-sys-typescale-headline-large-font-size)', { lineHeight: 'var(--md-sys-typescale-headline-large-line-height)', letterSpacing: 'var(--md-sys-typescale-headline-large-letter-spacing)', fontWeight: 'var(--md-sys-typescale-headline-large-font-weight)' }],
        'm3-headline-medium': ['var(--md-sys-typescale-headline-medium-font-size)', { lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)', letterSpacing: 'var(--md-sys-typescale-headline-medium-letter-spacing)', fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)' }],
        'm3-headline-small': ['var(--md-sys-typescale-headline-small-font-size)', { lineHeight: 'var(--md-sys-typescale-headline-small-line-height)', letterSpacing: 'var(--md-sys-typescale-headline-small-letter-spacing)', fontWeight: 'var(--md-sys-typescale-headline-small-font-weight)' }],
        'm3-title-large': ['var(--md-sys-typescale-title-large-font-size)', { lineHeight: 'var(--md-sys-typescale-title-large-line-height)', letterSpacing: 'var(--md-sys-typescale-title-large-letter-spacing)', fontWeight: 'var(--md-sys-typescale-title-large-font-weight)' }],
        'm3-title-medium': ['var(--md-sys-typescale-title-medium-font-size)', { lineHeight: 'var(--md-sys-typescale-title-medium-line-height)', letterSpacing: 'var(--md-sys-typescale-title-medium-letter-spacing)', fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)' }],
        'm3-title-small': ['var(--md-sys-typescale-title-small-font-size)', { lineHeight: 'var(--md-sys-typescale-title-small-line-height)', letterSpacing: 'var(--md-sys-typescale-title-small-letter-spacing)', fontWeight: 'var(--md-sys-typescale-title-small-font-weight)' }],
        'm3-label-large': ['var(--md-sys-typescale-label-large-font-size)', { lineHeight: 'var(--md-sys-typescale-label-large-line-height)', letterSpacing: 'var(--md-sys-typescale-label-large-letter-spacing)', fontWeight: 'var(--md-sys-typescale-label-large-font-weight)' }],
        'm3-label-medium': ['var(--md-sys-typescale-label-medium-font-size)', { lineHeight: 'var(--md-sys-typescale-label-medium-line-height)', letterSpacing: 'var(--md-sys-typescale-label-medium-letter-spacing)', fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)' }],
        'm3-label-small': ['var(--md-sys-typescale-label-small-font-size)', { lineHeight: 'var(--md-sys-typescale-label-small-line-height)', letterSpacing: 'var(--md-sys-typescale-label-small-letter-spacing)', fontWeight: 'var(--md-sys-typescale-label-small-font-weight)' }],
        'm3-body-large': ['var(--md-sys-typescale-body-large-font-size)', { lineHeight: 'var(--md-sys-typescale-body-large-line-height)', letterSpacing: 'var(--md-sys-typescale-body-large-letter-spacing)', fontWeight: 'var(--md-sys-typescale-body-large-font-weight)' }],
        'm3-body-medium': ['var(--md-sys-typescale-body-medium-font-size)', { lineHeight: 'var(--md-sys-typescale-body-medium-line-height)', letterSpacing: 'var(--md-sys-typescale-body-medium-letter-spacing)', fontWeight: 'var(--md-sys-typescale-body-medium-font-weight)' }],
        'm3-body-small': ['var(--md-sys-typescale-body-small-font-size)', { lineHeight: 'var(--md-sys-typescale-body-small-line-height)', letterSpacing: 'var(--md-sys-typescale-body-small-letter-spacing)', fontWeight: 'var(--md-sys-typescale-body-small-font-weight)' }],
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
      },
      borderRadius: {
        'DEFAULT': 'var(--md-sys-shape-corner-medium)',
        'none': 'var(--md-sys-shape-corner-none)',
        'xs': 'var(--md-sys-shape-corner-extra-small)',
        'sm': 'var(--md-sys-shape-corner-small)',
        'md': 'var(--md-sys-shape-corner-medium)',
        'lg': 'var(--md-sys-shape-corner-large)',
        'xl': 'var(--md-sys-shape-corner-extra-large)',
        'full': 'var(--md-sys-shape-corner-full)',
      }
    },
  },
  plugins: [],
}
