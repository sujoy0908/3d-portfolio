// script.js

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
            
            // Explicitly close mobile menu if open
            const navLinks = document.getElementById("navLinks");
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
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



// Dynamic Project Data
let projectsData = [];
let portfolioItems = [];

function attachPortfolioListeners() {
    portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length > 0) {
        portfolioItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('active-project')) return;
                
                const data = projectsData[index];
                if (!data) return;

                // Update DOM
                portfolioItems.forEach(i => i.classList.remove('active-project'));
                item.classList.add('active-project');

                document.getElementById('detail-title').innerText = data.title;
                document.getElementById('detail-desc').innerText = data.description;
                document.getElementById('detail-poly').innerText = data.polycount;
                document.getElementById('detail-textures').innerText = data.textures;
                
                const engineContainer = document.getElementById('detail-engine');
                engineContainer.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-accent-mint">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    ${data.engine}
                `;

                const modelViewer = document.getElementById('portfolio-model-viewer');
                modelViewer.src = data.modelSrc;
                if (data.poster) {
                    modelViewer.poster = data.poster;
                }

                const sliderFinal = document.getElementById('slider-final');
                const sliderWireframe = document.getElementById('slider-wireframe');
                
                // Fade out
                sliderFinal.classList.add('fade-out');
                sliderWireframe.classList.add('fade-out');

                setTimeout(() => {
                    sliderFinal.src = data.sliderBefore;
                    sliderWireframe.src = data.sliderAfter;
                    
                    sliderFinal.classList.remove('fade-out');
                    sliderWireframe.classList.remove('fade-out');
                    
                    // Trigger skeletons
                    if (typeof triggerSkeleton === 'function') {
                        triggerSkeleton(sliderFinal);
                        triggerSkeleton(sliderWireframe);
                    }
                }, 200);

                // Reset slider to 50%
                const sf = document.getElementById('slider-foreground');
                const sh = document.getElementById('slider-handle');
                if (sf && sh) {
                    sf.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
                    sh.style.left = '50%';
                    const ms = document.getElementById('mesh-slider');
                    if (ms) {
                        ms.setAttribute('aria-valuenow', 50);
                        ms.dataset.percent = 50;
                    }
                }

                // Inject Icons
                if (typeof injectSoftwareIcons === 'function') {
                    injectSoftwareIcons('software-icons', data.software);
                }

                // Scroll to details
                const targetElement = document.getElementById('project-details');
                if (targetElement && e && e.isTrusted) {
                    const nav = document.querySelector('.navbar');
                    const headerOffset = (nav ? nav.offsetHeight : 80) + 20;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }

                // Deep Linking - Update URL without reloading
                if (e && e.isTrusted) {
                    window.history.pushState({ project: index }, '', `?project=${index}`);
                }
            });
        });
    }
}

// AJAX Form Submission
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let hasError = false;
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.remove('input-error');
                void input.offsetWidth; // Trigger reflow to restart animation
                input.classList.add('input-error');
                hasError = true;
            } else {
                input.classList.remove('input-error');
            }
        });
        
        if (hasError) return;
        
        if (submitBtn) submitBtn.classList.add('loading');
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const formData = new FormData(this);
            const dataObj = Object.fromEntries(formData.entries());

            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataObj),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            if (submitBtn) submitBtn.classList.remove('loading');
            
            if (data.success || data.ok) {
                // Show toast
                if (toast) {
                    toast.innerText = 'Message sent successfully!';
                    toast.classList.add('show');
                }
                this.reset(); // clear form
                
                // Success state on button
                if (submitBtn) {
                    const originalHTML = submitBtn.innerHTML;
                    submitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent-mint"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    submitBtn.classList.add('pointer-events-none');
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.classList.remove('pointer-events-none');
                    }, 3000);
                }

                // Hide toast after 3s
                setTimeout(() => {
                    if (toast) toast.classList.remove('show');
                }, 3000);
            } else {
                if (submitBtn) submitBtn.classList.remove('loading');
                if (toast) {
                    toast.innerText = data.message || 'Failed to send. Please check your connection.';
                    toast.classList.add('show', 'error');
                    setTimeout(() => toast.classList.remove('show', 'error'), 5000);
                }
            }
        } catch (error) {
            if (submitBtn) submitBtn.classList.remove('loading');
            if (toast) {
                toast.innerText = 'Failed to send. Please check your connection.';
                toast.classList.add('show', 'error');
                setTimeout(() => toast.classList.remove('show', 'error'), 5000);
            }
        }
    });
}
// Software Icon Mapping
const softwareIcons = {
    'Maya': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#0696D7]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>',
    'ZBrush': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#A1A1A1]"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>',
    'Substance Painter': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#EF3340]"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 9h6v6H9z"></path></svg>',
    'Substance Designer': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#E36633]"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>',
    'Unreal Engine 5': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    'Photoshop': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#31A8FF]"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 9h6v6H9z"></path></svg>',
    'Marmoset Toolbag': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FFAA00]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>',
    'After Effects': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#D8A1FF]"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 9h6v6H9z"></path></svg>',
    'DaVinci': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5555]"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>'
};

const fallbackIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';

function injectSoftwareIcons(containerId, tools) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = tools.map(tool => {
        const icon = softwareIcons[tool] || fallbackIcon;
        return `<div class="relative group p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-help">
                    ${icon}
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10 shadow-xl">${tool}</div>
                </div>`;
    }).join('');
}

// Initial injection for demo
document.addEventListener('DOMContentLoaded', () => {
    injectSoftwareIcons('software-icons', ['Maya', 'ZBrush', 'Substance', 'Unreal']);
});
// Model Interaction Tracking
const modelViewer = document.getElementById('portfolio-model-viewer');
if (modelViewer) {
    let interacted = false;
    modelViewer.addEventListener('camera-change', () => {
        if (!interacted) {
            interacted = true;
            console.log('Analytics Event: model_interaction');
            if (typeof gtag === 'function') {
                gtag('event', 'model_interaction', {
                    'event_category': 'Engagement',
                    'event_label': '3D Model Viewer'
                });
            }
        }
    });
}

// Mesh Comparison Slider Logic
const meshSlider = document.getElementById('mesh-slider');
const sliderForeground = document.getElementById('slider-foreground');
const sliderHandle = document.getElementById('slider-handle');

if (meshSlider && sliderForeground && sliderHandle) {
    let isDragging = false;
    meshSlider.dataset.percent = 50;

    const updateSlider = (percent) => {
        percent = Math.max(0, Math.min(100, percent));
        meshSlider.dataset.percent = percent;
        sliderForeground.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
        sliderHandle.style.left = `${percent}%`;
        meshSlider.setAttribute('aria-valuenow', Math.round(percent));
    };

    const moveSlider = (e) => {
        if (!isDragging) return;
        
        if (e.type === 'touchmove' && e.cancelable) {
            e.preventDefault();
        }

        const rect = meshSlider.getBoundingClientRect();
        let clientX = e.clientX;
        if (clientX === undefined) {
            clientX = e.touches && e.touches[0] ? e.touches[0].clientX : 0;
        }
        let x = clientX - rect.left;
        
        // Clamp between 0 and 100%
        let percent = (x / rect.width) * 100;
        updateSlider(percent);
    };

    meshSlider.addEventListener('mousedown', () => isDragging = true);
    meshSlider.addEventListener('mouseup', () => isDragging = false);
    meshSlider.addEventListener('mouseleave', () => isDragging = false);
    meshSlider.addEventListener('mousemove', moveSlider);
    
    meshSlider.addEventListener('touchstart', () => isDragging = true, { passive: true });
    meshSlider.addEventListener('touchend', () => isDragging = false);
    meshSlider.addEventListener('touchmove', moveSlider, { passive: false });
    
    // Keyboard Accessibility
    meshSlider.addEventListener('keydown', (e) => {
        let currentPercent = parseFloat(meshSlider.dataset.percent) || 50;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            updateSlider(currentPercent - 5);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            updateSlider(currentPercent + 5);
        } else if (e.key === 'Home') {
            e.preventDefault();
            updateSlider(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            updateSlider(100);
        }
    });
}
// GA4 Event Tracking
document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Analytics Event: resume_download');
        if (typeof gtag === 'function') {
            gtag('event', 'resume_download', {
                'event_category': 'Conversion',
                'event_label': 'Resume Download'
            });
        }
    });
});

// Copy Email Button Logic
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function() {
        navigator.clipboard.writeText('Subrataart219@gmail.com');
        const originalHTML = this.innerHTML;
        this.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent-mint"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Copied!</span>`;
        setTimeout(() => {
            this.innerHTML = originalHTML;
        }, 2000);
    });
}

