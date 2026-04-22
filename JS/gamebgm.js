// BGM 객체 생성
const bgm = new Audio('assets/sounds/game_bgm.mp3');
bgm.loop = true; // 반복 재생

// 페이지 이동 시 현재 재생 시간을 저장하는 함수
function saveBgmTime() {
    localStorage.setItem('bgm_time', bgm.currentTime);
}

// 페이지 로드 시 저장된 시간부터 재생하는 함수
function playBgmFromLastTime() {
    const savedTime = localStorage.getItem('bgm_time');
    if (savedTime) {
        bgm.currentTime = parseFloat(savedTime);
    }
    
    // 브라우저 정책상 사용자 상호작용(클릭 등) 후에 오디오 재생이 가능할 수 있습니다.
    bgm.play().catch(e => console.log("자동 재생 대기 중..."));
}

// minigame.html에서 게임 시작 버튼을 누를 때 saveBgmTime()을 호출하고 이동하세요.
// 예: window.location.href = 'game.html'; 호출 직전에 saveBgmTime();