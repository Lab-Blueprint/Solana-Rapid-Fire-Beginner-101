/**
 * Everything Everywhere All At Once Animation
 * Step-based flow mirroring the computer interaction.
 */

const allAtOnceAnimation = {
    container: null,
    svg: null,
    stepIndex: 0,
    currentBatch: null,
    blockCount: 0,
    state: { A: 2, B: 3, C: 5 },
    steps: ['input', 'toValidator', 'leader', 'broadcast', 'finalize'],
    blockColors: ['#FF6B6B', '#F4B740', '#4ECDC4', '#7B6CF6'],
    currentColor: '#FF6B6B',

    leaderSlot: { x: 560, y: 190 },
    validatorSlots: [
        { x: 320, y: 90 },
        { x: 320, y: 190 },
        { x: 320, y: 290 }
    ],
    validators: [
        { id: 'V1', x: 560, y: 190, flag: '🇺🇸', leader: true },
        { id: 'V2', x: 320, y: 90, flag: '🇬🇧', leader: false },
        { id: 'V3', x: 320, y: 190, flag: '🇯🇵', leader: false },
        { id: 'V4', x: 320, y: 290, flag: '🇫🇷', leader: false }
    ],

    clients: [],

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.buildClients();
        this.render();
        this.bind();
        this.updateStatus('Click "Step" to move inputs through the network.');
    },

    buildClients() {
        const positions = [
            [120, 110], [120, 170], [120, 230], [120, 290], [120, 350]
        ];
        const validatorsWithClients = this.validators.filter(v => !v.leader);
        this.clients = positions.map((pos, idx) => {
            const assigned = validatorsWithClients[idx % validatorsWithClients.length];
            return {
                id: `C${idx + 1}`,
                x: pos[0],
                y: pos[1],
                validatorId: assigned.id
            };
        });
    },

    render() {
        this.container.innerHTML = `
            <div class="animation-container">
                <div id="all-at-once-svg" class="all-at-once-board p-6" style="height: 460px;"></div>
                <div class="all-at-once-status" id="all-at-once-status"></div>
                <div class="animation-controls">
                    <button id="all-at-once-step">Step</button>
                    <button id="all-at-once-auto" class="btn-secondary">Auto Play</button>
                    <button id="all-at-once-reset" class="ml-auto">Reset State</button>
                </div>
            </div>
        `;

        const svgWrap = this.container.querySelector('#all-at-once-svg');
        svgWrap.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 900 420">
                <defs>
                    <linearGradient id="validatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#09637E"/>
                        <stop offset="100%" stop-color="#7AB2B2"/>
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <!-- Clients -->
                <g id="clients">
                    ${this.clients.map(c => `
                        <circle cx="${c.x}" cy="${c.y}" r="10" fill="#F4B740" />
                        <text x="${c.x + 16}" y="${c.y + 4}" font-size="10" fill="#8B5E00">${c.id}</text>
                    `).join('')}
                </g>

                <!-- Validators -->
                <g id="validators">
                    ${this.validators.map(v => `
                        ${(() => {
                            const style = this.getValidatorStyle(v.id);
                            return `
                        <g id="${v.id}">
                            <circle id="${v.id}-circle" cx="${v.x}" cy="${v.y}" r="${style.r}" fill="url(#validatorGradient)" filter="url(#glow)" stroke="${style.stroke}" stroke-width="3" />
                            <text id="${v.id}-label" x="${v.x}" y="${v.y + 4}" text-anchor="middle" font-size="12" fill="#EBF4F6">${v.id}${v.leader ? ' (Leader)' : ''}</text>
                            <text id="${v.id}-flag" x="${v.x}" y="${v.y + 24}" text-anchor="middle" font-size="14">${v.flag}</text>
                        </g>
                            `;
                        })()}
                    `).join('')}
                </g>

                <!-- Memory panel -->
                <g id="memory-panel">
                    <rect x="680" y="60" width="190" height="80" rx="12" fill="rgba(9,99,126,0.1)" stroke="rgba(9,99,126,0.4)" />
                    <text x="775" y="85" text-anchor="middle" font-size="11" fill="#09637E">Memory (State)</text>
                    <text id="memory-line" x="695" y="110" font-size="11" fill="#0f172a">A=${this.state.A} B=${this.state.B} C=${this.state.C}</text>
                </g>

                <!-- Ledger stack -->
                <g id="ledger">
                    <text x="775" y="175" text-anchor="middle" font-size="11" fill="#09637E">Ledger (Blocks)</text>
                    ${[0,1,2].map(i => {
                        const y = 190 + i * 70;
                        return `
                            <rect id="block-${i}" x="680" y="${y}" width="190" height="60" rx="10" fill="rgba(122,178,178,0.2)" stroke="rgba(9,99,126,0.35)" />
                            <text id="block-${i}-l1" x="690" y="${y + 20}" font-size="10" fill="#0f172a"></text>
                            <text id="block-${i}-l2" x="690" y="${y + 36}" font-size="10" fill="#0f172a"></text>
                            <text id="block-${i}-l3" x="690" y="${y + 52}" font-size="10" fill="#0f172a"></text>
                        `;
                    }).join('')}
                </g>

            </svg>
        `;

        this.svg = svgWrap.querySelector('svg');
        this.bindValidatorClicks();
        this.updateLedger();
    },

    bind() {
        const stepBtn = this.container.querySelector('#all-at-once-step');
        const autoBtn = this.container.querySelector('#all-at-once-auto');
        const resetBtn = this.container.querySelector('#all-at-once-reset');

        if (stepBtn) stepBtn.addEventListener('click', () => this.step());
        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                if (this.autoTimer) {
                    clearInterval(this.autoTimer);
                    this.autoTimer = null;
                    autoBtn.textContent = 'Auto Play';
                    return;
                }
                this.autoTimer = setInterval(() => this.step(), 1200);
                autoBtn.textContent = 'Stop';
            });
        }
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetState());
    },

    bindValidatorClicks() {
        const nodes = this.container.querySelectorAll('#validators circle');
        nodes.forEach((node, idx) => {
            node.style.cursor = 'pointer';
            const id = this.validators[idx].id;
            node.addEventListener('click', () => this.updateStatus(`${id} memory: A=${this.state.A}, B=${this.state.B}, C=${this.state.C}`));
        });
    },

    getValidatorStyle(id) {
        const styles = {
            V1: { stroke: '#FF6B6B', r: 38 },
            V2: { stroke: '#4ECDC4', r: 34 },
            V3: { stroke: '#7B6CF6', r: 36 },
            V4: { stroke: '#F4B740', r: 35 }
        };
        return styles[id] || { stroke: '#F4B740', r: 36 };
    },

    randomCommand(clientId) {
        const targets = ['A', 'B', 'C'];
        const ops = ['+', '-', '*', '/'];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const value = Math.floor(Math.random() * 5) + 1;
        return { clientId, target, op, value };
    },

    makeBatch() {
        const shuffled = [...this.clients].sort(() => Math.random() - 0.5).slice(0, 3);
        const nonLeaders = this.validators.filter(v => !v.leader);
        return shuffled.map(c => {
            const cmd = this.randomCommand(c.id);
            cmd.assignedValidator = nonLeaders[Math.floor(Math.random() * nonLeaders.length)].id;
            return cmd;
        });
    },

    applyBatch() {
        this.currentBatch.forEach((cmd) => {
            if (cmd.op === '+') this.state[cmd.target] += cmd.value;
            if (cmd.op === '-') this.state[cmd.target] = Math.max(0, this.state[cmd.target] - cmd.value);
            if (cmd.op === '*') this.state[cmd.target] *= cmd.value;
            if (cmd.op === '/') this.state[cmd.target] = Math.max(0, Math.floor(this.state[cmd.target] / cmd.value));
        });
        const mem = this.svg.querySelector('#memory-line');
        if (mem) mem.textContent = `A=${this.state.A} B=${this.state.B} C=${this.state.C}`;
    },


    drawTempLine(x1, y1, x2, y2, color) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0.9');
        this.svg.appendChild(line);
        return line;
    },

    animatePacket(fromX, fromY, toX, toY, color, delay = 0) {
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('r', '6');
        packet.setAttribute('fill', color);
        packet.setAttribute('filter', 'url(#glow)');
        this.svg.appendChild(packet);
        gsap.set(packet, { opacity: 1, attr: { cx: fromX, cy: fromY } });
        gsap.to(packet, {
            duration: 0.5,
            attr: { cx: toX, cy: toY },
            delay,
            ease: 'power2.inOut',
            onComplete: () => packet.remove()
        });
    },

    cleanupLine(line, delay = 0.6) {
        gsap.to(line, { duration: 0.3, opacity: 0, delay, onComplete: () => line.remove() });
    },

    animateTransfer(fromX, fromY, toX, toY, color, delay = 0) {
        const line = this.drawTempLine(fromX, fromY, toX, toY, color);
        this.animatePacket(fromX, fromY, toX, toY, color, delay);
        this.cleanupLine(line, 0.6 + delay);
    },

    updateLedger() {
        for (let i = 0; i < 3; i++) {
            const l1 = this.svg.querySelector(`#block-${i}-l1`);
            const l2 = this.svg.querySelector(`#block-${i}-l2`);
            const l3 = this.svg.querySelector(`#block-${i}-l3`);
            if (l1) l1.textContent = '';
            if (l2) l2.textContent = '';
            if (l3) l3.textContent = '';
        }
        if (!this.ledger || this.ledger.length === 0) return;
        const latest = this.ledger.slice(0, 3);
        latest.forEach((block, idx) => {
            const rect = this.svg.querySelector(`#block-${idx}`);
            const l1 = this.svg.querySelector(`#block-${idx}-l1`);
            const l2 = this.svg.querySelector(`#block-${idx}-l2`);
            const l3 = this.svg.querySelector(`#block-${idx}-l3`);
            if (rect && block.color) {
                rect.setAttribute('stroke', block.color);
                rect.setAttribute('fill', block.color + '22');
            }
            if (l1) l1.textContent = `Block ${block.id}`;
            if (l2) l2.textContent = block.lines[0] || '';
            if (l3) l3.textContent = block.lines[1] || '';
        });
    },

    highlightGroup(id, active) {
        const group = this.svg.querySelector(id);
        if (!group) return;
        group.classList.toggle('highlighted', active);
    },

    updateValidatorPositions() {
        const leader = this.validators.find(v => v.leader);
        const others = this.validators.filter(v => !v.leader);

        if (leader) {
            leader.x = this.leaderSlot.x;
            leader.y = this.leaderSlot.y;
        }

        others.forEach((v, idx) => {
            const slot = this.validatorSlots[idx % this.validatorSlots.length];
            v.x = slot.x;
            v.y = slot.y;
        });

        this.validators.forEach((v) => {
            const circle = this.svg.querySelector(`#${v.id}-circle`);
            const label = this.svg.querySelector(`#${v.id}-label`);
            const flag = this.svg.querySelector(`#${v.id}-flag`);
            const style = this.getValidatorStyle(v.id);
            if (circle) {
                circle.setAttribute('cx', v.x);
                circle.setAttribute('cy', v.y);
                circle.setAttribute('r', style.r);
                circle.setAttribute('stroke', style.stroke);
            }
            if (label) {
                label.setAttribute('x', v.x);
                label.setAttribute('y', v.y + 4);
                label.textContent = `${v.id}${v.leader ? ' (Leader)' : ''}`;
            }
            if (flag) {
                flag.setAttribute('x', v.x);
                flag.setAttribute('y', v.y + 24);
            }
        });
    },

    rotateLeader() {
        const currentIndex = this.validators.findIndex(v => v.leader);
        if (currentIndex === -1) return;
        this.validators[currentIndex].leader = false;
        const nextIndex = (currentIndex + 1) % this.validators.length;
        this.validators[nextIndex].leader = true;
        this.updateValidatorPositions();
        this.buildClients();
    },

    step() {
        if (!this.currentBatch) {
            this.currentBatch = this.makeBatch();
            this.stepIndex = 0;
            this.currentColor = this.blockColors[this.blockCount % this.blockColors.length];
        }

        const leader = this.validators.find(v => v.leader);

        if (this.stepIndex === 0) {
            this.updateStatus('Inputs created by clients.');
            const nonLeaders = this.validators.filter(v => !v.leader);
            this.currentBatch.forEach((cmd, idx) => {
                const client = this.clients.find(c => c.id === cmd.clientId);
                let v = this.validators.find(val => val.id === cmd.assignedValidator);
                if (!v || v.leader) v = nonLeaders[idx % nonLeaders.length];
                this.animateTransfer(client.x, client.y, v.x, v.y, this.currentColor, idx * 0.08);
            });
        }

        if (this.stepIndex === 1) {
            this.updateStatus('Validators communicate and send inputs to the leader.');
            const nonLeaders = this.validators.filter(v => !v.leader);
            const communicator = nonLeaders.slice(0, -1);
            if (communicator.length >= 2) {
                for (let i = 0; i < communicator.length - 1; i += 1) {
                    const a = communicator[i];
                    const b = communicator[i + 1];
                    this.animateTransfer(a.x, a.y, b.x, b.y, this.currentColor, 0.02 + i * 0.08);
                    this.animateTransfer(b.x, b.y, a.x, a.y, this.currentColor, 0.06 + i * 0.08);
                }
            }
            this.currentBatch.forEach((cmd, idx) => {
                const client = this.clients.find(c => c.id === cmd.clientId);
                let v = this.validators.find(val => val.id === cmd.assignedValidator);
                if (!v || v.leader) v = nonLeaders[idx % nonLeaders.length];
                this.animateTransfer(v.x, v.y, leader.x, leader.y, this.currentColor, idx * 0.08);
            });
        }

        if (this.stepIndex === 2) {
            this.updateStatus('Leader builds the block (list of inputs).');
            this.highlightGroup('#ledger', true);
            this.highlightGroup('#memory-panel', false);
        }

        if (this.stepIndex === 3) {
            this.updateStatus('Leader broadcasts block to validators.');
            this.validators.forEach((v, idx) => {
                if (v.leader) return;
                this.animateTransfer(leader.x, leader.y, v.x, v.y, this.currentColor, idx * 0.08);
            });
        }

        if (this.stepIndex === 4) {
            this.applyBatch();
            if (!this.ledger) this.ledger = [];
            const blockLines = this.currentBatch.map(cmd => `${cmd.clientId}: ${cmd.target} ${cmd.op} ${cmd.value}`);
            this.blockCount += 1;
            this.ledger.unshift({ id: this.blockCount, lines: blockLines, color: this.currentColor });
            this.updateLedger();
            this.updateStatus(`State synced: A=${this.state.A}, B=${this.state.B}, C=${this.state.C}. Ledger updated.`);
            this.highlightGroup('#ledger', false);
            this.highlightGroup('#memory-panel', true);
            this.currentBatch = null;
            this.rotateLeader();
        }

        this.stepIndex += 1;
        if (this.stepIndex >= this.steps.length) {
            this.stepIndex = 0;
        }
    },

    resetState() {
        this.state = { A: 2, B: 3, C: 5 };
        this.currentBatch = null;
        this.stepIndex = 0;
        this.ledger = [];
        this.blockCount = 0;
        if (this.autoTimer) {
            clearInterval(this.autoTimer);
            this.autoTimer = null;
            const autoBtn = this.container.querySelector('#all-at-once-auto');
            if (autoBtn) autoBtn.textContent = 'Auto Play';
        }
        if (this.svg) {
            const mem = this.svg.querySelector('#memory-line');
            if (mem) mem.textContent = `A=${this.state.A} B=${this.state.B} C=${this.state.C}`;
        }
        this.updateLedger();
        this.updateStatus('State reset. Click "Step" to move inputs through the network.');
    },

    updateStatus(text) {
        const status = this.container.querySelector('#all-at-once-status');
        if (status) status.textContent = text;
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('all-at-once-animation')) {
        allAtOnceAnimation.init('all-at-once-animation');
    }
});

window.allAtOnceAnimation = allAtOnceAnimation;
