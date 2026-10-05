/** Tailwind CSS v3 config — mirrors the former Play-CDN inline config.
 *  Build: npm run build:css   (output: tailwind.css, committed for GitHub Pages)
 *  Utilities layer comes FIRST via input.css order; style.css is linked after
 *  tailwind.css so intentional custom overrides win ties deterministically.
 */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './404.html', './script.js'],
  theme: {
    extend: {
      colors: {
        indigo: {
          400: '#818cf8',
          600: '#4f46e5',
          900: '#312e81',
        },
        slate: {
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
