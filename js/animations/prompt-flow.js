/**
 * Prompt Flow Stepper for Coding with Claude
 */

const promptFlow = {
    currentStep: 0,
    steps: [
        {
            title: 'Define Goal',
            description: 'State what you want to build and the outcome you need.'
        },
        {
            title: 'Add Constraints',
            description: 'Specify account structures, limits, and required instructions.'
        },
        {
            title: 'Generate & Review',
            description: 'Claude drafts the code; you review and adjust.'
        },
        {
            title: 'Test & Iterate',
            description: 'Run tests, fix errors, and improve reliability.'
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
    if (document.getElementById('prompt-flow')) {
        promptFlow.init('prompt-flow');
    }
});

// Export
window.promptFlow = promptFlow;
