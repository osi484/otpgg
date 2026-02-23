class AmbientMixer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // 신뢰할 수 있는 고품질 정적 MP3 경로로 교체
        this.sounds = [
            { id: 'rain', label: 'Soft Rain', url: 'https://raw.githubusercontent.com/osi484/otpgg/main/assets/rain.mp3' }, // 가상의 경로이나 실제 작동하는 URL로 대체 권장
            { id: 'wind', label: 'Soft Wind', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // 테스트용 (작동 확인용)
            { id: 'white', label: 'White Noise', url: 'https://actions.google.com/sounds/v1/foley/white_noise.mp3' },
            { id: 'waves', label: 'Deep Ocean', url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_shore.mp3' }
        ];
        // 안정성을 위해 더 대중적인 테스트용 오픈 소스 자연음 URL들로 재설정
        this.sounds = [
            { id: 'rain', label: 'Soft Rain', url: 'https://www.soundjay.com/nature/rain-01.mp3' },
            { id: 'wind', label: 'Soft Wind', url: 'https://www.soundjay.com/nature/wind-01.mp3' },
            { id: 'white', label: 'White Noise', url: 'https://www.soundjay.com/misc/sounds/white-noise-01.mp3' },
            { id: 'waves', label: 'Deep Ocean', url: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' }
        ];
        this.audioElements = {};
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .mixer-grid { display: grid; grid-template-columns: 1fr; gap: 1.2rem; }
                .sound-control {
                    display: flex; align-items: center; gap: 1.5rem;
                    background: oklch(100% 0 0 / 0.02); padding: 1rem 1.5rem;
                    border-radius: 20px; border: 1px solid oklch(100% 0 0 / 0.05);
                    transition: all 0.5s ease;
                }
                .label { flex: 1; font-size: 0.85rem; font-weight: 300; letter-spacing: 0.05em; color: var(--text-secondary); }
                input[type="range"] { width: 100px; accent-color: var(--accent-forest); cursor: pointer; opacity: 0.3; transition: opacity 0.3s; }
                input[type="range"]:hover { opacity: 0.8; }
                .play-pause {
                    background: none; border: none; color: var(--text-primary); cursor: pointer;
                    opacity: 0.3; transition: all 0.3s; display: flex; align-items: center;
                }
                .play-pause.active { opacity: 1; color: var(--accent-forest); }
                .play-pause svg { pointer-events: none; }
            </style>
            <div class="mixer-grid">
                ${this.sounds.map(sound => `
                    <div class="sound-control">
                        <div class="label">${sound.label}</div>
                        <input type="range" min="0" max="1" step="0.01" value="0.5" class="volume-slider" data-id="${sound.id}">
                        <button class="play-pause" data-id="${sound.id}">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        this.setupEventListeners();
    }

    // 오디오 객체를 클릭 시점에 생성하여 브라우저 정책 회피 및 로딩 에러 방지
    getOrCreateAudio(id) {
        if (!this.audioElements[id]) {
            const sound = this.sounds.find(s => s.id === id);
            const audio = new Audio(sound.url);
            audio.loop = true;
            audio.volume = this.shadowRoot.querySelector(`.volume-slider[data-id="${id}"]`).value;
            this.audioElements[id] = audio;
        }
        return this.audioElements[id];
    }

    setupEventListeners() {
        this.shadowRoot.querySelectorAll('.play-pause').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.toggleSound(id, btn);
            });
        });

        this.shadowRoot.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const id = slider.dataset.id;
                if (this.audioElements[id]) {
                    this.audioElements[id].volume = e.target.value;
                }
            });
        });
    }

    toggleSound(id, btn) {
        const audio = this.getOrCreateAudio(id);

        if (audio.paused) {
            // 재생 시도 및 UI 즉시 반영
            audio.play().then(() => {
                btn.classList.add('active');
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            }).catch(err => {
                console.error("Audio playback failed:", err);
                alert("브라우저 정책에 의해 차단되었습니다. 페이지를 한 번 클릭한 후 다시 시도해 주세요.");
            });
        } else {
            audio.pause();
            btn.classList.remove('active');
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        }
    }
}
customElements.define('ambient-mixer', AmbientMixer);
