let fullCodeLines = [];
let currentLineIndex = 0;
let startTime = null;
let maxCPM = 0;
let totalTypedChars = 0;
let timerInterval = null;
let isLineComplete = false; // 현재 줄 입력 완료 여부

const lineCurrent = document.getElementById('line-current');
const lineNextContainer = document.getElementById('line-next-container');
const inputArea = document.getElementById('input-area');
const statusMsg = document.getElementById('status-msg');
const startBtn = document.getElementById('start-btn');

window.onload = async () => {
    try {
        const response = await fetch('./data/file_list.json');
        window.allFiles = await response.json();
        statusMsg.innerText = "✅ 준비 완료! 엔터를 눌러 줄을 넘기세요.";
    } catch (e) {
        statusMsg.innerText = "❌ 데이터 로드 실패";
    }
};

async function startPractice() {
    const diff = document.getElementById('difficulty-select').value;
    const files = window.allFiles.filter(f => f.difficulty === diff);
    if (files.length === 0) return alert("파일이 없습니다.");

    const selectedFile = files[Math.floor(Math.random() * files.length)];
    const res = await fetch(`./data/codes/${selectedFile.name}`);
    const text = await res.text();

    fullCodeLines = text.split('\n').map(l => l.trimEnd()).filter(l => l.trim().length > 0);
    
    currentLineIndex = 0;
    totalTypedChars = 0;
    maxCPM = 0;
    startTime = null;
    isLineComplete = false;
    clearInterval(timerInterval);
    
    inputArea.disabled = false;
    renderLines();
}

function renderLines() {
    if (currentLineIndex >= fullCodeLines.length) {
        finishPractice();
        return;
    }

    const targetText = fullCodeLines[currentLineIndex];
    isLineComplete = false;
    
    lineCurrent.innerHTML = "";
    targetText.split("").forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.classList.add('char-normal');
        lineCurrent.appendChild(span);
    });

    let nextPreview = "";
    for (let i = currentLineIndex + 1; i < Math.min(currentLineIndex + 6, fullCodeLines.length); i++) {
        nextPreview += fullCodeLines[i] + "\n";
    }
    lineNextContainer.innerText = nextPreview;

    const indentation = targetText.match(/^\s*/)[0];
    inputArea.value = indentation;
    updateCharColors(indentation);

    inputArea.focus();
    updateUI();
}

// 실시간 글자 색상 체크
inputArea.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
        startTimer();
    }

    const targetText = fullCodeLines[currentLineIndex];
    const userValue = inputArea.value;

    updateCharColors(userValue);

    // 줄이 완벽하게 입력되었는지 확인 (하지만 자동으로 넘기지는 않음)
    if (userValue === targetText) {
        isLineComplete = true;
        inputArea.style.borderColor = "#4ec9b0"; // 완료 시 테두리 민트색
    } else {
        isLineComplete = false;
        inputArea.style.borderColor = targetText.startsWith(userValue) ? "#007acc" : "#f44747";
    }
});

// 엔터 키 이벤트 감지
inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (isLineComplete) {
            // 모든 글자가 맞았을 때만 다음 줄로
            totalTypedChars += fullCodeLines[currentLineIndex].length;
            currentLineIndex++;
            renderLines();
        } else {
            // 틀렸거나 미완성일 때 엔터를 치면 시각적 경고 (흔들림 등 추가 가능)
            inputArea.style.borderColor = "#f44747";
        }
    }
});

function updateCharColors(userValue) {
    const targetText = fullCodeLines[currentLineIndex];
    const charSpans = lineCurrent.querySelectorAll('span');

    charSpans.forEach((span, index) => {
        const userChar = userValue[index];
        if (userChar == null) {
            span.className = 'char-normal';
        } else if (userChar === targetText[index]) {
            span.className = 'char-correct';
        } else {
            span.className = 'char-incorrect';
        }
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const elapsedSec = (now - startTime) / 1000;
        if (elapsedSec < 1) return;
        const currentCPM = Math.floor((totalTypedChars + inputArea.value.length) / elapsedSec * 60);
        document.getElementById('current-cpm').innerText = currentCPM;
        if (currentCPM > maxCPM) {
            maxCPM = currentCPM;
            document.getElementById('max-cpm').innerText = maxCPM;
        }
    }, 100);
}

function updateUI() {
    const total = fullCodeLines.length;
    const current = currentLineIndex;
    const percent = (current / total) * 100;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('progress-text').innerText = `${current}/${total}`;
}

function finishPractice() {
    clearInterval(timerInterval);
    const avgCPM = document.getElementById('current-cpm').innerText;
    alert(`🎉 연습 완료!\n평균 타수: ${avgCPM} CPM\n최고 타수: ${maxCPM} CPM`);
    inputArea.disabled = true;
    lineCurrent.innerText = "모든 코드를 입력했습니다.";
    lineNextContainer.innerText = "";
}

startBtn.addEventListener('click', startPractice);