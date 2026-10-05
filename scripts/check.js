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

// 5. SEO basics: single h1, title 30-60 chars, meta description 120-160 chars
const html = fs.readFileSync('index.html', 'utf8');
const h1count = (html.match(/<h1[\s>]/g) || []).length;
if (h1count !== 1) fail(`expected 1 h1, found ${h1count}`);
const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
if (title.length < 30 || title.length > 60) fail(`title length ${title.length} (want 30-60)`);
const desc = (html.match(/name="description"\s*content="([^"]*)"/) || [])[1] || '';
if (desc.length < 120 || desc.length > 160) fail(`meta description length ${desc.length} (want 120-160)`);
const noAlt = (html.match(/<img[^>]*>/g) || []).filter((t) => !/alt=/.test(t));
if (noAlt.length > 0) fail(`${noAlt.length} <img> without alt`);

// 6. duplicate ids
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const dupes = ids.filter((x, i) => ids.indexOf(x) !== i);
if (dupes.length > 0) fail('duplicate ids: ' + [...new Set(dupes)].join(', '));

// 7. in-page anchors + ARIA/label references must resolve
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
for (const a of anchors) {
  if (!ids.includes(a)) fail(`anchor #${a} has no matching id`);
}
const ariaRefs = [
  ...html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g),
].map((m) => m[1]);
for (const a of ariaRefs.flatMap((s) => s.split(/\s+/))) {
  if (a && !ids.includes(a)) fail(`aria reference "${a}" has no matching id`);
}
const forAttrs = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]);
for (const a of forAttrs) {
  if (!ids.includes(a)) fail(`label for="${a}" has no matching id`);
}

// 8. tag balance (void elements excluded)
const voidEls = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const stack = [];
const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)(\s[^<>]*)?\/?>/g;
let tm;
while ((tm = tagRe.exec(html)) !== null) {
  const full = tm[0];
  const name = tm[1].toLowerCase();
  if (voidEls.has(name)) continue;
  if (full.startsWith('</')) {
    const top = stack.pop();
    if (top !== name) fail(`HTML tag mismatch: expected </${top}> before ${full}`);
  } else if (!full.endsWith('/>')) {
    stack.push(name);
  }
}
if (stack.length > 0) fail('unclosed HTML tags: ' + stack.join(', '));

// 9. dead CSS classes: custom classes defined but never used in HTML/JS
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, 'url()');
const cssClasses = new Set(
  [...cssNoComments.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)].map((m) => m[1])
);
const twPrefixes = /^(sm|md|lg|xl|hover|focus|dark|active|visited|group-hover):/;
const usedSrc = html + fs.readFileSync('script.js', 'utf8');
const dead = [...cssClasses].filter((c) => {
  if (c.length <= 4) return false;
  if (/^\d/.test(c)) return false;
  if (c.startsWith('fa-') || ['fa', 'fas', 'far', 'fab'].includes(c)) return false;
  const re = new RegExp(`[\\s"'\\\`:](?:${twPrefixes.source})?${c}(?![a-zA-Z0-9_-])`);
  return !re.test(usedSrc);
});
if (dead.length > 0) console.log('note — possibly unused CSS classes: ' + dead.join(', '));

console.log(`checks passed (braces ${open}/${close}, ${refs.size} local refs ok)`);
