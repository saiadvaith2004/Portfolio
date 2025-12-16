// ===== Smooth Scroll Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== Active Navigation Highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Scroll Progress Indicator =====
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ===== Header Background on Scroll =====
const header = document.getElementById('header');

function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateHeader);

// ===== Typing Effect for Hero Section =====
const typedTextElement = document.getElementById('typed-text');
const textArray = ['Computer Science Student', 'Machine Learning Enthusiast', 'Web Developer', 'Competitive Programmer'];
let textArrayIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeText() {
    const currentText = textArray[textArrayIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingDelay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        typingDelay = 500;
    }

    setTimeout(typeText, typingDelay);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeText, 1000);
});

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const skillBar = entry.target.querySelector('.skill-bar');
                const progress = skillBar.getAttribute('data-progress');
                skillBar.style.setProperty('--progress', progress + '%');
            }
        }
    });
}, observerOptions);

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
});

// Observe project cards
document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// ===== Form Validation and Submission =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field, errorElement, validationFn, errorMessage) {
    const value = field.value.trim();

    if (!validationFn(value)) {
        errorElement.textContent = errorMessage;
        field.style.borderColor = 'var(--color-accent)';
        return false;
    } else {
        errorElement.textContent = '';
        field.style.borderColor = 'var(--color-success)';
        return true;
    }
}

// Real-time validation
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

nameInput.addEventListener('blur', () => {
    validateField(
        nameInput,
        document.getElementById('name-error'),
        (value) => value.length >= 2,
        'Name must be at least 2 characters'
    );
});

emailInput.addEventListener('blur', () => {
    validateField(
        emailInput,
        document.getElementById('email-error'),
        (value) => emailRegex.test(value),
        'Please enter a valid email address'
    );
});

subjectInput.addEventListener('blur', () => {
    validateField(
        subjectInput,
        document.getElementById('subject-error'),
        (value) => value.length >= 3,
        'Subject must be at least 3 characters'
    );
});

messageInput.addEventListener('blur', () => {
    validateField(
        messageInput,
        document.getElementById('message-error'),
        (value) => value.length >= 10,
        'Message must be at least 10 characters'
    );
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(
        nameInput,
        document.getElementById('name-error'),
        (value) => value.length >= 2,
        'Name must be at least 2 characters'
    );

    const isEmailValid = validateField(
        emailInput,
        document.getElementById('email-error'),
        (value) => emailRegex.test(value),
        'Please enter a valid email address'
    );

    const isSubjectValid = validateField(
        subjectInput,
        document.getElementById('subject-error'),
        (value) => value.length >= 3,
        'Subject must be at least 3 characters'
    );

    const isMessageValid = validateField(
        messageInput,
        document.getElementById('message-error'),
        (value) => value.length >= 10,
        'Message must be at least 10 characters'
    );

    // If all fields are valid
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Simulate form submission
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';

        // Reset form
        contactForm.reset();

        // Reset field borders
        [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
            field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    } else {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fix the errors above and try again.';

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});

// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.particle');

    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== Add Animation Classes on Load =====
window.addEventListener('load', () => {
    // Trigger animations for elements in viewport on load
    const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card');

    elementsToAnimate.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isInViewport) {
            element.classList.add('visible');

            if (element.classList.contains('skill-card')) {
                const skillBar = element.querySelector('.skill-bar');
                const progress = skillBar.getAttribute('data-progress');
                skillBar.style.setProperty('--progress', progress + '%');
            }
        }
    });
});

// ===== Prevent Default Link Behavior for Project Cards =====
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // You can add custom behavior here, like opening a modal or navigating to project details
        console.log('Project link clicked');
    });
});

// ===== Console Welcome Message =====
console.log('%c👋 Welcome to my Portfolio!', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #3b82f6; font-size: 14px;');