// Skeleton Loader Logic
function triggerSkeleton(img) {
    if (!img) return;
    
    // Create skeleton wrapper if not already present
    if (!img.parentElement.classList.contains('skeleton-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'skeleton-wrapper bg-accent-slate/20 animate-pulse overflow-hidden relative rounded-xl';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        img.classList.add('transition-opacity', 'duration-700');
    }
    
    img.classList.add('opacity-0');
    img.parentElement.classList.add('animate-pulse', 'bg-accent-slate/20');

    const revealImg = () => {
        img.classList.remove('opacity-0');
        img.parentElement.classList.remove('animate-pulse', 'bg-accent-slate/20');
    };

    if (img.complete) {
        revealImg();
    } else {
        img.addEventListener('load', revealImg, { once: true });
        img.addEventListener('error', revealImg, { once: true });
    }
}




// Share Project Logic
const shareProjectBtn = document.getElementById('share-project-btn');
if (shareProjectBtn) {
    shareProjectBtn.addEventListener('click', function() {
        // Find active project index
        let activeIndex = 0;
        portfolioItems.forEach((item, index) => {
            if (item.classList.contains('active-project')) activeIndex = index;
        });
        
        const shareUrl = window.location.origin + window.location.pathname + '#portfolio?project=' + activeIndex;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent-mint"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
            this.classList.add('text-white', 'border-accent-mint');
            
            const toastEl = document.getElementById('toast');
            if (toastEl) {
                const oldText = toastEl.innerText;
                toastEl.innerText = "Project link copied!";
                toastEl.classList.add('show');
                setTimeout(() => {
                    toastEl.classList.remove('show');
                    setTimeout(() => toastEl.innerText = oldText, 500);
                }, 3000);
            }
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.classList.remove('text-white', 'border-accent-mint');
            }, 2000);
        });
    });
}

