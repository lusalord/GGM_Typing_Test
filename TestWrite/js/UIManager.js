class UIManager {
    constructor() {
        this.currentCpm = document.getElementById('current-cpm');
        this.maxCpm = document.getElementById('max-cpm');
        this.progressText = document.getElementById('progress-text');
        this.progressBar = document.getElementById('progress-bar');
        this.inputArea = document.getElementById('input-area');
        this.lineCurrent = document.getElementById('line-current');
        this.lineNext = document.getElementById('line-next-container');
    }

    // 현재 쳐야 할 문장을 화면에 표시 (오타 시각화 기능 포함)
    renderCurrentLine(targetText, inputText) {
        let html = '';
        for (let i = 0; i < targetText.length; i++) {
            if (i < inputText.length) {
                // 입력한 부분: 맞으면 파란색, 틀리면 빨간색
                const color = targetText[i] === inputText[i] ? '#4da3ff' : '#ff4d4d';
                html += `<span style="color: ${color}">${targetText[i]}</span>`;
            } else {
                // 아직 입력 안 한 부분
                html += `<span>${targetText[i]}</span>`;
            }
        }
        this.lineCurrent.innerHTML = html;
    }

    updateStats(cpm, maxCpm, current, total) {
        this.currentCpm.innerText = cpm;
        this.maxCpm.innerText = maxCpm;
        this.progressText.innerText = `${current}/${total}`;
        const percent = total > 0 ? (current / total) * 100 : 0;
        this.progressBar.style.width = `${percent}%`;
    }

    setNextLines(lines) {
        this.lineNext.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
    }
}
const uiManager = new UIManager();