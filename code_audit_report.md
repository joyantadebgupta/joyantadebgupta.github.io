# 🔍 Full Code Audit Report — Joyanta Deb Gupta Portfolio

**Date:** March 17, 2026  
**Scope:** All files, folders, and code in the project  
**Status:** 🔴 No edits made — Read-only analysis

---

## 📁 Project Structure Overview

| File/Folder | Status |
|---|---|
| [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html) (1047 lines) | ✅ Present |
| [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css) (1151 lines) | ✅ Present |
| [script.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/script.js) (407 lines) | ✅ Present |
| [sw.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/sw.js) (102 lines) | ✅ Present |
| [manifest.json](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/manifest.json) (38 lines) | ✅ Present |
| [404.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/404.html) (96 lines) | ✅ Present |
| [robots.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/robots.txt) (30 lines) | ✅ Present |
| [sitemap.xml](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/sitemap.xml) (27 lines) | ✅ Present |
| [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) (57 lines) | ✅ Present |
| [cache.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/cache.htaccess) (70 lines) | ✅ Present |
| [browserconfig.xml](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/browserconfig.xml) (18 lines) | ✅ Present |
| [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt) (8 lines) | ⚠️ Has issues |
| [humans.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/humans.txt) (24 lines) | ⚠️ Has issues |
| [.gitignore](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.gitignore) (47 lines) | ✅ Present |
| [README.md](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/README.md) (62 lines) | ⚠️ Has issues |
| [LICENSE](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/LICENSE) | ✅ Present |
| [.nojekyll](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.nojekyll) | ✅ Present |
| `JOY CV V13.pdf` | ✅ Present |
| `Assets/` (6 image files) | ✅ Present |

---

## 🔴 CRITICAL Issues (Security & Functionality)

