// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    // Add scrolled class for background styling
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show on scroll direction
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down & past threshold
        navbar.classList.add('hidden');
    } else {
        // Scrolling up
        navbar.classList.remove('hidden');
    }
    
    lastScrollY = window.scrollY;
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove the class so the animation repeats when scrolling back
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-up, .fade-in').forEach(element => {
    observer.observe(element);
});

// Smooth scroll offset for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    
    // Close menu when a link or button is clicked
    const links = navLinks.querySelectorAll("a, .btn");
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}

// Contact Form Toggle
const toggleContactBtn = document.getElementById('toggleContactBtn');
const contactFormContainer = document.getElementById('contactFormContainer');

if (toggleContactBtn && contactFormContainer) {
    toggleContactBtn.addEventListener('click', () => {
        contactFormContainer.classList.toggle('expanded');
        if (contactFormContainer.classList.contains('expanded')) {
            toggleContactBtn.innerText = 'Close Form';
        } else {
            toggleContactBtn.innerText = 'Get in Touch';
        }
    });
}

// Safely hide Spline watermark via CSS
const removeSplineLogo = setInterval(() => {
    // Target common Spline logo elements
    const splineLogos = document.querySelectorAll('a[href*="spline.design"], img[src*="spline"]');
    splineLogos.forEach(logo => {
        if (logo) {
            logo.style.setProperty('display', 'none', 'important');
            logo.style.setProperty('opacity', '0', 'important');
            logo.style.setProperty('pointer-events', 'none', 'important');
        }
    });

    // Target the shadow DOM host if injected dynamically
    const canvas = document.getElementById('canvas3d');
    if (canvas && canvas.parentNode) {
        const children = canvas.parentNode.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // Hide any unknown sibling elements that aren't our loader or hider
            if (child !== canvas && child.id !== 'spline-loader' && !child.classList.contains('spline-watermark-hider')) {
                child.style.setProperty('display', 'none', 'important');
            }
        }
    }
}, 500);

// Clear interval after 15 seconds to ensure it catches late renders
setTimeout(() => clearInterval(removeSplineLogo), 15000);

// AJAX Form Submission
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (submitBtn) submitBtn.classList.add('loading');
        
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (submitBtn) submitBtn.classList.remove('loading');
            if (data.success) {
                // Show toast
                toast.classList.add('show');
                this.reset(); // clear form
                
                // Hide toast after 3s
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            } else {
                alert("Oops! There was a problem submitting your form");
            }
        })
        .catch(error => {
            if (submitBtn) submitBtn.classList.remove('loading');
            alert("Oops! There was a problem submitting your form");
        });
    });
}
