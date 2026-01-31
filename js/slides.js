/**
 * Simple slide deck navigation
 */

const SlideDeck = {
    init(container) {
        const slides = Array.from(container.querySelectorAll('.slide'));
        if (slides.length === 0) return;

        let current = 0;
        const prevBtn = container.querySelector('[data-slide-prev]');
        const nextBtn = container.querySelector('[data-slide-next]');
        const counter = container.querySelector('[data-slide-counter]');
        const dots = container.querySelector('[data-slide-dots]');

        function renderDots() {
            if (!dots) return;
            dots.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.className = 'slide-dot';
                dot.type = 'button';
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                dot.addEventListener('click', () => goTo(idx));
                dots.appendChild(dot);
            });
        }

        function update() {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === current);
            });
            if (counter) {
                counter.textContent = `${current + 1} / ${slides.length}`;
            }
            if (dots) {
                Array.from(dots.children).forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === current);
                });
            }
            if (prevBtn) prevBtn.disabled = current === 0;
            if (nextBtn) nextBtn.disabled = current === slides.length - 1;
        }

        function goTo(index) {
            if (index < 0 || index >= slides.length) return;
            current = index;
            update();
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        renderDots();
        update();
    }
};

// Initialize all slide decks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slide-deck').forEach((deck) => SlideDeck.init(deck));
});

window.SlideDeck = SlideDeck;