### 1. **API Key Exposed in Client-Side Code** 🚨
- **File:** [script.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/script.js#L333)
- **Line:** 333
- **Problem:** Your OpenRouter API key is **hardcoded in plain text** in the JavaScript file:
  ```js
  const API_KEY = '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';
  ```
- **Risk:** Anyone can view this in the browser source and **steal your API key**, run up charges, or abuse it.

> [!CAUTION]
> This is the **most critical issue** in the entire codebase. Anyone who visits your site can extract this key from the page source and use your OpenRouter credits.

### 2. **[security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt) Expired Date**
- **File:** [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt#L2)
- **Line:** 2
- **Problem:** The expiry date is set to `2025-12-31`, which is **already past** (current date: March 17, 2026).
  ```
  Expires: 2025-12-31T23:59:59.000Z
  ```
- **Impact:** Per RFC 9116, an expired [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt) is considered invalid by security researchers.

### 3. **Dead Links in [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt)**
- **File:** [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt#L5-L7)
- **Lines:** 5–7
- **Problem:** These URLs point to pages that **don't exist** on your site:
  ```
  Policy: https://joyantadebgupta.github.io/security-policy
  Acknowledgments: https://joyantadebgupta.github.io/security-acknowledgments
  ```
- **Impact:** Both will return 404 errors.

---

## 🟡 MODERATE Issues (Bugs & Inconsistencies)

### 4. **Outdated [sitemap.xml](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/sitemap.xml) Last Modified Date**
- **File:** [sitemap.xml](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/sitemap.xml#L6)
- **Line:** 6
- **Problem:** `<lastmod>` is set to `2025-12-25`, which is outdated.
  ```xml
  <lastmod>2025-12-25</lastmod>
  ```
- **Impact:** Google may deprioritize crawling if the date appears stale.

### 5. **Outdated [humans.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/humans.txt) Last Update Date**
- **File:** [humans.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/humans.txt#L10)
- **Line:** 10
- **Problem:** Last update says `2025/12/25` — should reflect the current state.

### 6. **[.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) References Wrong Filenames for HTTP/2 Push**
- **File:** [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess#L52-L53)
- **Lines:** 52–53
- **Problem:** The file references `styles.css` and `scripts.js`, but your actual files are named [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css) and [script.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/script.js):
  ```apache
  Header add Link "</styles.css>;rel=preload;as=style"     # ❌ Wrong: styles.css
  Header add Link "</scripts.js>;rel=preload;as=script"     # ❌ Wrong: scripts.js
  ```
- **Impact:** HTTP/2 server push would fail to preload these resources.

### 7. **[.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) `Include` Directive Won't Work on GitHub Pages**
- **File:** [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess#L27)
- **Line:** 27
- **Problem:** `Include cache.htaccess` is an Apache-specific directive. **GitHub Pages does NOT support [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) at all** — it uses a custom server infrastructure.
- **Impact:** Every single rule in both [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) and [cache.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/cache.htaccess) is **completely ignored** on GitHub Pages. They only serve a purpose if you deploy to an Apache-based host.

### 8. **`Cross-Origin-Embedder-Policy: require-corp` May Break External Resources**
- **File:** [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess#L9)
- **Line:** 9
- **Problem:** The `require-corp` policy means all external resources must explicitly opt-in with CORP headers. Resources from `postimg.cc`, `cdn.tailwindcss.com`, Google Fonts, etc., may not set CORP headers, which would cause them to be **blocked** in browsers that enforce this.

### 9. **LinkedIn URL Mismatch in [README.md](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/README.md)**
- **File:** [README.md](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/README.md#L54)
- **Line:** 54
- **Problem:** The LinkedIn URL in README uses a different profile slug than the rest of the site:
  - **README:** `https://www.linkedin.com/in/joyanta-deb-013454134`
  - **Everywhere else:** `https://www.linkedin.com/in/joyantadeb`
- **Impact:** One of these links could be wrong or they could be different profiles.

### 10. **PWA Manifest Icons Use External URLs**
- **File:** [manifest.json](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/manifest.json#L11-L23)
- **Lines:** 11–23
- **Problem:** Both icon entries point to `https://i.postimg.cc/0jpSLKC0/2020-06-05.jpg` — an external URL. Most browsers require PWA icons to be **local, same-origin files** with correct dimensions.
- **Impact:** The PWA install prompt may not appear on some devices, and the installed app will have no proper icon if postimg.cc is down or slow.

### 11. **Manifest Icon Sizes Don't Match Actual Image**
- **File:** [manifest.json](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/manifest.json#L14-L22)
- **Problem:** The manifest declares icons as `192x192` and `512x512`, but the actual image ([2020-06-05.jpg](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/Assets/2020-06-05.jpg)) is a general photo — its true dimensions almost certainly don't match these declared sizes.
- **Impact:** Browsers may reject the icons, leading to PWA install failures.

### 12. **`Assets/` Folder Images Are Unused**
- **File:** `Assets/` folder
- **Problem:** The `Assets/` folder contains 6 image files (total ~13MB), but **none of them are referenced** anywhere in the code. All images use external `postimg.cc` URLs instead.
- **Impact:** These files bloat the repository unnecessarily (~13MB of unused images).

---

## 🔵 MINOR Issues (Best Practices & Polish)

### 13. **Duplicate `box-sizing` Declarations**
- **File:** [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L140-L146) and [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L188-L192)
- **Lines:** 140–146 and 188–192
- **Problem:** The `*, *::before, *::after { box-sizing: border-box; }` rule is declared **twice**.

### 14. **Duplicate [html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/404.html) Selector**
- **File:** [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L148-L151) and [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L762-L765)
- **Problem:** [html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/404.html) is styled at line 148 and again at line 762 with scrollbar properties. These could be consolidated.

### 15. **Duplicate `preconnect` for Google Fonts**
- **File:** [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html#L56) and [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html#L89)
- **Lines:** 56 and 89
- **Problem:** `<link rel="preconnect" href="https://fonts.googleapis.com">` appears **twice** in the `<head>`.

### 16. **Self-Closing Tags Inconsistency**
- **File:** [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html)
- **Problem:** Some `<meta>` and `<link>` tags use self-closing (`/>`) while others don't (`>`). While valid in HTML5, inconsistency reduces code readability.

### 17. **`overflow-x: hidden` on [html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/404.html) and `body`**
- **File:** [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L196-L199)
- **Problem:** Setting `overflow-x: hidden` on both [html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/404.html) and `body` is a common hack to hide layout issues rather than fixing the root cause. It can also break `position: sticky` elements in some browsers.

### 18. **Missing `<meta name="robots">` Closing Tag**
- **File:** [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html#L15)
- **Line:** 15
- **Problem:** Missing self-closing slash — `<meta ... >` instead of `<meta ... />`. This is valid HTML5 but inconsistent with the rest of the file.

### 19. **Dark Mode Classes Conflict with Tailwind**
- **File:** [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css#L83-L137)
- **Problem:** The CSS uses `!important` overrides to force dark mode styles on Tailwind utility classes (e.g., `.dark .bg-white`). While functional, this approach fights against Tailwind's own dark mode system and makes maintenance harder.

### 20. **README Copyright Year Is Outdated**
- **File:** [README.md](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/README.md#L61)
- **Line:** 61
- **Problem:** Says `© 2025` — should be `© 2026`.

### 21. **Service Worker Caches Tailwind CDN** ⚠️
- **File:** [sw.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/sw.js#L9)
- **Line:** 9
- **Problem:** The service worker tries to cache `https://cdn.tailwindcss.com` — this is the **Tailwind CDN play script** which is a large JS file meant only for development/prototyping. Caching it may cause issues since it's not a stable production asset.

> [!IMPORTANT]
> Using the Tailwind CDN (`cdn.tailwindcss.com`) is intended for **development only**, not production. Tailwind's own docs recommend building a production CSS file instead.

### 22. **Font Awesome SRI Hash Could Become Stale**
- **File:** [index.html](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/index.html#L85-L87)
- **Problem:** The `integrity` hash for Font Awesome 6.5.2 is hardcoded. If the CDN updates the file at that URL, the integrity check will fail and icons will break.

---

## ✅ What's Working Well

| Area | Assessment |
|---|---|
| **HTML Structure** | Well-organized, semantic sections with proper heading hierarchy |
| **SEO** | Strong: Schema.org markup, OpenGraph, Twitter Cards, sitemap, robots.txt |
| **Accessibility** | Good: `aria-label`s on buttons, `alt` text on images, navigation roles |
| **Dark Mode** | Full implementation with desktop + mobile toggle sync |
| **Responsive Design** | Comprehensive media queries for all screen sizes |
| **Contact Form** | Proper Formspree integration with loading/success/error states |
| **AI Chatbot** | Functional with local FAQ responses + API fallback |
| **Animations** | Smooth scroll-triggered animations with IntersectionObserver |
| **Dynamic Experience Counter** | Auto-calculates years from career start date |
| **404 Page** | Clean, self-contained design |
| **Print Styles** | Hides non-essential elements for printing |

---

## 📊 Issue Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 3 |
| 🟡 Moderate | 9 |
| 🔵 Minor | 10 |
| **Total** | **22** |

---

## 🏆 Top 5 Priorities to Fix

1. **🔴 Remove/secure the exposed API key** (script.js line 333)
2. **🟡 Fix [.htaccess](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/.htaccess) wrong filenames** (`styles.css` → [style.css](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/style.css), `scripts.js` → [script.js](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/script.js))
3. **🟡 Fix LinkedIn URL mismatch** in README.md
4. **🟡 Create proper local PWA icons** (192×192 and 512×512 PNG files)
5. **🔴 Update expired [security.txt](file:///d:/Software/Mobile%20App/Websites/Joyanta%20Website%202/Web%202/joyantadebgupta.github.io-main/joyantadebgupta.github.io-main/security.txt)** date and remove dead links
