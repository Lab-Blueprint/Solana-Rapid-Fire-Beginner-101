/**
 * Navigation System for Solana 101
 * Handles sidebar navigation, progress tracking, and mobile menu
 */

const Navigation = {
    // Lesson structure
    lessons: [
        { id: 'module-1', path: 'part1/module-1-blockchain-computer.html', title: 'Blockchain as a Computer', part: 1 },
        { id: 'module-2', path: 'part1/module-2-identity-authentication.html', title: 'Identity & Authentication', part: 1 },
        { id: 'module-3', path: 'part1/module-3-consensus-input.html', title: 'Consensus (Input, Not Memory)', part: 1 },
        { id: 'module-4', path: 'part2/module-4-account-file.html', title: 'Account = File', part: 2 },
        { id: 'module-5', path: 'part2/module-5-program-library.html', title: 'Program = Library', part: 2 },
        { id: 'module-6', path: 'part2/module-6-environment-setup-minimal.html', title: 'Environment Setup (Minimal)', part: 2 },
        { id: 'module-7', path: 'part2/module-7-coding-with-claude.html', title: 'Coding with Claude', part: 2 },
        { id: 'module-8', path: 'part3/module-8-paywall-usdc.html', title: 'Build a USDC Paywall', part: 3 },
        { id: 'module-9', path: 'part3/module-9-nft-gate-community.html', title: 'NFT Gate Community', part: 3 }
    ],

    // Storage key
    STORAGE_KEY: 'solana101-progress',

    /**
     * Initialize navigation system
     */
    init() {
        this.loadProgress();
        this.setupMobileMenu();
        this.highlightCurrentPage();
    },

    /**
     * Get progress from localStorage
     */
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            this.progress = stored ? JSON.parse(stored) : {};
        } catch (e) {
            this.progress = {};
        }
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
        } catch (e) {
            console.warn('Could not save progress to localStorage');
        }
    },

    /**
     * Mark a lesson as completed
     */
    completeLesson(lessonId) {
        this.progress[lessonId] = true;
        this.saveProgress();
        this.updateSidebarLinks();
        this.updateProgressBar();
    },

    /**
     * Check if a lesson is completed
     */
    isCompleted(lessonId) {
        return !!this.progress[lessonId];
    },

    /**
     * Get current lesson ID from URL
     */
    getCurrentLessonId() {
        const path = window.location.pathname;
        const lesson = this.lessons.find(l => path.includes(l.path.replace(/^\.\.\//, '')));
        return lesson ? lesson.id : null;
    },

    /**
     * Get current lesson index
     */
    getCurrentLessonIndex() {
        const currentId = this.getCurrentLessonId();
        return this.lessons.findIndex(l => l.id === currentId);
    },

    /**
     * Get next lesson
     */
    getNextLesson() {
        const currentIndex = this.getCurrentLessonIndex();
        if (currentIndex >= 0 && currentIndex < this.lessons.length - 1) {
            return this.lessons[currentIndex + 1];
        }
        return null;
    },

    /**
     * Get previous lesson
     */
    getPrevLesson() {
        const currentIndex = this.getCurrentLessonIndex();
        if (currentIndex > 0) {
            return this.lessons[currentIndex - 1];
        }
        return null;
    },

    /**
     * Calculate overall progress percentage
     */
    getProgressPercent() {
        const completed = Object.values(this.progress).filter(v => v).length;
        return Math.round((completed / this.lessons.length) * 100);
    },

    /**
     * Highlight current page in sidebar
     */
    highlightCurrentPage() {
        const currentId = this.getCurrentLessonId();
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const lessonId = link.dataset.lessonId;
            link.classList.remove('active');

            if (lessonId === currentId) {
                link.classList.add('active');
            }

            if (this.isCompleted(lessonId)) {
                link.classList.add('completed');
            }
        });
    },

    /**
     * Update sidebar links with completion status
     */
    updateSidebarLinks() {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const lessonId = link.dataset.lessonId;
            if (this.isCompleted(lessonId)) {
                link.classList.add('completed');
            }
        });
    },

    /**
     * Update progress bar display
     */
    updateProgressBar() {
        const progressFill = document.querySelector('.lesson-progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill) {
            progressFill.style.width = `${this.getProgressPercent()}%`;
        }

        if (progressText) {
            const completed = Object.values(this.progress).filter(v => v).length;
            progressText.textContent = `${completed}/${this.lessons.length}`;
        }
    },

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-sidebar-toggle');
        const sidebar = document.querySelector('.lesson-sidebar');

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                toggle.classList.toggle('active');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                    toggle.classList.remove('active');
                }
            });
        }
    },

    /**
     * Generate sidebar HTML
     */
    generateSidebar() {
        if (!this.progress) {
            this.loadProgress();
        }
        const isInSubfolder = window.location.pathname.includes('/part1/') ||
                            window.location.pathname.includes('/part2/') ||
                            window.location.pathname.includes('/part3/');
        const prefix = isInSubfolder ? '../' : '';

        return `
            <div class="lesson-sidebar">
                <div class="lesson-progress mb-6">
                    <span class="progress-text">${Object.values(this.progress).filter(v => v).length}/${this.lessons.length}</span>
                    <div class="lesson-progress-bar">
                        <div class="lesson-progress-fill" style="width: ${this.getProgressPercent()}%"></div>
                    </div>
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-title">Part 1: Core Concepts</div>
                    ${this.lessons.filter(l => l.part === 1).map(lesson => `
                        <a href="${prefix}${lesson.path}"
                           class="sidebar-link ${this.isCompleted(lesson.id) ? 'completed' : ''}"
                           data-lesson-id="${lesson.id}">
                            <span class="status-dot"></span>
                            <span>${lesson.title}</span>
                        </a>
                    `).join('')}
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-title">Part 2: Start Coding</div>
                    ${this.lessons.filter(l => l.part === 2).map(lesson => `
                        <a href="${prefix}${lesson.path}"
                           class="sidebar-link ${this.isCompleted(lesson.id) ? 'completed' : ''}"
                           data-lesson-id="${lesson.id}">
                            <span class="status-dot"></span>
                            <span>${lesson.title}</span>
                        </a>
                    `).join('')}
                </div>

                <div class="sidebar-section">
                    <div class="sidebar-section-title">Part 3: Hands-on Coding</div>
                    ${this.lessons.filter(l => l.part === 3).map(lesson => `
                        <a href="${prefix}${lesson.path}"
                           class="sidebar-link ${this.isCompleted(lesson.id) ? 'completed' : ''}"
                           data-lesson-id="${lesson.id}">
                            <span class="status-dot"></span>
                            <span>${lesson.title}</span>
                        </a>
                    `).join('')}
                </div>

                <div class="mt-8 pt-6 border-t border-gray-800">
                    <a href="${prefix}index.html" class="sidebar-link">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Home</span>
                    </a>
                </div>
            </div>
        `;
    },

    /**
     * Generate navigation buttons HTML
     */
    generateNavButtons() {
        const prev = this.getPrevLesson();
        const next = this.getNextLesson();
        const isInSubfolder = window.location.pathname.includes('/part1/') ||
                            window.location.pathname.includes('/part2/') ||
                            window.location.pathname.includes('/part3/');
        const prefix = isInSubfolder ? '../' : '';

        let html = '<div class="lesson-nav">';

        if (prev) {
            html += `
                <a href="${prefix}${prev.path}" class="prev">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>${prev.title}</span>
                </a>
            `;
        } else {
            html += '<div></div>';
        }

        if (next) {
            html += `
                <a href="${prefix}${next.path}" class="next">
                    <span>${next.title}</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            `;
        }

        html += '</div>';
        return html;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Export for use in other modules
window.Navigation = Navigation;
