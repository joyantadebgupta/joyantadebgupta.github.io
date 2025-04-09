// Add error handling for image loading
const handleImageError = (img) => {
    img.onerror = () => {
        img.src = 'placeholder.jpg';
        console.error(`Failed to load image: ${img.src}`);
    };
};

// Preload images
const preloadImages = () => {
    const images = [
        'https://i.ibb.co/9mpkGKxQ/2020-06-05.jpg',
        'https://i.ibb.co/bMJwH2H5/PXL-20211010-112005588ss.jpg',
        'https://i.ibb.co/7NnpLkWb/68-2.webp'
    ];

    images.forEach(imgSrc => {
        const img = new Image();
        handleImageError(img);
        img.src = imgSrc;
        img.loading = 'lazy'; // Add lazy loading
    });
};

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

// Form submission with mobile optimizations
const contactForm = document.getElementById('contactForm');
let lastSubmissionTime = 0;
const RATE_LIMIT_SECONDS = 30; // 30 seconds between submissions

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Rate limiting
        const currentTime = Date.now();
        if (currentTime - lastSubmissionTime < RATE_LIMIT_SECONDS * 1000) {
            alert('Please wait before submitting again.');
            return;
        }

        // Mobile-specific form validation
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Input sanitization
        const sanitizedData = {};
        for (let [key, value] of formData.entries()) {
            sanitizedData[key] = sanitizeInput(value);
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            await fetch(this.action, {
                method: 'POST',
                body: new URLSearchParams(sanitizedData),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            alert('Message sent successfully!');
            this.reset();
            lastSubmissionTime = currentTime;
        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem sending your message. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });
}

// Input sanitization function
function sanitizeInput(input) {
    // Prevent XSS attacks
    const escaped = input.replace(/[&<>'"\\]/g, function(c) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '\\': '&#92;'
        }[c];
    });
    
    // Prevent SQL injection
    const sqlEscaped = escaped.replace(/([%_])/g, function(c) {
        return `\\${c}`;
    });
    
    return sqlEscaped;
}

// Mobile-friendly scroll behavior
window.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Initialize animations
    animateOnScroll();
});

// Intersection Observer for Animations
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(element => {
        observer.observe(element);
    });
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.disconnect();
                }
            });
        });

        observer.observe(img);
    });
}

// Initialize lazy loading
window.addEventListener('load', lazyLoadImages);

// Mobile-friendly touch events
function initializeTouchEvents() {
    const touchElements = document.querySelectorAll('.touch-friendly');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            element.classList.add('touch-active');
        });

        element.addEventListener('touchend', () => {
            element.classList.remove('touch-active');
        });
    });
}

// Initialize touch events
window.addEventListener('DOMContentLoaded', initializeTouchEvents);

// Mobile-friendly form validation
let recaptchaComplete = false;

function onRecaptchaSuccess() {
    recaptchaComplete = true;
    document.querySelector('.recaptcha-error').style.display = 'none';
}

function onRecaptchaExpired() {
    recaptchaComplete = false;
}

function validateForm(form) {
    // Phone validation - accept any valid phone number
    const phone = form.querySelector('#phone');
    if (phone.value) {
        const phoneRegex = /^[+]?[0-9]{8,}$/;
        if (!phoneRegex.test(phone.value)) {
            alert('Please enter a valid phone number');
            return false;
        }
    }

    // Message validation
    const message = form.querySelector('#message');
    if (message.value.length < 10) {
        alert('Message must be at least 10 characters long');
        return false;
    }

    // reCAPTCHA validation
    if (!recaptchaComplete) {
        document.querySelector('.recaptcha-error').style.display = 'block';
        return false;
    }

    return true;
}

function showInputError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message') || 
                    createErrorElement(input);
    errorDiv.textContent = input.title || 'This field is required';
}

function hideInputError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
}

function createErrorElement(input) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    input.parentElement.appendChild(errorDiv);
    return errorDiv;
}

