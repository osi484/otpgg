class ZenTimer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.modes = {
            focus: { label: 'Focus', time: 25 * 60 },
            shortBreak: { label: 'Short Break', time: 5 * 60 },
            longBreak: { label: 'Long Break', time: 15 * 60 }
        };
        this.currentMode = 'focus';
        this.timeLeft = this.modes.focus.time;
        this.timerId = null;
        this.isRunning = false;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const totalTime = this.modes[this.currentMode].time;
        const progress = ((totalTime - this.timeLeft) / totalTime) * 100;
        const dashOffset = 880 - (880 * progress) / 100;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    text-align: center;
                }
                .timer-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
                .modes {
                    display: flex;
                    gap: 1rem;
                }
                .mode-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    transition: all 0.3s;
                }
                .mode-btn.active {
                    background: oklch(100% 0 0 / 0.1);
                    color: var(--accent-forest);
                }
                .display {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }
                circle {
                    fill: none;
                    stroke-width: 8;
                    stroke-linecap: round;
                }
                .bg-circle {
                    stroke: oklch(100% 0 0 / 0.05);
                }
                .progress-circle {
                    stroke: var(--accent-forest);
                    stroke-dasharray: 880;
                    stroke-dashoffset: ${dashOffset};
                    transition: stroke-dashoffset 1s linear, stroke 0.3s;
                }
                .time {
                    font-size: 4rem;
                    font-weight: 300;
                    letter-spacing: -0.05em;
                }
                .controls {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                .main-btn {
                    background: var(--accent-forest);
                    color: var(--bg-color);
                    border: none;
                    padding: 1rem 2.5rem;
                    border-radius: 30px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }
                .main-btn:active {
                    transform: scale(0.95);
                }
                .reset-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    opacity: 0.6;
                }
                .reset-btn:hover {
                    opacity: 1;
                }
            </style>
            <div class="timer-container">
                <div class="modes">
                    ${Object.entries(this.modes).map(([key, mode]) => `
                        <button class="mode-btn ${this.currentMode === key ? 'active' : ''}" data-mode="${key}">
                            ${mode.label}
                        </button>
                    `).join('')}
                </div>
                <div class="display">
                    <svg viewBox="0 0 300 300">
                        <circle class="bg-circle" cx="150" cy="150" r="140"></circle>
                        <circle class="progress-circle" cx="150" cy="150" r="140"></circle>
                    </svg>
                    <div class="time">${formattedTime}</div>
                </div>
                <div class="controls">
                    <button class="reset-btn" id="reset">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                    <button class="main-btn" id="start-stop">
                        ${this.isRunning ? 'Pause' : 'Start Focus'}
                    </button>
                    <div style="width: 24px"></div> <!-- Spacer for symmetry -->
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn => {
            btn.onclick = () => this.setMode(btn.dataset.mode);
        });

        this.shadowRoot.getElementById('start-stop').onclick = () => this.toggleTimer();
        this.shadowRoot.getElementById('reset').onclick = () => this.resetTimer();
    }

    setMode(mode) {
        this.stopTimer();
        this.currentMode = mode;
        this.timeLeft = this.modes[mode].time;
        this.dispatchEvent(new CustomEvent('modechange', { detail: { mode }, bubbles: true, composed: true }));
        this.render();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timerId = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimerEnd();
            }
            this.updateDisplay();
        }, 1000);
        this.render();
    }

    stopTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        this.render();
    }

    resetTimer() {
        this.stopTimer();
        this.timeLeft = this.modes[this.currentMode].time;
        this.render();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.shadowRoot.querySelector('.time').textContent = formattedTime;
        
        const totalTime = this.modes[this.currentMode].time;
        const progress = ((totalTime - this.timeLeft) / totalTime) * 100;
        const dashOffset = 880 - (880 * progress) / 100;
        this.shadowRoot.querySelector('.progress-circle').style.strokeDashoffset = dashOffset;
    }

    handleTimerEnd() {
        alert(`${this.modes[this.currentMode].label} session is over!`);
    }
}

customElements.define('zen-timer', ZenTimer);
