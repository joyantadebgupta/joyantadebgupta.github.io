document.addEventListener('DOMContentLoaded', () => {
    try {
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

        // --- Active nav link on scroll ---
        const sections = document.querySelectorAll('main section[id]');
        const mainNavLinks = document.querySelectorAll('#main-nav a.nav-link');
        const mobileNavLinks = document.querySelectorAll('#mobile-menu a.nav-link');

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
                link.classList.toggle('bg-indigo-100', isActive);
                link.classList.toggle('dark:bg-slate-800', isActive);
                link.classList.toggle('text-indigo-600', isActive);
                link.classList.toggle('dark:text-indigo-400', isActive);
                link.classList.toggle('font-semibold', isActive);
                link.classList.toggle('text-slate-700', !isActive);
                link.classList.toggle('dark:text-slate-200', !isActive);
            });
        }
        updateActiveLink();
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(() => {
                updateActiveLink();
                scrollTicking = false;
            });
        }, { passive: true });

        // --- Dark Mode Logic ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

        // Default: saved choice wins; first visit follows OS preference.
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
        }
        initTheme();

        // Function to toggle dark mode
        function toggleDarkMode() {
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


        // --- Experience Counter Animation ---
        // Calculate years dynamically from career start (January 26, 2016)
        const careerStart = new Date(2016, 0, 26); // January 26, 2016
        const now = new Date();
        const yearsExperience = ((now - careerStart) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
        const targetYears = parseFloat(yearsExperience);

        // Update all experience year elements
        const updateAllExperienceYears = () => {
            // 1. Stats section (9.9+)
            const statsYears = document.getElementById('stats-years');
            if (statsYears) {
                statsYears.textContent = targetYears + '+';
            }

            // 2. About section (over X years)
            const aboutYears = document.getElementById('about-years');
            if (aboutYears) {
                aboutYears.textContent = 'over ' + Math.floor(targetYears) + ' years';
            }

            // 3. Footer section (X+)
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

        // --- Skills Data ---

        // --- Skills and Footer Services are now statically rendered in HTML for SEO ---


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
                formFeedbackEl.className = 'mt-3 text-xs font-medium h-4';
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
                        formFeedbackEl.className = 'mt-3 text-xs font-medium h-4';
                    }
                }, 7000);
            });
        }

        // --- Set current year in footer ---
        const currentYearEl = document.getElementById('currentYear');
        if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

        // --- Scroll progress hairline ---
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            let progressTicking = false;
            const updateProgress = () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
                scrollProgress.style.transform = `scaleX(${ratio})`;
                progressTicking = false;
            };
            window.addEventListener('scroll', () => {
                if (progressTicking) return;
                progressTicking = true;
                window.requestAnimationFrame(updateProgress);
            }, { passive: true });
            updateProgress();
        }

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
                if (show && focusPanel) p.focus({ preventScroll: true });
            });
        }

        if (expTabs.length > 0) {
            expTabs.forEach((tab, idx) => {
                tab.addEventListener('click', () => activateExpTab(tab, false));
                tab.addEventListener('keydown', (e) => {
                    let next = null;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = expTabs[(idx + 1) % expTabs.length];
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = expTabs[(idx - 1 + expTabs.length) % expTabs.length];
                    if (next) {
                        e.preventDefault();
                        next.focus();
                        activateExpTab(next, false);
                    }
                });
            });
        }

        // --- Back to Top Button ---
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            let backToTopTicking = false;
            window.addEventListener('scroll', () => {
                if (backToTopTicking) return;
                backToTopTicking = true;
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                    } else {
                        backToTopButton.classList.add('opacity-0', 'pointer-events-none');
                    }
                    backToTopTicking = false;
                });
            }, { passive: true });
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

    } catch (error) {
        console.error('Initialization error:', error);
    }
});
