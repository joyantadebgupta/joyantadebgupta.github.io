document.addEventListener('DOMContentLoaded', () => {
    try {
        // --- Mobile menu toggle ---
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', () => {
            const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            mobileMenuIcon.classList.toggle('fa-bars');
            mobileMenuIcon.classList.toggle('fa-times');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenuButton.setAttribute('aria-expanded', false);
                mobileMenuIcon.classList.add('fa-bars');
                mobileMenuIcon.classList.remove('fa-times');
            });
        });

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
                link.classList.remove('active', 'bg-indigo-100', 'text-indigo-600', 'font-semibold');
                link.classList.add('text-slate-700');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active', 'bg-indigo-100', 'text-indigo-600', 'font-semibold');
                    link.classList.remove('text-slate-700');
                }
            });
        }
        updateActiveLink();
        window.addEventListener('scroll', updateActiveLink);

        // --- Dark Mode Logic ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

        // Check for saved user preference, if any, on load of the website
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeToggleLightIcon.classList.remove('hidden');
            themeToggleDarkIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
        }

        // Function to toggle dark mode
        function toggleDarkMode() {
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

            // if set via local storage previously
            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        }

        // Desktop toggle
        themeToggleBtn.addEventListener('click', toggleDarkMode);

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
        const experienceCounter = document.getElementById('experience-counter');
        if (experienceCounter) {
            // Calculate years dynamically from career start (January 26, 2016)
            const careerStart = new Date(2016, 0, 26); // January 26, 2016
            const now = new Date();
            const yearsExperience = ((now - careerStart) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
            const targetYears = parseFloat(yearsExperience);

            const duration = 1500;
            const frameRate = 30;
            const totalFrames = duration / (1000 / frameRate);
            const increment = targetYears / totalFrames;
            let currentVal = 0;

            const timer = setInterval(() => {
                currentVal += increment;
                if (currentVal >= targetYears) {
                    experienceCounter.textContent = targetYears;
                    clearInterval(timer);
                } else {
                    experienceCounter.textContent = currentVal.toFixed(1);
                }
            }, 1000 / frameRate);

            // Also update the stats section
            const statsYears = document.getElementById('stats-years');
            if (statsYears) {
                statsYears.textContent = targetYears + '+';
            }
        }

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
                        const data = await response.json();
                        formFeedbackEl.textContent = data.errors?.map(e => e.message).join(", ") || "Oops! Problem submitting form.";
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

        // --- Back to Top Button ---
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
                } else {
                    backToTopButton.classList.add('opacity-0', 'pointer-events-none');
                }
            });
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // --- AI CHATBOT FUNCTIONALITY (for OpenRouter) ---
        const chatToggle = document.getElementById('ai-chat-toggle');
        const chatWindow = document.getElementById('ai-chat-window');
        const chatClose = document.getElementById('ai-chat-close');
        const chatSend = document.getElementById('ai-chat-send');
        const chatInput = document.getElementById('ai-chat-input');
        const chatMessages = document.getElementById('ai-chat-messages');

        function toggleChat() {
            chatWindow.classList.toggle('active');
        }

        // Close chat when clicking outside
        document.addEventListener('click', function (event) {
            if (chatWindow.classList.contains('active') &&
                !chatWindow.contains(event.target) &&
                !chatToggle.contains(event.target)) {
                chatWindow.classList.remove('active');
            }
        });

        function addMessage(content, isUser = false) {
            const message = document.createElement('div');
            message.className = `ai-message ${isUser ? 'user' : ''}`;
            message.innerHTML = `
        ${isUser ? '' : `
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-robot text-indigo-600"></i>
        </div>`}
        <div class="ai-message-content">
          <p>${content}</p>
        </div>
      `;
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        async function getSonaiResponse(query) {
            const queryLower = query.toLowerCase();

            // 1. Check for personal portfolio questions first
            if (queryLower.includes('portfolio') || queryLower.includes('experience') || queryLower.includes('background') || queryLower.includes('who are you')) {
                const careerStart = new Date(2016, 0, 26);
                const yearsExp = ((new Date() - careerStart) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
                return `I'm your portfolio assistant. Joyanta is an Electrical Design & Project Engineer with nearly ${yearsExp} years of experience, specializing in MV/LV system design, substation design (AIS & GIS), and project management. He is currently the Assistant Manager at Novelty Infrastructures Limited.`;
            }

            if (queryLower.includes('education') || queryLower.includes('study') || queryLower.includes('degree')) {
                return `Joyanta's educational background includes a B.Sc. in Electrical & Electronics Engineering from Uttara University and a Diploma in Power Technology from Mymensingh Polytechnic.`;
            }

            if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('email')) {
                return `You can reach Joyanta through: <br>• Email: jadg.power@gmail.com <br>• Phone: +8801671801435 <br>• Location: Mirpur-1, Dhaka, Bangladesh.`;
            }

            if (queryLower.includes('project')) {
                return `Joyanta has led and contributed to many significant projects, including 5 NESCO AIS substations, major industrial designs for clients like ACI Pharma, and the supervision of 24 DESCO GIS substations. You can see more in the 'Featured Projects' section.`
            }

            // 2. If it's not a personal question, call the OpenRouter AI API
            try {
                const API_KEY = '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';

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://joyantadebgupta.github.io',
                        'X-Title': 'Joyanta Deb Gupta Portfolio'
                    },
                    body: JSON.stringify({
                        "model": "openai/gpt-oss-20b:free",
                        "messages": [
                            { "role": "user", "content": query }
                        ]
                    })
                });

                if (!response.ok) {
                    console.error("API Error:", response.status, await response.text());
                    return "I apologize, but I'm having trouble connecting to my AI brain right now. Please try again later.";
                }

                const data = await response.json();
                const botResponse = data.choices[0].message.content;
                return botResponse;

            } catch (error) {
                console.error("Fetch Error:", error);
                return "I seem to be having a network issue. Please check your connection or try again.";
            }
        }

        async function handleSend() {
            const message = chatInput.value.trim();
            if (!message) return;

            chatInput.value = '';
            addMessage(message, true);

            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'ai-message';
            typingIndicator.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-robot text-indigo-600"></i>
        </div>
        <div class="ai-message-content">
          <p><i class="fas fa-circle-notch fa-spin"></i> Typing...</p>
        </div>
      `;
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const response = await getSonaiResponse(message);
                typingIndicator.remove();
                addMessage(response);
            } catch (error) {
                typingIndicator.remove();
                addMessage("I apologize, but I've encountered an error. Please try again.");
            }
        }

        chatToggle.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', toggleChat);
        chatSend.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

    } catch (error) {
        console.error('Initialization error:', error);
    }
});
