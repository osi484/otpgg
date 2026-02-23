class AmbientMixer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.sounds = [
            { id: 'rain', label: 'Rain', icon: '🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
            { id: 'forest', label: 'Forest', icon: '🌲', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }, // Placeholder
            { id: 'waves', label: 'Waves', icon: '🌊', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }, // Placeholder
            { id: 'fire', label: 'Fire', icon: '🔥', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' } // Placeholder
        ];
        this.audioElements = {};
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .mixer-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                .sound-control {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: oklch(100% 0 0 / 0.03);
                    padding: 0.8rem 1.2rem;
                    border-radius: 16px;
                    transition: background 0.3s;
                }
                .sound-control:hover {
                    background: oklch(100% 0 0 / 0.06);
                }
                .icon {
                    font-size: 1.5rem;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: oklch(100% 0 0 / 0.05);
                    border-radius: 12px;
                }
                .label {
                    flex: 1;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                input[type="range"] {
                    width: 120px;
                    accent-color: var(--accent-forest);
                    cursor: pointer;
                }
                .play-pause {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                }
                .play-pause.active {
                    opacity: 1;
                    color: var(--accent-forest);
                }
            </style>
            <div class="mixer-grid">
                ${this.sounds.map(sound => `
                    <div class="sound-control">
                        <div class="icon">${sound.icon}</div>
                        <div class="label">${sound.label}</div>
                        <input type="range" min="0" max="1" step="0.01" value="0.5" class="volume-slider" data-id="${sound.id}">
                        <button class="play-pause" data-id="${sound.id}">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        this.setupAudio();
        this.setupEventListeners();
    }

    setupAudio() {
        this.sounds.forEach(sound => {
            try {
                const audio = new Audio(sound.url);
                audio.loop = true;
                audio.onerror = () => {
                    console.warn(`사운드 파일을 불러올 수 없습니다: ${sound.label}`);
                };
                this.audioElements[sound.id] = audio;
            } catch (e) {
                console.error(`오디오 초기화 에러: ${e.message}`);
            }
        });
    }

    setupEventListeners() {
        this.shadowRoot.querySelectorAll('.play-pause').forEach(btn => {
            btn.onclick = () => this.toggleSound(btn.dataset.id, btn);
        });

        this.shadowRoot.querySelectorAll('.volume-slider').forEach(slider => {
            slider.oninput = (e) => {
                const id = slider.dataset.id;
                if (this.audioElements[id]) {
                    this.audioElements[id].volume = e.target.value;
                }
            };
        });
    }

    toggleSound(id, btn) {
        const audio = this.audioElements[id];
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                btn.classList.add('active');
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }).catch(e => {
                console.warn("재생이 차단되었습니다. 페이지를 클릭한 후 다시 시도하세요.");
            });
        } else {
            audio.pause();
            btn.classList.remove('active');
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        }
    }
}

customElements.define('ambient-mixer', AmbientMixer);
