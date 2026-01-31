/**
 * Computer Flow Interaction
 * Input -> Decode -> Execute -> Memory -> Output -> Share
 */

const computerFlow = {
    state: { value: 10 },
    stepIndex: 0,
    currentCommand: null,
    steps: ['input', 'decode', 'execute', 'memory', 'output', 'share'],

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="computer-flow">
                <div class="computer-controls">
                    <label>
                        Input
                        <input id="cf-input" type="number" value="5" />
                    </label>
                    <label>
                        Function
                        <select id="cf-fn">
                            <option value="add">add (+)</option>
                            <option value="sub">subtract (-)</option>
                            <option value="mul">multiply (x)</option>
                        </select>
                    </label>
                    <button id="cf-step">Step</button>
                    <button id="cf-reset" class="secondary">Reset</button>
                </div>

                <div class="computer-graphic">
                    <div class="cf-node" id="cf-input-node">
                        <div class="cf-icon">⌨️</div>
                        <div class="cf-title">Input</div>
                        <div class="cf-value" id="cf-input-value">5</div>
                    </div>
                    <div class="cf-arrow">→</div>
                    <div class="pc-case">
                        <div class="pc-case-title">PC Case</div>
                        <div class="pc-flow">
                            <div class="cf-node" id="cf-decode-node">
                                <div class="cf-icon">🧾</div>
                                <div class="cf-title">Decode</div>
                                <div class="cf-sub" id="cf-instruction">ADD 5</div>
                            </div>
                            <div class="cf-arrow">→</div>
                            <div class="cf-node" id="cf-execute-node">
                                <div class="cf-icon">⚙️</div>
                                <div class="cf-title">Execute</div>
                                <div class="cf-sub" id="cf-exec">10 + 5</div>
                            </div>
                            <div class="cf-arrow">→</div>
                            <div class="cf-node" id="cf-memory-node">
                                <div class="cf-icon">🧠</div>
                                <div class="cf-title">Memory</div>
                                <div class="cf-value" id="cf-memory-value">10</div>
                            </div>
                            <div class="cf-arrow">→</div>
                            <div class="cf-node" id="cf-output-node">
                                <div class="cf-icon">🖥️</div>
                                <div class="cf-title">Screen Output</div>
                                <div class="cf-value" id="cf-output-value">10</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="computer-share">
                    <div class="cf-node" id="cf-reader-node">
                        <div class="cf-icon">🛰️</div>
                        <div class="cf-title">Another Computer</div>
                        <div class="cf-sub">reads memory</div>
                        <div class="cf-value" id="cf-reader-value">10</div>
                    </div>
                </div>
            </div>
        `;

        this.bind(container);
        this.render(container);
    },

    bind(container) {
        const inputEl = container.querySelector('#cf-input');
        const fnEl = container.querySelector('#cf-fn');
        const stepBtn = container.querySelector('#cf-step');
        const resetBtn = container.querySelector('#cf-reset');

        inputEl.addEventListener('input', () => this.updateInput(container));
        fnEl.addEventListener('change', () => this.updateInput(container));
        stepBtn.addEventListener('click', () => this.step(container));
        resetBtn.addEventListener('click', () => this.resetState(container));
    },

    updateInput(container) {
        const inputEl = container.querySelector('#cf-input');
        const valueEl = container.querySelector('#cf-input-value');
        valueEl.textContent = inputEl.value;
    },

    buildCommand(container) {
        const inputEl = container.querySelector('#cf-input');
        const fnEl = container.querySelector('#cf-fn');
        const inputVal = Number(inputEl.value || 0);
        const prev = this.state.value;
        let next = prev;
        let symbol = '+';
        let label = 'ADD';

        if (fnEl.value === 'add') { next = prev + inputVal; symbol = '+'; label = 'ADD'; }
        if (fnEl.value === 'sub') { next = prev - inputVal; symbol = '-'; label = 'SUB'; }
        if (fnEl.value === 'mul') { next = prev * inputVal; symbol = 'x'; label = 'MUL'; }

        return { inputVal, prev, next, symbol, label };
    },

    step(container) {
        if (!this.currentCommand) {
            this.currentCommand = this.buildCommand(container);
            this.stepIndex = 0;
        }

        const nodes = [
            container.querySelector('#cf-input-node'),
            container.querySelector('#cf-decode-node'),
            container.querySelector('#cf-execute-node'),
            container.querySelector('#cf-memory-node'),
            container.querySelector('#cf-output-node'),
            container.querySelector('#cf-reader-node')
        ];
        nodes.forEach((node) => node.classList.remove('active'));
        if (nodes[this.stepIndex]) nodes[this.stepIndex].classList.add('active');

        const instruction = container.querySelector('#cf-instruction');
        const exec = container.querySelector('#cf-exec');
        if (instruction) instruction.textContent = `${this.currentCommand.label} ${this.currentCommand.inputVal}`;
        if (exec) exec.textContent = `${this.currentCommand.prev} ${this.currentCommand.symbol} ${this.currentCommand.inputVal}`;

        if (this.steps[this.stepIndex] === 'memory') {
            this.state.value = this.currentCommand.next;
            this.render(container);
        }

        this.stepIndex += 1;
        if (this.stepIndex >= this.steps.length) {
            this.stepIndex = 0;
            this.currentCommand = null;
        }
    },

    render(container) {
        const memory = container.querySelector('#cf-memory-value');
        const output = container.querySelector('#cf-output-value');
        const reader = container.querySelector('#cf-reader-value');

        memory.textContent = this.state.value;
        output.textContent = this.state.value;
        reader.textContent = this.state.value;
    },

    resetState(container) {
        this.state = { value: 10 };
        this.stepIndex = 0;
        this.currentCommand = null;
        this.render(container);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('computer-flow')) {
        computerFlow.init('computer-flow');
    }
});

window.computerFlow = computerFlow;
