
        document.addEventListener('DOMContentLoaded', () => {

            // --- HERO SECTION PARALLAX ON SCROLL ---
            const heroContent = document.querySelector('.hero-content-animated');
            const heroPhoto = document.querySelector('.hero-photo-animated');

            if (heroContent && heroPhoto) {
                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
                        heroPhoto.style.transform = `translateY(${scrollY * 0.2}px)`;
                        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight / 1.8));
                        heroPhoto.style.opacity = 1 - (scrollY / (window.innerHeight / 1.8));
                    }
                });
            }

            // --- TEXT REVEAL ANIMATION SETUP ---
            const revealTextElements = document.querySelectorAll('.reveal-text');

            revealTextElements.forEach(element => {
                if (!element.dataset.processed) {
                    const text = element.textContent.trim();
                    element.innerHTML = '';
                    const words = text.split(/\s+/);

                    words.forEach(word => {
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'word';
                        wordSpan.textContent = word;

                        const space = document.createTextNode(' ');

                        element.appendChild(wordSpan);
                        element.appendChild(space);
                    });
                    element.dataset.processed = 'true';
                }
            });

            const setupRevealText = (container) => {
                const words = container.querySelectorAll('.word');
                words.forEach((word, index) => {
                    word.style.transitionDelay = `${index * 40}ms`;
                });
            };

            // --- INTERSECTION OBSERVER TO TRIGGER ALL SCROLL ANIMATIONS ---
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.3 // Trigger when 30% of the element is visible
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Make the text container visible so the words inside can animate
                        if (entry.target.classList.contains('reveal-text')) {
                            entry.target.classList.add('is-visible');
                            setupRevealText(entry.target);
                        }

                        // Stagger the animation for cards and form inputs
                        let delay = 0;
                        if (entry.target.classList.contains('animate-card') || entry.target.classList.contains('animate-form-input')) {
                            // Find all similar elements to calculate a dynamic delay
                            const similarElements = document.querySelectorAll('.animate-card, .animate-form-input');
                            const elementIndex = Array.from(similarElements).indexOf(entry.target);
                            delay = elementIndex * 150; // Increased delay for more pronounced stagger
                        }

                        setTimeout(() => {
                            entry.target.classList.add('in-view');

                            // Card specific flip: Only flip cards here, not other animated elements
                            if (entry.target.classList.contains('card-wrapper')) {
                                const cardElement = entry.target.querySelector('.card');
                                if (cardElement) {
                                    cardElement.classList.add('flipped');
                                }
                            }
                        }, delay);

                        // Only unobserve if you want the animation to run once
                        // If you want it to re-trigger when scrolling back into view, remove this line.
                        // For cards that flip and stay flipped, you might keep unobserve.
                        // For text reveal, you might want it to re-appear, so remove unobserve.
                        // Given your current JS, the 'flipped' class is added on intersecting and removed on not intersecting.
                        // So, we don't unobserve here for cards.
                        if (!entry.target.classList.contains('card-wrapper')) { // Don't unobserve cards so they can flip back
                           observer.unobserve(entry.target);
                        }
                    } else {
                        // If element leaves viewport, remove classes to reset for re-entry
                        if (entry.target.classList.contains('reveal-text')) {
                            entry.target.classList.remove('is-visible');
                             // Reset text elements if they leave view for re-animation
                             entry.target.querySelectorAll('.word').forEach(word => {
                                word.style.transitionDelay = '0ms'; // Reset delay
                            });
                        }
                        if (entry.target.classList.contains('in-view')) {
                            entry.target.classList.remove('in-view');
                        }
                        // For cards, remove flipped class when they leave view
                        if (entry.target.classList.contains('card-wrapper')) {
                            const cardElement = entry.target.querySelector('.card');
                            if (cardElement) {
                                cardElement.classList.remove('flipped');
                            }
                        }
                    }
                });
            }, observerOptions);

            // Add manual click toggle for cards (optional, but good for user interaction)
            document.querySelectorAll('.card').forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            // Observe all relevant animated elements
            const animatedElements = document.querySelectorAll('.card-wrapper, .reveal-text, .animate-form-input');
            animatedElements.forEach(el => observer.observe(el));

        });
