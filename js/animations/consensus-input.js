/**
 * Consensus Input Stepper
 * Highlights that consensus is about ordering inputs, not memory.
 */

const consensusStepper = {
    currentStep: 0,
    steps: [
        {
            title: 'Collect Inputs',
            description: 'Transactions arrive from many clients into a shared pool of inputs.'
        },
        {
            title: 'Propose Order',
            description: 'A leader proposes an ordering of those inputs for the next block.'
        },
        {
            title: 'Vote & Validate',
            description: 'Validators verify the proposal and vote on the ordering.'
        },
        {
            title: 'Finalize Order',
            description: 'The ordered inputs become the canonical history for the network.'
        }
    ],

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.cards = Array.from(this.container.querySelectorAll('[data-step]'));
        this.status = this.container.querySelector('[data-status]');
        this.progressFill = this.container.querySelector('[data-progress]');

        const nextBtn = this.container.querySelector('[data-next]');
        const prevBtn = this.container.querySelector('[data-prev]');
        const resetBtn = this.container.querySelector('[data-reset]');

        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

        this.update();
    },

    update() {
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'complete');
            if (index < this.currentStep) {
                card.classList.add('complete');
            } else if (index === this.currentStep) {
                card.classList.add('active');
            }
        });

        const stepInfo = this.steps[this.currentStep];
        if (this.status && stepInfo) {
            this.status.textContent = stepInfo.description;
        }

        if (this.progressFill) {
            const percent = Math.round(((this.currentStep + 1) / this.steps.length) * 100);
            this.progressFill.style.width = `${percent}%`;
        }
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep += 1;
            this.update();
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.currentStep -= 1;
            this.update();
        }
    },

    reset() {
        this.currentStep = 0;
        this.update();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('consensus-stepper')) {
        consensusStepper.init('consensus-stepper');
    }
});

// Export
window.consensusStepper = consensusStepper;
