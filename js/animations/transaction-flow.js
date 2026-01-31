/**
 * Transaction Flow Animation
 * Visualizes sequential vs parallel processing and transaction lifecycle
 */

// Sequential vs Parallel Processing Animation
const processingAnimation = {
    container: null,
    svg: null,
    tl: null,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.createSVG();
        this.buildAnimation();
    },

    createSVG() {
        this.container.innerHTML = `
            <svg id="processing-svg" width="100%" height="100%" viewBox="0 0 600 280">
                <defs>
                    <filter id="glow-green">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <!-- Sequential Section -->
                <text x="150" y="25" text-anchor="middle" fill="#888" font-size="12">Sequential Processing</text>
                <text x="150" y="42" text-anchor="middle" fill="#666" font-size="10">(Traditional Blockchains)</text>

                <g id="sequential">
                    <rect x="30" y="60" width="240" height="180" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

                    <!-- Transaction queue -->
                    <g id="seq-queue">
                        <rect id="seq-tx-1" x="50" y="80" width="60" height="30" rx="4" fill="#09637E" opacity="0.8"/>
                        <text x="80" y="100" text-anchor="middle" fill="white" font-size="10">TX 1</text>

                        <rect id="seq-tx-2" x="50" y="120" width="60" height="30" rx="4" fill="#09637E" opacity="0.5"/>
                        <text x="80" y="140" text-anchor="middle" fill="white" font-size="10">TX 2</text>

                        <rect id="seq-tx-3" x="50" y="160" width="60" height="30" rx="4" fill="#09637E" opacity="0.3"/>
                        <text x="80" y="180" text-anchor="middle" fill="white" font-size="10">TX 3</text>

                        <rect id="seq-tx-4" x="50" y="200" width="60" height="30" rx="4" fill="#09637E" opacity="0.2"/>
                        <text x="80" y="220" text-anchor="middle" fill="white" font-size="10">TX 4</text>
                    </g>

                    <!-- Processor -->
                    <rect x="140" y="130" width="50" height="50" rx="8" fill="rgba(153,69,255,0.3)" stroke="#09637E" stroke-width="2"/>
                    <text x="165" y="160" text-anchor="middle" fill="#09637E" font-size="8">CPU</text>

                    <!-- Output -->
                    <g id="seq-output">
                        <circle id="seq-done-1" cx="220" cy="95" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="seq-done-2" cx="220" cy="135" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="seq-done-3" cx="220" cy="175" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="seq-done-4" cx="220" cy="215" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                    </g>

                    <!-- Processing indicator -->
                    <rect id="seq-processing" x="130" y="0" width="70" height="30" rx="4" fill="#09637E" opacity="0"/>
                </g>

                <!-- Parallel Section -->
                <text x="450" y="25" text-anchor="middle" fill="#088395" font-size="12">Parallel Processing</text>
                <text x="450" y="42" text-anchor="middle" fill="#666" font-size="10">(Solana)</text>

                <g id="parallel">
                    <rect x="330" y="60" width="240" height="180" rx="8" fill="rgba(20,241,149,0.02)" stroke="rgba(20,241,149,0.2)" stroke-width="1"/>

                    <!-- Transaction queue -->
                    <g id="par-queue">
                        <rect id="par-tx-1" x="350" y="80" width="60" height="30" rx="4" fill="#088395" opacity="0.8"/>
                        <text x="380" y="100" text-anchor="middle" fill="#09637E" font-size="10">TX 1</text>

                        <rect id="par-tx-2" x="350" y="120" width="60" height="30" rx="4" fill="#088395" opacity="0.8"/>
                        <text x="380" y="140" text-anchor="middle" fill="#09637E" font-size="10">TX 2</text>

                        <rect id="par-tx-3" x="350" y="160" width="60" height="30" rx="4" fill="#088395" opacity="0.8"/>
                        <text x="380" y="180" text-anchor="middle" fill="#09637E" font-size="10">TX 3</text>

                        <rect id="par-tx-4" x="350" y="200" width="60" height="30" rx="4" fill="#088395" opacity="0.8"/>
                        <text x="380" y="220" text-anchor="middle" fill="#09637E" font-size="10">TX 4</text>
                    </g>

                    <!-- Multiple processors -->
                    <rect x="440" y="80" width="40" height="35" rx="4" fill="rgba(20,241,149,0.3)" stroke="#088395" stroke-width="2"/>
                    <text x="460" y="102" text-anchor="middle" fill="#088395" font-size="8">CPU 1</text>

                    <rect x="440" y="125" width="40" height="35" rx="4" fill="rgba(20,241,149,0.3)" stroke="#088395" stroke-width="2"/>
                    <text x="460" y="147" text-anchor="middle" fill="#088395" font-size="8">CPU 2</text>

                    <rect x="440" y="170" width="40" height="35" rx="4" fill="rgba(20,241,149,0.3)" stroke="#088395" stroke-width="2"/>
                    <text x="460" y="192" text-anchor="middle" fill="#088395" font-size="8">CPU 3</text>

                    <rect x="440" y="215" width="40" height="35" rx="4" fill="rgba(20,241,149,0.3)" stroke="#088395" stroke-width="2"/>
                    <text x="460" y="237" text-anchor="middle" fill="#088395" font-size="8">CPU 4</text>

                    <!-- Output -->
                    <g id="par-output">
                        <circle id="par-done-1" cx="520" cy="97" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="par-done-2" cx="520" cy="142" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="par-done-3" cx="520" cy="187" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                        <circle id="par-done-4" cx="520" cy="232" r="12" fill="none" stroke="#088395" stroke-width="2" opacity="0"/>
                    </g>
                </g>

                <!-- Time indicator -->
                <text id="time-label" x="300" y="270" text-anchor="middle" fill="#666" font-size="12">Time: 0s</text>
            </svg>
        `;
        this.svg = document.getElementById('processing-svg');
    },

    buildAnimation() {
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true });

        const timeLabel = document.getElementById('time-label');

        // Sequential: process one at a time
        [1, 2, 3, 4].forEach((n, i) => {
            const delay = i * 1.2;
            this.tl
                // Move TX to processor
                .to(`#seq-tx-${n}`, {
                    duration: 0.3,
                    x: 90,
                    opacity: 1,
                    ease: 'power2.inOut'
                }, delay)
                // Process
                .to(`#seq-tx-${n}`, {
                    duration: 0.6,
                    fill: '#088395',
                    ease: 'none'
                }, delay + 0.3)
                // Move to done
                .to(`#seq-tx-${n}`, {
                    duration: 0.3,
                    x: 170,
                    opacity: 0,
                    ease: 'power2.inOut'
                }, delay + 0.9)
                // Show checkmark
                .to(`#seq-done-${n}`, {
                    duration: 0.2,
                    opacity: 1,
                    scale: 1.2,
                    ease: 'back.out'
                }, delay + 1.0)
                .to(`#seq-done-${n}`, {
                    duration: 0.1,
                    scale: 1
                }, delay + 1.2);
        });

        // Parallel: process all at once (starts slightly after sequential for comparison)
        const parDelay = 0.5;
        [1, 2, 3, 4].forEach((n) => {
            this.tl
                // Move all TXs to processors simultaneously
                .to(`#par-tx-${n}`, {
                    duration: 0.3,
                    x: 90,
                    ease: 'power2.inOut'
                }, parDelay)
                // Process all simultaneously
                .to(`#par-tx-${n}`, {
                    duration: 0.8,
                    fill: '#09637E',
                    ease: 'none'
                }, parDelay + 0.3)
                // Move all to done
                .to(`#par-tx-${n}`, {
                    duration: 0.3,
                    x: 170,
                    opacity: 0,
                    ease: 'power2.inOut'
                }, parDelay + 1.1)
                // Show all checkmarks
                .to(`#par-done-${n}`, {
                    duration: 0.2,
                    opacity: 1,
                    scale: 1.2,
                    ease: 'back.out'
                }, parDelay + 1.3)
                .to(`#par-done-${n}`, {
                    duration: 0.1,
                    scale: 1
                }, parDelay + 1.5);
        });

        // Update time label
        let currentTime = 0;
        this.tl.eventCallback('onUpdate', () => {
            const time = (this.tl.time()).toFixed(1);
            timeLabel.textContent = `Time: ${time}s`;
        });

        // Add labels showing completion
        this.tl
            .add(() => {
                // Parallel finishes here
            }, 2)
            .add(() => {
                // Sequential still going
            }, 5);
    },

    play() {
        if (this.tl) this.tl.play();
    },

    pause() {
        if (this.tl) this.tl.pause();
    },

    reset() {
        if (this.tl) this.tl.restart().pause();
        // Reset all transforms
        gsap.set(['#seq-tx-1', '#seq-tx-2', '#seq-tx-3', '#seq-tx-4'], { x: 0, opacity: 0.8, fill: '#09637E' });
        gsap.set(['#par-tx-1', '#par-tx-2', '#par-tx-3', '#par-tx-4'], { x: 0, opacity: 0.8, fill: '#088395' });
        gsap.set(['#seq-done-1', '#seq-done-2', '#seq-done-3', '#seq-done-4'], { opacity: 0, scale: 1 });
        gsap.set(['#par-done-1', '#par-done-2', '#par-done-3', '#par-done-4'], { opacity: 0, scale: 1 });
    }
};

