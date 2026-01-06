class DataLoader {
    constructor() {
        this.selectedType = new URLSearchParams(window.location.search).get('type') || 'csharp';
        this.init();
    }

    async init() {
        try {
            // 드롭다운 엘리먼트 가져오기
            this.dropdown = document.getElementById('file-dropdown');
            this.modeTitle = document.getElementById('mode-title');

            const response = await fetch('./data.json');
            const fullData = await response.json();
            const list = fullData[this.selectedType];

            this.modeTitle.innerText = this.selectedType.toUpperCase() + " 연습 모드";
            
            // 드롭다운 목록 생성
            list.forEach(item => {
                const option = document.createElement('option');
                option.value = item.fileName;
                option.innerText = item.displayName;
                this.dropdown.appendChild(option);
            });

            // 드롭다운 선택 시 파일 불러오기 이벤트 연결
            this.dropdown.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadTextFile(e.target.value);
                }
            });

        } catch (e) { console.error("데이터 로드 실패:", e); }
    }

    async loadTextFile(fileName) {
        const response = await fetch(`data/${fileName}`);
        const text = await response.text();
        
        // 타자 연습 시작 전 안내 메시지 업데이트
        document.getElementById('status-msg').innerText = `현재 연습 중: ${fileName}`;
        
        if (window.typingEngine) {
            window.typingEngine.start(text);
        }
    }
}
const dataLoader = new DataLoader();