const startButton = document.getElementById('start-btn');
const overlay = document.getElementById('fade-overlay');
const bgm = document.getElementById('main-bgm');
const soundBtn = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

bgm.volume = 0.2; // 볼륨 설정

soundBtn.addEventListener('click', () => {
    if (bgm.paused) {
        // 소리가 꺼져있다면 -> 켜기
        bgm.play();
        soundIcon.src = 'assets/ui/sound_on.png'; // 켜진 아이콘으로 변경
    } else {
        // 소리가 켜져있다면 -> 끄기
        bgm.pause();
        soundIcon.src = 'assets/ui/sound_off.png'; // 꺼진 아이콘으로 변경
    }
});

startButton.addEventListener('click', function() {
    // 1. '슉' 소리 재생
    const audio = new Audio('assets/shuk.mp3'); 
    audio.play();

    // 2. 검은색 막을 불투명하게 만듦 (페이드 아웃 시작)
    overlay.classList.add('visible');

    // 3. 페이드 애니메이션 시간(0.8초)이 끝난 뒤에 페이지 이동
    setTimeout(function() {
        window.location.href = 'ID_card.html'; 
    }, 800); // CSS의 transition 시간과 맞추면 좋아요!
});