// Transaction Lifecycle Animation
const txLifecycleAnimation = {
    container: null,
    svg: null,
    tl: null,
    currentStep: 0,

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.createSVG();
        this.buildAnimation();
    },

    createSVG() {
        this.container.innerHTML = `
            <svg id="tx-lifecycle-svg" width="100%" height="100%" viewBox="0 0 700 320">
                <defs>
                    <filter id="glow-tx">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#09637E"/>
                    </marker>
                </defs>

                <!-- Step labels -->
                <g id="steps">
                    <text x="70" y="30" text-anchor="middle" fill="#666" font-size="11">1. Create</text>
                    <text x="200" y="30" text-anchor="middle" fill="#666" font-size="11">2. Sign</text>
                    <text x="350" y="30" text-anchor="middle" fill="#666" font-size="11">3. Submit</text>
                    <text x="500" y="30" text-anchor="middle" fill="#666" font-size="11">4. Process</text>
                    <text x="630" y="30" text-anchor="middle" fill="#666" font-size="11">5. Confirm</text>
                </g>

                <!-- Wallet -->
                <g id="wallet">
                    <rect x="30" y="80" width="80" height="100" rx="8" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="2"/>
                    <text x="70" y="120" text-anchor="middle" fill="#09637E" font-size="11">Wallet</text>
                    <text x="70" y="140" text-anchor="middle" fill="#666" font-size="9">(You)</text>
                    <text x="70" y="165" text-anchor="middle" fill="#666" font-size="8">Private Key</text>
                </g>

                <!-- Transaction being built -->
                <g id="tx-build" opacity="0">
                    <rect x="40" y="200" width="60" height="40" rx="4" fill="#09637E"/>
                    <text x="70" y="225" text-anchor="middle" fill="white" font-size="10">TX</text>
                </g>

                <!-- Signature -->
                <g id="signature" opacity="0">
                    <rect x="160" y="100" width="80" height="60" rx="8" fill="rgba(20,241,149,0.2)" stroke="#088395" stroke-width="2"/>
                    <text x="200" y="125" text-anchor="middle" fill="#088395" font-size="10">Signature</text>
                    <text x="200" y="145" text-anchor="middle" fill="#666" font-size="8">Cryptographic</text>
                </g>

                <!-- RPC Node -->
                <g id="rpc-node">
                    <rect x="300" y="80" width="100" height="100" rx="8" fill="rgba(153,69,255,0.1)" stroke="#09637E" stroke-width="2"/>
                    <text x="350" y="120" text-anchor="middle" fill="#09637E" font-size="11">RPC Node</text>
                    <text x="350" y="140" text-anchor="middle" fill="#666" font-size="9">Gateway to</text>
                    <text x="350" y="155" text-anchor="middle" fill="#666" font-size="9">Solana</text>
                </g>

                <!-- Validators -->
                <g id="validators">
                    <rect x="450" y="60" width="100" height="50" rx="6" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="1"/>
                    <text x="500" y="90" text-anchor="middle" fill="#09637E" font-size="9">Validator 1</text>

                    <rect x="450" y="120" width="100" height="50" rx="6" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="1"/>
                    <text x="500" y="150" text-anchor="middle" fill="#09637E" font-size="9">Validator 2</text>

                    <rect x="450" y="180" width="100" height="50" rx="6" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="1"/>
                    <text x="500" y="210" text-anchor="middle" fill="#09637E" font-size="9">Validator 3</text>
                </g>

                <!-- Confirmation -->
                <g id="confirmation" opacity="0">
                    <circle cx="630" cy="130" r="40" fill="none" stroke="#088395" stroke-width="3"/>
                    <path d="M610 130 L625 145 L655 115" stroke="#088395" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <text x="630" y="190" text-anchor="middle" fill="#088395" font-size="11">Finalized!</text>
                </g>

                <!-- Moving transaction packet -->
                <g id="tx-packet" opacity="0">
                    <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#088395" filter="url(#glow-tx)"/>
                    <text x="0" y="5" text-anchor="middle" fill="#09637E" font-size="10" font-weight="bold">TX</text>
                </g>

                <!-- Status text -->
                <text id="status-text" x="350" y="290" text-anchor="middle" fill="#888" font-size="12"></text>
            </svg>
        `;
        this.svg = document.getElementById('tx-lifecycle-svg');
    },

    buildAnimation() {
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true });

        const statusText = document.getElementById('status-text');
        const steps = [
            'Creating transaction with instructions...',
            'Signing with your private key...',
            'Submitting to RPC node...',
            'Validators processing transaction...',
            'Transaction confirmed and finalized!'
        ];

        // Step 1: Create transaction
        this.tl
            .to('#tx-build', { duration: 0.5, opacity: 1, ease: 'power2.out' })
            .add(() => { statusText.textContent = steps[0]; })
            .to('#tx-build', { duration: 0.3, scale: 1.1, ease: 'power2.out' }, '+=0.2')
            .to('#tx-build', { duration: 0.2, scale: 1 });

        // Step 2: Sign
        this.tl
            .add(() => { statusText.textContent = steps[1]; }, '+=0.3')
            .to('#signature', { duration: 0.5, opacity: 1, ease: 'power2.out' })
            .to('#tx-build', {
                duration: 0.4,
                x: 130,
                y: -90,
                ease: 'power2.inOut'
            })
            .to(['#tx-build', '#signature'], {
                duration: 0.3,
                fill: '#088395',
                stroke: '#088395'
            });

        // Step 3: Submit to RPC
        this.tl
            .add(() => { statusText.textContent = steps[2]; }, '+=0.3')
            .set('#tx-packet', { opacity: 1, x: 200, y: 130 })
            .to('#tx-build', { duration: 0.2, opacity: 0 })
            .to('#signature', { duration: 0.2, opacity: 0 })
            .to('#tx-packet', {
                duration: 0.6,
                x: 350,
                ease: 'power2.inOut'
            });

        // Step 4: Process by validators
        this.tl
            .add(() => { statusText.textContent = steps[3]; })
            .to('#tx-packet', { duration: 0.4, x: 500, ease: 'power2.inOut' })
            .to('#validators rect', {
                duration: 0.3,
                fill: 'rgba(20,241,149,0.3)',
                stroke: '#088395',
                stagger: 0.15
            });

        // Step 5: Confirmation
        this.tl
            .add(() => { statusText.textContent = steps[4]; }, '+=0.3')
            .to('#tx-packet', { duration: 0.4, x: 630, ease: 'power2.inOut' })
            .to('#tx-packet', { duration: 0.2, opacity: 0 })
            .to('#confirmation', {
                duration: 0.5,
                opacity: 1,
                scale: 1,
                ease: 'back.out'
            })
            .from('#confirmation circle', {
                duration: 0.4,
                scale: 0,
                ease: 'back.out'
            }, '-=0.3')
            .from('#confirmation path', {
                duration: 0.3,
                drawSVG: '0%',
                ease: 'power2.out'
            }, '-=0.2');
    },

    play() {
        if (this.tl) this.tl.play();
    },

    pause() {
        if (this.tl) this.tl.pause();
    },

    reset() {
        if (this.tl) this.tl.restart().pause();
        // Reset all elements
        gsap.set('#tx-build', { opacity: 0, x: 0, y: 0, scale: 1, fill: '#09637E' });
        gsap.set('#signature', { opacity: 0, fill: 'rgba(20,241,149,0.2)', stroke: '#088395' });
        gsap.set('#tx-packet', { opacity: 0, x: 0, y: 0 });
        gsap.set('#confirmation', { opacity: 0, scale: 1 });
        gsap.set('#validators rect', { fill: 'rgba(153,69,255,0.2)', stroke: '#09637E' });
        document.getElementById('status-text').textContent = '';
    },

    step() {
        const labels = this.tl.getLabels();
        this.currentStep = (this.currentStep + 1) % 5;
        // Simple step through - play for 1.5 seconds
        this.tl.play();
        setTimeout(() => this.tl.pause(), 1500);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('processing-animation')) {
        processingAnimation.init('processing-animation');
    }
    if (document.getElementById('tx-lifecycle-animation')) {
        txLifecycleAnimation.init('tx-lifecycle-animation');
    }
});

// Export
window.processingAnimation = processingAnimation;
window.txLifecycleAnimation = txLifecycleAnimation;
