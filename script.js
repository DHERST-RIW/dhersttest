// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
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

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item, .hero-content, .hero-image');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animate hero content on load
    setTimeout(() => {
        document.querySelector('.hero-content').style.opacity = '1';
        document.querySelector('.hero-content').style.transform = 'translateY(0)';
    }, 300);

    setTimeout(() => {
        document.querySelector('.hero-image').style.opacity = '1';
        document.querySelector('.hero-image').style.transform = 'translateY(0)';
    }, 600);
});

// Counter animation for stats
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

// Trigger counter animation when stats section is visible
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroImage && heroContent) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Button click effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
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

// Add ripple CSS
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

// Form handling (if forms are added later)
const handleFormSubmit = (formSelector) => {
    const form = document.querySelector(formSelector);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    }
};

// Lazy loading for images
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

// Preloader (optional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Theme toggle (if needed)
const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
};

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Add theme toggle button functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll handling code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('Website loaded successfully!');

// Date-based Floating Image System
const floatingImage = document.getElementById('floating-image');

// Image mapping based on day of month
// Day 3 (today, Thursday July 3rd) = pg.jpg
// Day 4 = pg1.jpg, Day 5 = pg2.jpg, etc.
const imageMap = {
    3: 'pg.jpg',    // July 3rd (today)
    4: 'pg1.jpg',   // July 4th
    5: 'pg2.jpg',   // July 5th
    6: 'pg3.jpg',   // July 6th
    7: 'pg4.jpg',   // July 7th
    8: 'pg5.jpg'    // July 8th
};

function setImageBasedOnDate() {
    const today = new Date();
    const dayOfMonth = today.getDate();

    // Get the appropriate image for today's date
    let imageName;
    if (imageMap[dayOfMonth]) {
        imageName = imageMap[dayOfMonth];
    } else {
        // For days not specifically mapped, cycle through pg1-pg5
        const cycleDay = ((dayOfMonth - 4) % 5) + 1; // Start cycle from day 4
        if (cycleDay === 1) imageName = 'pg1.jpg';
        else if (cycleDay === 2) imageName = 'pg2.jpg';
        else if (cycleDay === 3) imageName = 'pg3.jpg';
        else if (cycleDay === 4) imageName = 'pg4.jpg';
        else imageName = 'pg5.jpg';
    }

    console.log(`Today is ${today.toDateString()} (Day ${dayOfMonth})`);
    console.log(`Setting image to: ${imageName}`);

    // Set the image with fade effect
    floatingImage.style.opacity = '0';

    setTimeout(() => {
        floatingImage.src = imageName;
        floatingImage.style.opacity = '1';
        console.log(`Image set to: ${imageName}`);
    }, 250);
}

// Set image immediately when page loads
setImageBasedOnDate();

// Check for date change every hour (3600000 milliseconds)
// This ensures the image updates if the date changes while the page is open
setInterval(() => {
    setImageBasedOnDate();
}, 3600000);

// Preload all images for smooth transitions
function preloadImages() {
    const allImages = ['pg.jpg', 'pg1.jpg', 'pg2.jpg', 'pg3.jpg', 'pg4.jpg', 'pg5.jpg'];
    allImages.forEach(imageName => {
        const img = new Image();
        img.src = imageName;
    });
}

// Preload images when page loads
window.addEventListener('load', preloadImages);

console.log('Date-based image system initialized');

// Test function - you can call this in browser console to test different dates
window.testImageForDate = function(day) {
    console.log(`Testing image for day ${day}`);

    let imageName;
    if (imageMap[day]) {
        imageName = imageMap[day];
    } else {
        const cycleDay = ((day - 4) % 5) + 1;
        if (cycleDay === 1) imageName = 'pg1.jpg';
        else if (cycleDay === 2) imageName = 'pg2.jpg';
        else if (cycleDay === 3) imageName = 'pg3.jpg';
        else if (cycleDay === 4) imageName = 'pg4.jpg';
        else imageName = 'pg5.jpg';
    }

    console.log(`Day ${day} should show: ${imageName}`);

    // Actually change the image
    floatingImage.style.opacity = '0';
    setTimeout(() => {
        floatingImage.src = imageName;
        floatingImage.style.opacity = '1';
        console.log(`Image changed to: ${imageName}`);
    }, 250);
};

console.log('Test function available: testImageForDate(day)');
console.log('Example: testImageForDate(4) for July 4th');
console.log('Example: testImageForDate(5) for July 5th');