// Pre-fetching Logic
function prefetchModels(initialIndex) {
    if (!window.requestIdleCallback) {
        window.requestIdleCallback = function(cb) { setTimeout(cb, 1); };
    }
    
    requestIdleCallback(() => {
        setTimeout(() => {
            projectsData.forEach((data, index) => {
                if (index !== initialIndex && data.modelSrc) {
                    if (!document.querySelector(`link[href="${data.modelSrc}"]`)) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'fetch';
                        link.href = data.modelSrc;
                        document.head.appendChild(link);
                    }
                }
            });
        }, 3000); // Give the main 3D model 3 seconds to finish loading
    });
}

// Custom Cursor Logic
const customCursor = document.getElementById('custom-cursor');
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

if (customCursor && !isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    const modelViewerContainer = document.getElementById('portfolio-model-viewer');
    if (modelViewerContainer) {
        modelViewerContainer.addEventListener('mouseenter', () => {
            customCursor.classList.add('active');
        });
        modelViewerContainer.addEventListener('mouseleave', () => {
            customCursor.classList.remove('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data/portfolio.json');
        if (response.ok) {
            const data = await response.json();
            projectsData = data.projects || data;
            
            // Dynamically Render Grid
            const grid = document.getElementById('portfolio-grid');
            if (grid) {
                grid.innerHTML = projectsData.map((project, index) => {
                    const title = project.title || "Project";
                    const image = project.image || project.poster || "assets/portfolio_1_1776868956269.png";
                    return `
                    <div class="portfolio-item fade-up" style="transition-delay: ${index * 0.1}s">
                        <img src="${image}" alt="${title}" loading="lazy">
                        <div class="overlay">
                            <h3>${title}</h3>
                        </div>
                    </div>`;
                }).join('');
            }
            
            // Attach listeners to newly created items
            attachPortfolioListeners();
            
        } else {
            console.error('Failed to load portfolio data');
        }
    } catch (e) {
        console.error('Error fetching portfolio data:', e);
    }
    // Deep Linking: Parse URL for project param
    let initialProjectIndex = 0;
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    if (urlParams.has('project')) {
        initialProjectIndex = parseInt(urlParams.get('project'), 10);
    } else if (hash.includes('?project=')) {
        const hashParams = new URLSearchParams(hash.split('?')[1]);
        if (hashParams.has('project')) {
            initialProjectIndex = parseInt(hashParams.get('project'), 10);
        }
    }
    
    if (isNaN(initialProjectIndex) || initialProjectIndex < 0 || initialProjectIndex >= portfolioItems.length) {
        initialProjectIndex = 0;
    }

    // Initial state synchronization
    if (portfolioItems[initialProjectIndex]) {
        portfolioItems[initialProjectIndex].click();
    } else if (portfolioItems[0]) {
        portfolioItems[0].click();
    }
    
    // Trigger Pre-fetching for other models
    prefetchModels(initialProjectIndex);
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        triggerSkeleton(img);
    });

    // 3D Tilt Effect
    if (portfolioItems.length > 0 && window.matchMedia("(hover: hover) and (min-width: 768px)").matches) {
        portfolioItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                item.style.setProperty('--rx', `${rotateX}deg`);
                item.style.setProperty('--ry', `${rotateY}deg`);
            });
            item.addEventListener('mouseleave', () => {
                item.style.setProperty('--rx', '0deg');
                item.style.setProperty('--ry', '0deg');
            });
        });
    }

    // "Come Back" Tab Interaction
    let titleTimeout;
    const originalTitle = document.title;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            titleTimeout = setTimeout(() => {
                document.title = "🎨 Come back! See my work";
            }, 30000); // 30 second delay
        } else {
            clearTimeout(titleTimeout);
            document.title = originalTitle;
        }
    });

    // Page Transition Logic
    const pageTransitionOverlay = document.getElementById('page-transition-overlay');
    if (pageTransitionOverlay) {
        setTimeout(() => {
            pageTransitionOverlay.classList.remove('active');
            pageTransitionOverlay.classList.add('fade-out');
            const cover = document.getElementById('absolute-watermark-cover');
            if (cover) cover.style.opacity = '1';
        }, 300);

        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target && target.endsWith('.html') && !target.startsWith('http')) {
                    e.preventDefault();
                    pageTransitionOverlay.classList.remove('fade-out');
                    pageTransitionOverlay.classList.add('active');
                    const cover = document.getElementById('absolute-watermark-cover');
                    if (cover) cover.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = target;
                    }, 600);
                }
            });
        });
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.log('SW registration failed: ', err);
            });
        });
    }
    
    // Cinematic Fade-in for Hero after everything is ready
    window.addEventListener('load', () => {
        const hero = document.getElementById('hero');
        if (hero) {
            hero.style.opacity = '1';
        }
    });
});