// Initialize form validation
window.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});

// Error handling for form submissions
window.addEventListener('error', function(e) {
    console.error('Error:', e);
    alert('An error occurred. Please try again.');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise Rejection:', e.reason);
    alert('An error occurred. Please try again.');
});

// Current year for footer
const currentYear = document.getElementById('currentYear');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    const level = bar.parentElement.querySelector('span:last-child').textContent;
    bar.style.width = level;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
});

// Parallax effect for hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

// Project cards hover effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Experience cards hover effect
const experienceCards = document.querySelectorAll('.experience-card');
experienceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add smooth scroll behavior to the window
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))';
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--dark), #0f172a)';
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
});

// Add smooth transitions to all elements
const elements = document.querySelectorAll('*');
elements.forEach(element => {
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Security feature - prevent email scraping
document.addEventListener('DOMContentLoaded', function() {
    const emailElements = document.querySelectorAll('[data-email]');
    
    emailElements.forEach(el => {
        const email = el.getAttribute('data-email').split('').reverse().join('');
        el.setAttribute('href', 'mailto:' + email.split('').reverse().join(''));
        el.textContent = email.split('').reverse().join('');
    });

    // Preload images
    preloadImages();
});

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
            // Scroll Down
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // Scroll Up
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Intersection Observer for Animations
    const animateOnScroll = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Observe cards and items
        document.querySelectorAll('.experience-card, .project-card, .skill-item, .timeline-content').forEach(item => {
            observer.observe(item);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Back to Top Button
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            // Here you would typically send the form data to your server
            // For now, we'll just show a success message
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent!';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.disabled = false;
                }, 2000);
            }, 2000);
        });
    }

    // Add hover effects to skill progress bars
    document.querySelectorAll('.skill-progress').forEach(progress => {
        const value = progress.style.width;
        progress.addEventListener('mouseenter', () => {
            progress.style.width = '100%';
        });
        progress.addEventListener('mouseleave', () => {
            progress.style.width = value;
        });
    });

    // Add animation to timeline dots
    document.querySelectorAll('.timeline-dot').forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.2)';
        });
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
        });
    });

    // Add parallax effect to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Add scroll reveal animations
    const sr = ScrollReveal({
        distance: '60px',
        duration: 2000,
        delay: 400,
        reset: true
    });

    sr.reveal('.hero-content', { origin: 'bottom' });
    sr.reveal('.about-content', { origin: 'left' });
    sr.reveal('.about-image', { origin: 'right' });
    sr.reveal('.experience-card', { origin: 'bottom', interval: 200 });
    sr.reveal('.project-card', { origin: 'bottom', interval: 200 });
    sr.reveal('.timeline-content', { origin: 'left', interval: 200 });
    sr.reveal('.contact-info', { origin: 'left' });
    sr.reveal('.contact-form', { origin: 'right' });

    // Initialize timeline animations
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });

    // Add a subtle animation to the timeline dots
    document.querySelectorAll('.timeline-dot').forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'translateX(-50%) scale(1.2)';
        });
        
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'translateX(-50%) scale(1)';
        });
    });
});

// Initialize ScrollReveal for skills section
ScrollReveal().reveal('.skills-grid', {
    delay: 200,
    distance: '20px',
    origin: 'bottom',
    duration: 600,
    easing: 'ease-out',
    interval: 100,
    cleanup: true,
    afterReveal: (el) => el.classList.add('visible')
});

ScrollReveal().reveal('.skill-category', {
    delay: 300,
    distance: '20px',
    origin: 'left',
    duration: 400,
    interval: 100,
    cleanup: true,
    afterReveal: (el) => el.classList.add('visible')
});

// Add animation to skill items
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-category ul li');
    let delay = 0;
    
    skillItems.forEach(item => {
        setTimeout(() => {
            item.classList.add('visible');
        }, delay);
        delay += 100;
    });
});
