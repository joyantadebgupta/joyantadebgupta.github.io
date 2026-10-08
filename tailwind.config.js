/** Tailwind CSS v3 config — mirrors the former Play-CDN inline config.
 *  Build: npm run build:css   (output: tailwind.css, committed for GitHub Pages)
 *  Utilities layer comes FIRST via input.css order; style.css is linked after
 *  tailwind.css so intentional custom overrides win ties deterministically.
 */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './404.html', './script.js'],
  theme: {
    extend: {},
  },
  plugins: [],
};
