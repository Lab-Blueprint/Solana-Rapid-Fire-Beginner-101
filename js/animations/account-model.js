/**
 * Account Model Animation
 * Visualizes Solana's account structure and PDA derivation
 */

const accountAnimation = {
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
            <svg id="account-svg" width="100%" height="100%" viewBox="0 0 700 320">
                <defs>
                    <filter id="glow-account">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="accountGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#09637E;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#088395;stop-opacity:1" />
                    </linearGradient>
                </defs>

                <!-- Title -->
                <text x="350" y="25" text-anchor="middle" fill="#888" font-size="14">Solana Account Structure</text>

                <!-- Account Box -->
                <g id="account-box">
                    <rect x="200" y="50" width="300" height="220" rx="12" fill="rgba(153,69,255,0.1)" stroke="#09637E" stroke-width="2"/>
                    <rect x="200" y="50" width="300" height="35" rx="12" fill="#09637E"/>
                    <rect x="200" y="73" width="300" height="12" fill="#09637E"/>
                    <text x="350" y="75" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Account</text>
                </g>

                <!-- Account Fields -->
                <g id="account-fields">
                    <!-- Lamports -->
                    <g id="field-lamports" opacity="0">
                        <rect x="220" y="100" width="260" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
                        <text x="235" y="123" fill="#09637E" font-size="11" font-weight="bold">lamports</text>
                        <text x="340" y="123" fill="#888" font-size="11">1,500,000,000</text>
                        <text x="460" y="123" fill="#666" font-size="9">(1.5 SOL)</text>
                    </g>

                    <!-- Data -->
                    <g id="field-data" opacity="0">
                        <rect x="220" y="145" width="260" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
                        <text x="235" y="168" fill="#088395" font-size="11" font-weight="bold">data</text>
                        <text x="340" y="168" fill="#888" font-size="11">[user_stats bytes...]</text>
                    </g>

                    <!-- Owner -->
                    <g id="field-owner" opacity="0">
                        <rect x="220" y="190" width="260" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
                        <text x="235" y="213" fill="#09637E" font-size="11" font-weight="bold">owner</text>
                        <text x="340" y="213" fill="#888" font-size="10">YourProgram111...111</text>
                    </g>

                    <!-- Executable & Rent Epoch -->
                    <g id="field-extra" opacity="0">
                        <rect x="220" y="235" width="125" height="25" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)"/>
                        <text x="235" y="252" fill="#666" font-size="9">executable: false</text>

                        <rect x="355" y="235" width="125" height="25" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)"/>
                        <text x="370" y="252" fill="#666" font-size="9">rent_epoch: 364</text>
                    </g>
                </g>

                <!-- Ownership Arrow -->
                <g id="ownership" opacity="0">
                    <path d="M 520 207 L 580 207 L 580 130 L 620 130" stroke="#09637E" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
                    <text x="620" y="110" fill="#09637E" font-size="11" font-weight="bold">Program</text>
                    <rect x="600" y="115" width="80" height="40" rx="6" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="2"/>
                    <text x="640" y="140" text-anchor="middle" fill="#09637E" font-size="9">Controls</text>
                </g>

                <!-- Legend -->
                <g id="legend" opacity="0">
                    <rect x="30" y="100" width="140" height="150" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)"/>
                    <text x="100" y="125" text-anchor="middle" fill="#888" font-size="10" font-weight="bold">Account Types</text>

                    <circle cx="50" cy="150" r="8" fill="#09637E"/>
                    <text x="65" y="154" fill="#888" font-size="9">Wallet (SOL)</text>

                    <circle cx="50" cy="180" r="8" fill="#088395"/>
                    <text x="65" y="184" fill="#888" font-size="9">Token Account</text>

                    <circle cx="50" cy="210" r="8" fill="url(#accountGradient)"/>
                    <text x="65" y="214" fill="#888" font-size="9">PDA (Data)</text>
                </g>

                <!-- Status -->
                <text id="account-status" x="350" y="300" text-anchor="middle" fill="#666" font-size="11"></text>
            </svg>
        `;
        this.svg = document.getElementById('account-svg');
    },

    buildAnimation() {
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true, repeat: 0 });

        const statusText = document.getElementById('account-status');

        // Animate account box appearing
        this.tl
            .from('#account-box', {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out'
            })
            .add(() => { statusText.textContent = 'Accounts store all data on Solana'; });

        // Animate fields appearing one by one
        this.tl
            .to('#field-lamports', {
                duration: 0.4,
                opacity: 1,
                x: 0,
                ease: 'power2.out'
            }, '+=0.5')
            .from('#field-lamports rect', {
                duration: 0.3,
                scaleX: 0,
                transformOrigin: 'left center'
            }, '-=0.3')
            .add(() => { statusText.textContent = 'lamports: Balance in smallest SOL unit (1 SOL = 1B lamports)'; });

        this.tl
            .to('#field-data', {
                duration: 0.4,
                opacity: 1,
                ease: 'power2.out'
            }, '+=0.8')
            .from('#field-data rect', {
                duration: 0.3,
                scaleX: 0,
                transformOrigin: 'left center'
            }, '-=0.3')
            .add(() => { statusText.textContent = 'data: Arbitrary bytes storing account state'; });

        this.tl
            .to('#field-owner', {
                duration: 0.4,
                opacity: 1,
                ease: 'power2.out'
            }, '+=0.8')
            .from('#field-owner rect', {
                duration: 0.3,
                scaleX: 0,
                transformOrigin: 'left center'
            }, '-=0.3')
            .add(() => { statusText.textContent = 'owner: The program that controls this account'; });

        this.tl
            .to('#field-extra', {
                duration: 0.3,
                opacity: 1,
                ease: 'power2.out'
            }, '+=0.8')
            .add(() => { statusText.textContent = 'executable: Is this a program? rent_epoch: For rent tracking'; });

        // Show ownership relationship
        this.tl
            .to('#ownership', {
                duration: 0.5,
                opacity: 1,
                ease: 'power2.out'
            }, '+=0.8')
            .from('#ownership path', {
                duration: 0.5,
                drawSVG: '0%'
            }, '-=0.4')
            .add(() => { statusText.textContent = 'Only the owner program can modify account data'; });

        // Show legend
        this.tl
            .to('#legend', {
                duration: 0.5,
                opacity: 1,
                ease: 'power2.out'
            }, '+=0.8')
            .from('#legend circle', {
                duration: 0.3,
                scale: 0,
                stagger: 0.15,
                ease: 'back.out'
            }, '-=0.3')
            .add(() => { statusText.textContent = 'Different account types serve different purposes'; });

        // Final pulse
        this.tl
            .to('#account-box rect:first-child', {
                duration: 0.3,
                stroke: '#088395',
                ease: 'power2.out'
            }, '+=0.5')
            .to('#account-box rect:first-child', {
                duration: 0.3,
                stroke: '#09637E',
                ease: 'power2.out'
            });
    },

    play() {
        if (this.tl) this.tl.play();
    },

    pause() {
        if (this.tl) this.tl.pause();
    },

    reset() {
        if (this.tl) this.tl.restart().pause();
        gsap.set(['#field-lamports', '#field-data', '#field-owner', '#field-extra', '#ownership', '#legend'], { opacity: 0 });
        document.getElementById('account-status').textContent = '';
    }
};

// PDA Derivation Animation
const pdaAnimation = {
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
            <svg id="pda-svg" width="100%" height="100%" viewBox="0 0 700 300">
                <defs>
                    <linearGradient id="pdaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#09637E"/>
                        <stop offset="100%" style="stop-color:#088395"/>
                    </linearGradient>
                </defs>

                <text x="350" y="25" text-anchor="middle" fill="#888" font-size="14">PDA Derivation</text>

                <!-- Seeds -->
                <g id="seeds">
                    <rect x="50" y="60" width="150" height="40" rx="8" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="2"/>
                    <text x="125" y="85" text-anchor="middle" fill="#09637E" font-size="11">"user-stats"</text>
                    <text x="125" y="50" text-anchor="middle" fill="#666" font-size="10">Seed 1 (string)</text>

                    <rect x="50" y="120" width="150" height="40" rx="8" fill="rgba(153,69,255,0.2)" stroke="#09637E" stroke-width="2"/>
                    <text x="125" y="145" text-anchor="middle" fill="#09637E" font-size="9">User7C4js...8HRtp</text>
                    <text x="125" y="110" text-anchor="middle" fill="#666" font-size="10">Seed 2 (pubkey)</text>
                </g>

                <!-- Program ID -->
                <g id="program-id">
                    <rect x="50" y="200" width="150" height="40" rx="8" fill="rgba(20,241,149,0.2)" stroke="#088395" stroke-width="2"/>
                    <text x="125" y="225" text-anchor="middle" fill="#088395" font-size="9">Program123...xyz</text>
                    <text x="125" y="190" text-anchor="middle" fill="#666" font-size="10">Program ID</text>
                </g>

                <!-- Hash Function -->
                <g id="hash-fn" opacity="0">
                    <rect x="280" y="100" width="140" height="80" rx="12" fill="rgba(255,255,255,0.05)" stroke="url(#pdaGradient)" stroke-width="2"/>
                    <text x="350" y="135" text-anchor="middle" fill="white" font-size="12" font-weight="bold">SHA256</text>
                    <text x="350" y="155" text-anchor="middle" fill="#888" font-size="10">Hash Function</text>
                </g>

                <!-- Arrows to hash -->
                <g id="arrows-in" opacity="0">
                    <path d="M200 80 L280 120" stroke="#09637E" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
                    <path d="M200 140 L280 140" stroke="#09637E" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
                    <path d="M200 220 L280 160" stroke="#088395" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
                </g>

                <!-- Bump -->
                <g id="bump" opacity="0">
                    <rect x="340" y="200" width="60" height="30" rx="6" fill="rgba(255,200,50,0.2)" stroke="#ffc832" stroke-width="2"/>
                    <text x="370" y="220" text-anchor="middle" fill="#ffc832" font-size="11">bump</text>
                    <text x="370" y="245" text-anchor="middle" fill="#666" font-size="9">255</text>
                    <path d="M370 200 L370 180" stroke="#ffc832" stroke-width="2" fill="none" stroke-dasharray="4,4"/>
                </g>

                <!-- Output PDA -->
                <g id="pda-output" opacity="0">
                    <rect x="500" y="100" width="170" height="80" rx="12" fill="url(#pdaGradient)" filter="url(#glow-account)"/>
                    <text x="585" y="130" text-anchor="middle" fill="white" font-size="11" font-weight="bold">PDA Address</text>
                    <text x="585" y="150" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9">9wLBa3T...mNpQr</text>
                    <text x="585" y="170" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8">Deterministic!</text>
                </g>

                <!-- Arrow to output -->
                <g id="arrow-out" opacity="0">
                    <path d="M420 140 L500 140" stroke="url(#pdaGradient)" stroke-width="3" fill="none" marker-end="url(#arrowhead)"/>
                </g>

                <!-- Properties -->
                <g id="properties" opacity="0">
                    <text x="585" y="210" text-anchor="middle" fill="#088395" font-size="10">No private key exists</text>
                    <text x="585" y="230" text-anchor="middle" fill="#088395" font-size="10">Program can sign</text>
                    <text x="585" y="250" text-anchor="middle" fill="#088395" font-size="10">Same seeds = Same PDA</text>
                </g>

                <text id="pda-status" x="350" y="285" text-anchor="middle" fill="#666" font-size="11"></text>
            </svg>
        `;
    },

    buildAnimation() {
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline({ paused: true });

        const statusText = document.getElementById('pda-status');

        this.tl
            .add(() => { statusText.textContent = 'PDAs are derived from seeds + program ID'; })
            .from('#seeds rect', {
                duration: 0.4,
                scale: 0.8,
                opacity: 0,
                stagger: 0.2,
                ease: 'back.out'
            })
            .from('#program-id rect', {
                duration: 0.4,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out'
            }, '-=0.2');

        this.tl
            .to('#hash-fn', { duration: 0.4, opacity: 1 }, '+=0.5')
            .to('#arrows-in', { duration: 0.4, opacity: 1 })
            .add(() => { statusText.textContent = 'Seeds and program ID are hashed together'; });

        this.tl
            .to('#bump', { duration: 0.4, opacity: 1 }, '+=0.5')
            .add(() => { statusText.textContent = 'Bump ensures address is off the Ed25519 curve'; });

        this.tl
            .to('#arrow-out', { duration: 0.3, opacity: 1 }, '+=0.5')
            .to('#pda-output', {
                duration: 0.5,
                opacity: 1,
                scale: 1,
                ease: 'back.out'
            })
            .from('#pda-output', {
                duration: 0.3,
                x: -20
            }, '-=0.3')
            .add(() => { statusText.textContent = 'Result: A deterministic address owned by the program'; });

        this.tl
            .to('#properties', {
                duration: 0.4,
                opacity: 1
            }, '+=0.5')
            .from('#properties text', {
                duration: 0.3,
                y: 10,
                opacity: 0,
                stagger: 0.15
            }, '-=0.3')
            .add(() => { statusText.textContent = 'Same inputs always produce the same PDA!'; });
    },

    play() {
        if (this.tl) this.tl.play();
    },

    pause() {
        if (this.tl) this.tl.pause();
    },

    reset() {
        if (this.tl) this.tl.restart().pause();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('account-model-animation')) {
        accountAnimation.init('account-model-animation');
    }
    if (document.getElementById('pda-animation')) {
        pdaAnimation.init('pda-animation');
    }
});

// Export
window.accountAnimation = accountAnimation;
window.pdaAnimation = pdaAnimation;
