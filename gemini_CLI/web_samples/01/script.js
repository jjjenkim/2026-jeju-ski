document.addEventListener('DOMContentLoaded', () => {

    // --- Intersection Observer for scroll animations ---
    const animatedElements = document.querySelectorAll('.animate-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Unobserve after animation to save resources
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    // --- Animate initial hero elements without scroll ---
    const initialAnimatedElements = document.querySelectorAll('.animate-in');
    if (initialAnimatedElements.length > 0) {
        initialAnimatedElements.forEach(el => {\n            // Use a short timeout to ensure the transition is applied after the initial render
            setTimeout(() => {
                el.classList.add('is-visible');
            }, 100);
        });
    }

    // --- Smooth scrolling for navigation ---
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.error('Target element not found for smooth scrolling:', targetId);
            }
        });
    });

});