/**
 * Quiz System for Solana 101
 * Alpine.js component for interactive quizzes
 */

/**
 * Quiz Component Factory
 * Usage: x-data="quizComponent(quizData)"
 */
function quizComponent(quizData) {
    return {
        questions: quizData.questions || [],
        sectionId: quizData.sectionId || 'unknown',
        currentQuestion: 0,
        selectedAnswer: null,
        showExplanation: false,
        answered: false,
        score: 0,
        completed: false,
        answers: [],

        // Initialize component
        init() {
            this.loadSavedProgress();
        },

        // Get current question object
        get question() {
            return this.questions[this.currentQuestion];
        },

        // Get total questions count
        get totalQuestions() {
            return this.questions.length;
        },

        // Check if current answer is correct
        get isCorrect() {
            return this.selectedAnswer === this.question.correct;
        },

        // Get progress percentage
        get progressPercent() {
            return Math.round((this.currentQuestion / this.totalQuestions) * 100);
        },

        // Get final score percentage
        get scorePercent() {
            return Math.round((this.score / this.totalQuestions) * 100);
        },

        // Select an answer
        selectAnswer(index) {
            if (this.answered) return;

            this.selectedAnswer = index;
            this.answered = true;
            this.showExplanation = true;

            // Track answer
            this.answers.push({
                questionIndex: this.currentQuestion,
                selected: index,
                correct: this.question.correct,
                isCorrect: this.isCorrect
            });

            if (this.isCorrect) {
                this.score++;
            }

            this.saveProgress();
        },

        // Get option class based on state
        getOptionClass(index) {
            if (!this.answered) {
                return this.selectedAnswer === index ? 'selected' : '';
            }

            let classes = ['disabled'];

            if (index === this.question.correct) {
                classes.push('correct');
            } else if (index === this.selectedAnswer) {
                classes.push('incorrect');
            }

            return classes.join(' ');
        },

        // Move to next question
        nextQuestion() {
            if (this.currentQuestion < this.totalQuestions - 1) {
                this.currentQuestion++;
                this.selectedAnswer = null;
                this.answered = false;
                this.showExplanation = false;
            } else {
                this.completeQuiz();
            }
        },

        // Complete the quiz
        completeQuiz() {
            this.completed = true;
            this.saveProgress();

            // Mark lesson as completed if score is 100%
            if (this.scorePercent === 100 && window.Navigation) {
                const lessonId = Navigation.getCurrentLessonId();
                if (lessonId) {
                    Navigation.completeLesson(lessonId);
                }
            }
        },

        // Restart the quiz
        restart() {
            this.currentQuestion = 0;
            this.selectedAnswer = null;
            this.showExplanation = false;
            this.answered = false;
            this.score = 0;
            this.completed = false;
            this.answers = [];
            this.clearSavedProgress();
        },

        // Save progress to localStorage
        saveProgress() {
            try {
                const key = `solana101-quiz-${this.sectionId}`;
                const data = {
                    currentQuestion: this.currentQuestion,
                    score: this.score,
                    answers: this.answers,
                    completed: this.completed
                };
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.warn('Could not save quiz progress');
            }
        },

        // Load saved progress from localStorage
        loadSavedProgress() {
            try {
                const key = `solana101-quiz-${this.sectionId}`;
                const saved = localStorage.getItem(key);
                if (saved) {
                    const data = JSON.parse(saved);
                    // Only restore if not completed, to allow retakes
                    if (!data.completed) {
                        this.currentQuestion = data.currentQuestion || 0;
                        this.score = data.score || 0;
                        this.answers = data.answers || [];
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        },

        // Clear saved progress
        clearSavedProgress() {
            try {
                const key = `solana101-quiz-${this.sectionId}`;
                localStorage.removeItem(key);
            } catch (e) {
                // Ignore errors
            }
        },

        // Get result message based on score
        getResultMessage() {
            if (this.scorePercent === 100) {
                return "Perfect score! You've mastered this section.";
            } else if (this.scorePercent >= 75) {
                return "Great job! You have a solid understanding.";
            } else if (this.scorePercent >= 50) {
                return "Good effort! Consider reviewing the material.";
            } else {
                return "Keep learning! Review the content and try again.";
            }
        },

        // Get result color class
        getResultColorClass() {
            if (this.scorePercent >= 75) {
                return 'text-green-400';
            } else if (this.scorePercent >= 50) {
                return 'text-yellow-400';
            } else {
                return 'text-red-400';
            }
        }
    };
}

/**
 * Render a quiz container
 * Call this to inject quiz HTML into a container element
 */
function renderQuiz(containerId, quizData) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Quiz container #${containerId} not found`);
        return;
    }

    container.innerHTML = `
        <div class="quiz-container" x-data="quizComponent(${JSON.stringify(quizData).replace(/"/g, '&quot;')})">
            <!-- Quiz Header -->
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Knowledge Check</h3>
                <span class="text-sm text-gray-400" x-show="!completed">
                    Question <span x-text="currentQuestion + 1"></span> of <span x-text="totalQuestions"></span>
                </span>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 bg-gray-700 rounded-full mb-6" x-show="!completed">
                <div class="h-full bg-gradient-to-r from-solana-purple to-solana-green rounded-full transition-all duration-300"
                     :style="'width: ' + progressPercent + '%'"></div>
            </div>

            <!-- Question Display -->
            <div x-show="!completed">
                <p class="text-lg mb-6" x-text="question.question"></p>

                <!-- Options -->
                <div class="space-y-3 mb-6">
                    <template x-for="(option, index) in question.options" :key="index">
                        <button
                            class="quiz-option"
                            :class="getOptionClass(index)"
                            @click="selectAnswer(index)"
                            :disabled="answered">
                            <span class="flex items-center gap-3">
                                <span class="w-8 h-8 flex items-center justify-center rounded-full border-2 border-current text-sm font-semibold"
                                      x-text="String.fromCharCode(65 + index)"></span>
                                <span x-text="option"></span>
                            </span>
                        </button>
                    </template>
                </div>

                <!-- Explanation -->
                <div x-show="showExplanation" x-transition class="mb-6">
                    <div class="p-4 rounded-lg" :class="isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'">
                        <div class="flex items-center gap-2 mb-2">
                            <template x-if="isCorrect">
                                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </template>
                            <template x-if="!isCorrect">
                                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </template>
                            <span class="font-semibold" :class="isCorrect ? 'text-green-400' : 'text-red-400'"
                                  x-text="isCorrect ? 'Correct!' : 'Incorrect'"></span>
                        </div>
                        <p class="text-gray-300 text-sm" x-text="question.explanation"></p>
                    </div>
                </div>

                <!-- Next Button -->
                <button
                    x-show="answered"
                    @click="nextQuestion"
                    class="w-full py-3 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    <span x-text="currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'"></span>
                </button>
            </div>

            <!-- Results Display -->
            <div x-show="completed" x-transition>
                <div class="text-center py-8">
                    <div class="text-6xl font-bold mb-2" :class="getResultColorClass()">
                        <span x-text="scorePercent"></span>%
                    </div>
                    <p class="text-xl mb-2">
                        <span x-text="score"></span> out of <span x-text="totalQuestions"></span> correct
                    </p>
                    <p class="text-gray-400 mb-8" x-text="getResultMessage()"></p>

                    <div class="flex gap-4 justify-center">
                        <button
                            @click="restart"
                            class="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                            Try Again
                        </button>
                        <template x-if="scorePercent === 100">
                            <a href="#" onclick="Navigation.getNextLesson() && (window.location.href = '../' + Navigation.getNextLesson().path); return false;"
                               class="px-6 py-3 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                Next Lesson
                            </a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Ensure Alpine initializes the newly injected quiz
    if (window.Alpine && typeof window.Alpine.initTree === 'function') {
        window.Alpine.initTree(container);
    }
}

// Export for global use
window.quizComponent = quizComponent;
window.renderQuiz = renderQuiz;
