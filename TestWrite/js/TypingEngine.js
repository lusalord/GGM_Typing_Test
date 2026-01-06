class TypingEngine {
    constructor() {
        this.lines = [];
        this.currentIndex = 0;
        this.maxCpm = 0;
        this.startTime = null;
        this.totalTypedChars = 0;

        this.inputArea = document.getElementById('input-area');
        
        // [중요] input 이벤트가 발생할 때마다 타수를 계산하고 화면을 갱신합니다.
        this.inputArea.addEventListener('input', () => this.handleInput());
        
        this.inputArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkLineComplete();
            }
        });

        window.typingEngine = this;
    }

    start(text) {
        this.lines = text.split('\n')
                         .map(line => line.replace('\r', '').trimEnd())
                         .filter(l => l.trim() !== ''); 
        
        this.currentIndex = 0;
        this.totalTypedChars = 0;
        this.maxCpm = 0;
        this.startTime = new Date(); // 시작 시간 기록

        this.inputArea.disabled = false;
        this.setupNextLine();
    }

    setupNextLine() {
        if (this.currentIndex >= this.lines.length) {
            this.finish();
            return;
        }

        const targetLine = this.lines[this.currentIndex];
        const indent = targetLine.match(/^\s*/)[0];
        this.inputArea.value = indent; 
        
        this.updateDisplay();
    }

    handleInput() {
        if (!this.startTime) return;

        const targetLine = this.lines[this.currentIndex];
        let inputValue = this.inputArea.value;

        // 들여쓰기 보호 로직
        const indent = targetLine.match(/^\s*/)[0];
        if (!inputValue.startsWith(indent)) {
            inputValue = indent + inputValue.trimStart();
            this.inputArea.value = inputValue;
        }

        // 1. 실시간 글자 색상 업데이트
        uiManager.renderCurrentLine(targetLine, inputValue);

        // 2. [핵심] 실시간 타수(CPM) 계산 로직
        const now = new Date();
        const elapsedMinutes = (now - this.startTime) / 1000 / 60; // 경과 시간(분)
        
        // 지금까지 완료한 줄의 총 글자수 + 현재 입력 중인 글자수
        const currentTotalChars = this.totalTypedChars + inputValue.length;
        
        // 타수 계산 (글자수 / 분)
        let cpm = 0;
        if (elapsedMinutes > 0) {
            cpm = Math.floor(currentTotalChars / elapsedMinutes);
        }

        // 최고 타수 갱신 (비정상적인 수치 방지)
        if (cpm > this.maxCpm && cpm < 2000) {
            this.maxCpm = cpm;
        }

        // 3. [실시간 반영] UIManager를 통해 화면의 숫자를 즉시 변경
        // 이 함수가 UIManager.js에 정확히 구현되어 있어야 숫자가 변합니다.
        uiManager.updateStats(cpm, this.maxCpm, this.currentIndex, this.lines.length);
    }

    checkLineComplete() {
        const targetLine = this.lines[this.currentIndex];
        const inputValue = this.inputArea.value;

        // 띄어쓰기 포함 완벽히 일치할 때만 엔터 허용
        if (inputValue === targetLine) {
            this.totalTypedChars += targetLine.length; // 타수 계산을 위해 누적
            this.currentIndex++;
            this.setupNextLine(); 
        }
    }

    updateDisplay() {
        const current = this.lines[this.currentIndex];
        const nexts = this.lines.slice(this.currentIndex + 1, this.currentIndex + 3);
        uiManager.renderCurrentLine(current, this.inputArea.value);
        uiManager.setNextLines(nexts);
    }

    finish() {
        this.inputArea.disabled = true;
        this.inputArea.value = '연습 완료!';
        alert(`🎉 연습 완료! 최고 타수: ${this.maxCpm}`);
    }
}
const typingEngine = new TypingEngine();