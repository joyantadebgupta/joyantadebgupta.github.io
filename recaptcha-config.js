// reCAPTCHA configuration
window.recaptchaOptions = {
    sitekey: 'YOUR_RECAPTCHA_SITE_KEY', // Replace with your actual site key
    theme: 'dark',
    size: 'invisible',
    callback: function(response) {
        // Handle successful verification
        console.log('reCAPTCHA verified successfully');
    },
    'expired-callback': function() {
        // Handle expired response
        console.log('reCAPTCHA response expired');
    }
};

// Initialize reCAPTCHA
function initRecaptcha() {
    grecaptcha.ready(function() {
        grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {action: 'submit'})
            .then(function(token) {
                // Verify the token on your server
                console.log('reCAPTCHA token:', token);
            });
    });
}

// Add reCAPTCHA script
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
});

// Ensure no references to "joyanta.html" exist. Update to "index.html" if found.
