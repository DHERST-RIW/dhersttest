const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item, .hero-content, .hero-image');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    setTimeout(() => {
        document.querySelector('.hero-content').style.opacity = '1';
        document.querySelector('.hero-content').style.transform = 'translateY(0)';
    }, 300);

    setTimeout(() => {
        document.querySelector('.hero-image').style.opacity = '1';
        document.querySelector('.hero-image').style.transform = 'translateY(0)';
    }, 600);
});

const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');

    if (heroImage && heroContent) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function isMobile() {
    return window.innerWidth <= 768;
}

function initializeMobileFloatingImage() {
    const floatingLogo = document.querySelector('.floating-logo');
    const floatingImg = document.querySelector('#floating-image');

    if (floatingLogo && floatingImg) {
        floatingLogo.style.position = 'fixed';
        floatingLogo.style.top = '60px';
        floatingLogo.style.right = '10px';
        floatingLogo.style.left = 'auto';
        floatingLogo.style.zIndex = '99999';
        floatingLogo.style.display = 'block';
        floatingLogo.style.visibility = 'visible';
        floatingLogo.style.opacity = '1';
        floatingLogo.style.pointerEvents = 'none';

        floatingImg.style.display = 'block';
        floatingImg.style.visibility = 'visible';
        floatingImg.style.opacity = '1';
        if (isMobile()) {
            floatingImg.style.width = '130px';
            floatingImg.style.height = 'auto';
        } else {
            floatingImg.style.width = '400px';
            floatingImg.style.height = '360px';
        }
        floatingImg.style.objectFit = 'contain';
    }
}

const floatingImage = document.getElementById('floating-image');

// Initialize with selected image from settings
function initializeFloatingImage() {
    if (floatingImage) {
        const selectedImage = getSelectedImage();
        floatingImage.src = `images/${selectedImage}.png`;
        floatingImage.style.opacity = '1';
        floatingImage.style.display = 'block';
        floatingImage.style.visibility = 'visible';
    }
}

function getSelectedImage() {
    const saved = localStorage.getItem('selectedImage');
    const imageNumber = saved ? parseInt(saved) : 1;
    return Math.max(1, Math.min(50, imageNumber)); // Ensure it's between 1-50
}

// Listen for image selection changes
window.addEventListener('storage', (e) => {
    if (e.key === 'selectedImage') {
        initializeFloatingImage();
    }
});

// Call initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFloatingImage();
});

initializeMobileFloatingImage();

const floatingLogoContainer = document.querySelector('.floating-logo');
if (floatingLogoContainer) {
    floatingLogoContainer.style.display = 'block';
    floatingLogoContainer.style.visibility = 'visible';
    floatingLogoContainer.style.opacity = '1';
}

// Simple static image display - no controls needed for public view

function preloadImages() {
    imageArray.forEach(imageName => {
        const img = new Image();
        img.src = imageName;
    });
}

window.addEventListener('load', preloadImages);
document.addEventListener('DOMContentLoaded', initializeMobileFloatingImage);
window.addEventListener('load', initializeMobileFloatingImage);
window.addEventListener('resize', debounce(initializeMobileFloatingImage, 250));
setTimeout(initializeMobileFloatingImage, 100);
