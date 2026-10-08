document.addEventListener('DOMContentLoaded', () => {
    const safe = (name, fn) => { try { fn(); } catch (e) { console.error(name + ' init error:', e); } };

    safe('async-css', () => {
        // Activate async stylesheets (replaces inline onload handlers: keeps CSP free of 'unsafe-inline')
        document.querySelectorAll('link[data-async-css]').forEach(link => {
            link.media = 'all';
        });
    });

    safe('img-fallback', () => {
        // CSP-safe image fallback (replaces inline onerror= which CSP blocks)
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            img.addEventListener('error', () => {
                const fb = img.getAttribute('data-fallback');
                if (fb && !img.dataset.fbDone) {
                    img.dataset.fbDone = '1';
                    try {
                        const cur = new URL(img.src, location.href).pathname;
                        const tgt = new URL(fb, location.href).pathname;
                        if (cur === tgt) return;
                    } catch (e) { /* compare failed — still try fallback once */ }
                    // Break circular nesco<->industrial chain: fall back to icon
                    if (img.src.includes('project-nesco') && fb.includes('project-industrial')) {
                        img.src = './icons/icon-192.jpg';
                    } else if (img.src.includes('project-industrial') && fb.includes('project-nesco')) {
                        img.src = './icons/icon-192.jpg';
                    } else {
                        img.src = fb;
                    }
                }
            });
        });
    });

    safe('mobile-menu', () => {
        // --- Mobile menu toggle ---
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = mobileMenuButton ? mobileMenuButton.querySelector('i') : null;

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
                mobileMenuButton.setAttribute('aria-controls', 'mobile-menu');
                mobileMenu.classList.toggle('hidden');
                mobileMenu.classList.toggle('flex');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.toggle('fa-bars');
                    mobileMenuIcon.classList.toggle('fa-times');
                }
            });

            // Close mobile menu on link click
            mobileMenu.querySelectorAll('a.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    if (mobileMenuIcon) {
                        mobileMenuIcon.classList.add('fa-bars');
                        mobileMenuIcon.classList.remove('fa-times');
                    }
                });
            });
        }
    });

    // --- Shared scroll state: single rAF loop for active-link + progress + back-to-top ---
    const sections = document.querySelectorAll('main section[id]');
    const mainNavLinks = document.querySelectorAll('#main-nav a.nav-link');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a.nav-link');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopButton = document.getElementById('back-to-top');

    function updateActiveLink() {
        let currentSectionId = '';
        const headerOffset = 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - headerOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        mobileNavLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSectionId}`;
            link.classList.toggle('active', isActive);
        });
    }

    function updateProgress() {
        if (!scrollProgress) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        scrollProgress.style.transform = `scaleX(${ratio})`;
    }

    function updateBackToTop() {
        if (!backToTopButton) return;
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            backToTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    safe('scroll', () => {
        updateActiveLink();
        updateProgress();
        updateBackToTop();
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                updateActiveLink();
                updateProgress();
                updateBackToTop();
                ticking = false;
            });
        }, { passive: true });
    });

    safe('theme', () => {
        // --- Dark Mode Logic ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

        // Default: saved choice wins; first visit follows OS preference.
        function syncPressed() {
            const isDark = document.documentElement.classList.contains('dark');
            if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', String(isDark));
            const mobileBtn = document.getElementById('theme-toggle-mobile');
            if (mobileBtn) mobileBtn.setAttribute('aria-pressed', String(isDark));
        }

        function initTheme() {
            if (!themeToggleDarkIcon || !themeToggleLightIcon) return;
            const savedTheme = localStorage.getItem('color-theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
                themeToggleLightIcon.classList.remove('hidden');
                themeToggleDarkIcon.classList.add('hidden');
            } else {
                // Default to light mode (no dark class)
                document.documentElement.classList.remove('dark');
                themeToggleLightIcon.classList.add('hidden');
                themeToggleDarkIcon.classList.remove('hidden');
            }
            syncPressed();
        }
        initTheme();

        function playSwap(btn) {
            if (!btn) return;
            btn.classList.remove('swap');
            void btn.offsetWidth; // restart animation
            btn.classList.add('swap');
        }

        // Function to toggle dark mode
        function toggleDarkMode(ev) {
            if (!themeToggleDarkIcon || !themeToggleLightIcon) return;
            // toggle icons for desktop
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // toggle icons for mobile
            const mobileThemeDarkIcon = document.getElementById('theme-toggle-dark-icon-mobile');
            const mobileThemeLightIcon = document.getElementById('theme-toggle-light-icon-mobile');
            if (mobileThemeDarkIcon && mobileThemeLightIcon) {
                mobileThemeDarkIcon.classList.toggle('hidden');
                mobileThemeLightIcon.classList.toggle('hidden');
            }

            // Toggle dark mode class
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
            syncPressed();
            playSwap(themeToggleBtn);
            playSwap(document.getElementById('theme-toggle-mobile'));
            if (ev && ev.currentTarget) playSwap(ev.currentTarget);
        }

        // Desktop toggle
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleDarkMode);

        // Mobile toggle
        const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
        if (themeToggleMobileBtn) {
            themeToggleMobileBtn.addEventListener('click', toggleDarkMode);
        }

        // Sync mobile icons on page load
        const mobileThemeDarkIcon = document.getElementById('theme-toggle-dark-icon-mobile');
        const mobileThemeLightIcon = document.getElementById('theme-toggle-light-icon-mobile');
        if (mobileThemeDarkIcon && mobileThemeLightIcon) {
            if (document.documentElement.classList.contains('dark')) {
                mobileThemeLightIcon.classList.remove('hidden');
                mobileThemeDarkIcon.classList.add('hidden');
            } else {
                mobileThemeLightIcon.classList.add('hidden');
                mobileThemeDarkIcon.classList.remove('hidden');
            }
        }

        // Follow OS changes only when user has no saved choice
        if (window.matchMedia) {
            try {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (localStorage.getItem('color-theme')) return;
                    document.documentElement.classList.toggle('dark', e.matches);
                });
            } catch (e) { /* older browsers: ignore */ }
        }
    });

    safe('reveal', () => {
        // --- Scroll-triggered animations ---
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    });

    safe('experience', () => {
        // --- Experience Counter Animation ---
        // Career start: first appointment Jan 2016 (single source of truth)
        const CAREER_START = new Date(2016, 0, 26);
        const now = new Date();
        const yearsExperience = ((now - CAREER_START) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
        const targetYears = parseFloat(yearsExperience);

        // Update all experience year elements
        const updateAllExperienceYears = () => {
            const statsYears = document.getElementById('stats-years');
            if (statsYears) {
                statsYears.textContent = targetYears + '+';
            }

            const aboutYears = document.getElementById('about-years');
            if (aboutYears) {
                aboutYears.textContent = 'over ' + Math.floor(targetYears) + ' years';
            }

            const footerYears = document.getElementById('footer-years');
            if (footerYears) {
                footerYears.textContent = targetYears + '+';
            }
        };

        // Hero section animated counter
        const experienceCounter = document.getElementById('experience-counter');
        if (experienceCounter) {
            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduceMotion) {
                experienceCounter.textContent = targetYears;
            } else {
                const duration = 1500;
                const frameRate = 30;
                const totalFrames = duration / (1000 / frameRate);
                const increment = targetYears / totalFrames;
                let currentVal = 0;
                let started = false;

                const startCounter = () => {
                    if (started) return;
                    started = true;
                    const timer = setInterval(() => {
                        currentVal += increment;
                        if (currentVal >= targetYears) {
                            experienceCounter.textContent = targetYears;
                            clearInterval(timer);
                        } else {
                            experienceCounter.textContent = currentVal.toFixed(1);
                        }
                    }, 1000 / frameRate);
                };

                if ('IntersectionObserver' in window) {
                    const counterObserver = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                startCounter();
                                obs.disconnect();
                            }
                        });
                    }, { threshold: 0.3 });
                    counterObserver.observe(experienceCounter);
                } else {
                    startCounter();
                }
            }
        }

        // Update all other experience year elements
        updateAllExperienceYears();
    });

    safe('contact-form', () => {
        // --- Contact Form Submission ---
        const contactForm = document.getElementById('contact-form');
        const formFeedbackEl = document.getElementById('form-feedback');
        const submitButton = document.getElementById('submit-button');

        if (contactForm && formFeedbackEl && submitButton) {
            contactForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const originalButtonContent = submitButton.innerHTML;
                const formData = new FormData(contactForm);
                submitButton.disabled = true;
                submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2.5"></i> Sending...`;
                formFeedbackEl.textContent = '';
                formFeedbackEl.className = 'text-sm font-medium min-h-[1.25rem]';
                try {
                    const response = await fetch(contactForm.action, {
                        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        formFeedbackEl.textContent = "Message sent successfully!";
                        formFeedbackEl.classList.add('text-green-300');
                        contactForm.reset();
                        submitButton.innerHTML = `<i class="fas fa-check mr-2.5"></i> Sent!`;
                        setTimeout(() => {
                            submitButton.innerHTML = originalButtonContent;
                            submitButton.disabled = false;
                            formFeedbackEl.textContent = '';
                        }, 5000);
                    } else {
                        let errMsg = "Oops! Problem submitting form.";
                        try {
                            const data = await response.json();
                            errMsg = (data.errors && data.errors.map(e => e.message).join(", ")) || errMsg;
                        } catch (parseErr) {
                            errMsg = "Oops! Problem submitting form (status " + response.status + ").";
                        }
                        formFeedbackEl.textContent = errMsg;
                        formFeedbackEl.classList.add('text-red-300');
                        submitButton.innerHTML = originalButtonContent;
                        submitButton.disabled = false;
                    }
                } catch (error) {
                    formFeedbackEl.textContent = "Oops! Network problem. Try again.";
                    formFeedbackEl.classList.add('text-red-400');
                    submitButton.innerHTML = originalButtonContent;
                    submitButton.disabled = false;
                }
                setTimeout(() => {
                    if (formFeedbackEl.textContent && !formFeedbackEl.textContent.includes("successfully")) {
                        formFeedbackEl.textContent = '';
                        formFeedbackEl.className = 'text-sm font-medium min-h-[1.25rem]';
                    }
                }, 7000);
            });

            // Clear custom validity on input
            contactForm.querySelectorAll('input, textarea').forEach(el => {
                el.addEventListener('input', () => {
                    el.removeAttribute('aria-invalid');
                });
                el.addEventListener('invalid', () => {
                    el.setAttribute('aria-invalid', 'true');
                });
            });
        }
    });

    safe('misc', () => {
        // --- Set current year in footer ---
        const currentYearEl = document.getElementById('currentYear');
        if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    });

    safe('exp-tabs', () => {
        // --- Experience role tabs ---
        const expTabs = Array.from(document.querySelectorAll('[data-exp-tabs] [role="tab"]'));
        const expPanels = Array.from(document.querySelectorAll('[data-exp-tabs] [role="tabpanel"]'));

        function activateExpTab(tab, focusPanel) {
            if (!tab) return;
            expTabs.forEach(t => {
                const selected = t === tab;
                t.classList.toggle('is-active', selected);
                t.setAttribute('aria-selected', String(selected));
                t.tabIndex = selected ? 0 : -1;
            });
            expPanels.forEach(p => {
                const show = p.id === tab.getAttribute('aria-controls');
                p.classList.toggle('is-active', show);
                if (show) {
                    p.removeAttribute('hidden');
                    if (focusPanel) p.focus({ preventScroll: true });
                } else {
                    p.setAttribute('hidden', '');
                }
            });
        }

        if (expTabs.length > 0) {
            expTabs.forEach((tab, idx) => {
                tab.addEventListener('click', () => activateExpTab(tab, false));
                tab.addEventListener('keydown', (e) => {
                    let next = null;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = expTabs[(idx + 1) % expTabs.length];
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = expTabs[(idx - 1 + expTabs.length) % expTabs.length];
                    if (e.key === 'Home') next = expTabs[0];
                    if (e.key === 'End') next = expTabs[expTabs.length - 1];
                    if (next) {
                        e.preventDefault();
                        next.focus();
                        activateExpTab(next, false);
                    }
                });
            });
        }
    });

    safe('back-to-top', () => {
        // --- Back to Top Button (visibility handled in shared scroll loop) ---
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    });

    safe('email', () => {
        // --- Email de-obfuscation (moved from inline script: keeps CSP free of 'unsafe-inline') ---
        document.querySelectorAll('.obfuscated-email').forEach(function (el) {
            if (el.querySelector('a')) return; // already linked (noscript-friendly markup)
            const user = el.getAttribute('data-user') || 'jadg.power';
            const domain = el.getAttribute('data-domain') || 'gmail.com';
            const email = user + '@' + domain;
            const link = document.createElement('a');
            link.href = 'mailto:' + email;
            link.textContent = email;
            link.className = 'footer-link';
            el.replaceWith(link);
        });
    });
});

// Service worker registration (moved from inline script; runs independently of DOMContentLoaded)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(function () {
            /* offline support unavailable — site still works online */
        });
    });
}
