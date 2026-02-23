import './components/ZenTimer.js';
import './components/AmbientMixer.js';
import './components/TodoList.js';

document.addEventListener('DOMContentLoaded', () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // 전체 화면 전환 로직
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // 앱의 상태 변화에 따른 배경색 변화 등 전역 효과 처리
    const timer = document.getElementById('main-timer');
    timer.addEventListener('modechange', (e) => {
        const mode = e.detail.mode;
        if (mode === 'focus') {
            document.documentElement.style.setProperty('--accent-forest', 'oklch(80% 0.12 30)');
            document.documentElement.style.setProperty('--bg-color', 'oklch(25% 0.04 30)');
        } else {
            document.documentElement.style.setProperty('--accent-forest', 'oklch(75% 0.1 150)');
            document.documentElement.style.setProperty('--bg-color', 'oklch(25% 0.02 240)');
        }
    });
});
