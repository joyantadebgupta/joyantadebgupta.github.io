// Local safety net: syntax + JSON + CSS braces + secrets + local-link check. No dependencies.
const fs = require('fs');
const path = require('path');

const fail = (msg) => { console.error('CHECK FAILED: ' + msg); process.exit(1); };

// 1. manifest + sitemap must parse / exist
try {
  JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
} catch (e) { fail('manifest.json invalid: ' + e.message); }
for (const f of ['index.html', '404.html', 'style.css', 'script.js', 'sw.js', 'robots.txt', 'sitemap.xml']) {
  if (!fs.existsSync(f)) fail('missing required file: ' + f);
}

// 2. CSS brace balance
const css = fs.readFileSync('style.css', 'utf8');
const open = (css.match(/\{/g) || []).length;
const close = (css.match(/\}/g) || []).length;
if (open !== close) fail(`CSS brace mismatch ${open}/${close}`);

// 3. secret scan (working tree only)
const tree = css + fs.readFileSync('script.js', 'utf8') + fs.readFileSync('index.html', 'utf8');
if (/sk-or-v1/.test(tree)) fail('possible leaked key in working tree');

// 4. every same-origin reference must exist on disk
const refs = new Set();
for (const f of ['index.html', '404.html', 'sw.js', 'manifest.json']) {
  const text = fs.readFileSync(f, 'utf8');
  const re = /(?:src|href)\s*[=:]\s*["'](\.\/[^"']+|\/[^"']*)/g;
  let m;
  while ((m = re.exec(text)) !== null) refs.add(m[1]);
}
const missing = [...refs].filter((r) => {
  const p = r.replace(/^\.\//, '').replace(/^\//, '').split(/[?#]/)[0];
  if (!p || p === '' || p === '/') return false;
  return !fs.existsSync(path.join(process.cwd(), p));
});
if (missing.length > 0) fail('dangling local refs: ' + missing.join(', '));

console.log(`checks passed (braces ${open}/${close}, ${refs.size} local refs ok)`);
