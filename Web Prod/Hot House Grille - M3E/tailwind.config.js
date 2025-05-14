/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./*.html", // Scans all .html files in the current directory
    "./js/**/*.js",
    "./css/**/*.css", // Make sure it scans your CSS files too, including material-theme-light.css
  ],
  theme: {
    extend: {
      colors: {
        // Map M3 system colors from your material-theme-light.css
        'm3-primary': 'var(--md-sys-color-primary)',
        'm3-on-primary': 'var(--md-sys-color-on-primary)',
        'm3-primary-container': 'var(--md-sys-color-primary-container)',
        'm3-on-primary-container': 'var(--md-sys-color-on-primary-container)',
        'm3-secondary': 'var(--md-sys-color-secondary)',
        'm3-on-secondary': 'var(--md-sys-color-on-secondary)',
        'm3-secondary-container': 'var(--md-sys-color-secondary-container)',
        'm3-on-secondary-container': 'var(--md-sys-color-on-secondary-container)',
        'm3-tertiary': 'var(--md-sys-color-tertiary)',
        'm3-on-tertiary': 'var(--md-sys-color-on-tertiary)',
        'm3-tertiary-container': 'var(--md-sys-color-tertiary-container)',
        'm3-on-tertiary-container': 'var(--md-sys-color-on-tertiary-container)',
        'm3-error': 'var(--md-sys-color-error)',
        'm3-on-error': 'var(--md-sys-color-on-error)',
        'm3-error-container': 'var(--md-sys-color-error-container)',
        'm3-on-error-container': 'var(--md-sys-color-on-error-container)',
        'm3-background': 'var(--md-sys-color-background)',
        'm3-on-background': 'var(--md-sys-color-on-background)',
        'm3-surface': 'var(--md-sys-color-surface)',
        'm3-on-surface': 'var(--md-sys-color-on-surface)',
        'm3-surface-variant': 'var(--md-sys-color-surface-variant)',
        'm3-on-surface-variant': 'var(--md-sys-color-on-surface-variant)',
        'm3-outline': 'var(--md-sys-color-outline)',
        'm3-outline-variant': 'var(--md-sys-color-outline-variant)',
        'm3-shadow': 'var(--md-sys-color-shadow)',
        'm3-scrim': 'var(--md-sys-color-scrim)',
        'm3-inverse-surface': 'var(--md-sys-color-inverse-surface)',
        'm3-inverse-on-surface': 'var(--md-sys-color-inverse-on-surface)',
        'm3-inverse-primary': 'var(--md-sys-color-inverse-primary)',
        'm3-surface-tint': 'var(--md-sys-color-surface-tint)', // Added this, as it's in your file

        // Surface container colors
        'm3-surface-dim': 'var(--md-sys-color-surface-dim)',
        'm3-surface-bright': 'var(--md-sys-color-surface-bright)',
        'm3-surface-container-lowest': 'var(--md-sys-color-surface-container-lowest)',
        'm3-surface-container-low': 'var(--md-sys-color-surface-container-low)',
        'm3-surface-container': 'var(--md-sys-color-surface-container)',
        'm3-surface-container-high': 'var(--md-sys-color-surface-container-high)',
        'm3-surface-container-highest': 'var(--md-sys-color-surface-container-highest)',

        // Fixed accent colors (useful for elements that need consistent color across themes)
        'm3-primary-fixed': 'var(--md-sys-color-primary-fixed)',
        'm3-on-primary-fixed': 'var(--md-sys-color-on-primary-fixed)',
        'm3-primary-fixed-dim': 'var(--md-sys-color-primary-fixed-dim)',
        'm3-on-primary-fixed-variant': 'var(--md-sys-color-on-primary-fixed-variant)',
        // ... (add secondary-fixed, tertiary-fixed in the same way if needed)
      },
      fontFamily: {
        // You'll define your M3 type scale fonts here or rely on global CSS.
        // For now, we can keep your existing ones and gradually transition.
        'display': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
        // Example if you want to explicitly map M3 font families:
        // 'm3-brand-typeface': ['Playfair Display', 'serif'],
        // 'm3-plain-typeface': ['Lato', 'sans-serif'],
      },
      // Font sizes, weights, etc., for the M3 type scale can also be mapped here
      // if you want Tailwind utility classes for them.
      // e.g., 'text-m3-display-large', 'leading-m3-display-large'
      // This is more advanced and might be best handled with custom CSS classes
      // or by relying on Material Web Components' internal typography.
    },
  },
  plugins: [],
};
