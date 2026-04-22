let kakashiIntervals = []; // 박자 간의 간격을 저장
let lastActionTime = 0;

const handSignAssets = [
    'assets/hands/Boar.png', 'assets/hands/Dog.png', 'assets/hands/Dragon.png',
    'assets/hands/Horse.png', 'assets/hands/Monkey.png', 'assets/hands/Rabbit.png',
    'assets/hands/Rooster.png', 'assets/hands/Sheep.png', 'assets/hands/Snake.png',
    'assets/hands/Tiger.png'
];

const displayContainer = document.getElementById('hand-sign-display');
const shukSound = document.getElementById('shuk-sound');
const kakashiImg = document.querySelector('.kakashi'); 

let currentRound = 1;
let kakashiPattern = []; 
let userPattern = [];    
let isListening = false; 
let idleTimer;           

// 1. 이미지 프리로드 (깜빡임 방지)
const preload = (urls) => urls.forEach(url => { const img = new Image(); img.src = url; });
preload(['assets/characters/kakashi.png', 'assets/characters/kakashi_skills.png', 'assets/ui/perfect.png']);

// 2. 무작위 인 출력 함수
function showRandomHandSign() {
    displayContainer.innerHTML = '';
    const randomIndex = Math.floor(Math.random() * handSignAssets.length);
    const signImg = document.createElement('img');
    signImg.src = handSignAssets[randomIndex];
    signImg.classList.add('hand-sign-image'); 
    displayContainer.appendChild(signImg);

    shukSound.currentTime = 0; 
    shukSound.play();

    setTimeout(() => {
        if (signImg.parentNode === displayContainer) {
            signImg.style.opacity = '0';
            setTimeout(() => displayContainer.innerHTML = '', 200);
        }
    }, 500); 
}

// [추가] Perfect 이미지 출력 함수
function showPerfect() {
    const perfectImg = document.createElement('img');
    perfectImg.src = 'assets/perfect.png';
    perfectImg.classList.add('perfect-ui'); // CSS에서 설정한 애니메이션 적용
    document.querySelector('.game').appendChild(perfectImg);
    setTimeout(() => perfectImg.remove(), 600);
}

// 3. 10초 대기 타이머 (분기 1)
function startIdleTimer() {
    idleTimer = setTimeout(() => {
        window.location.href = 'sohee_event.html'; 
    }, 10000);
}

// 4. 게임 시작 및 라운드 관리
async function playRound() {
    isListening = false;
    userPattern = [];
    kakashiPattern = [];
    kakashiIntervals = []; // 간격 기록 초기화

    // 카카시 시범 모드: 이미지 변경 및 크기 확대 클래스 추가
    kakashiImg.src = 'assets/characters/kakashi_skills.png';
    kakashiImg.classList.add('skills-active'); 

    for (let i = 0; i < 2 + currentRound; i++) {
        const delay = Math.random() * 1200 + 300; 
        await new Promise(res => setTimeout(res, delay));
        
        showRandomHandSign();
        const now = Date.now();

        // 박자 간격 저장 로직
        if (kakashiPattern.length > 0) {
            kakashiIntervals.push(now - kakashiPattern[kakashiPattern.length - 1]);
        }
        kakashiPattern.push(now);
    }

    // 유저 입력 모드 대기
    setTimeout(() => {
        kakashiImg.src = 'assets/characters/kakashi.png';
        kakashiImg.classList.remove('skills-active'); 
        const gosound = new Audio ('assets/Sounds/kakashi_go.mp3');
        gosound.play()
        isListening = true;
    }, 800);
}

// 5. 클릭 이벤트 처리 (유저 패턴 기록)
window.addEventListener('mousedown', () => {
    if (idleTimer) clearTimeout(idleTimer); 

    if (isListening) {
        showRandomHandSign(); 
        const now = Date.now();
        
        // [추가] 박자 판정 로직
        if (userPattern.length > 0) {
            const userInterval = now - userPattern[userPattern.length - 1];
            const targetInterval = kakashiIntervals[userPattern.length - 1];
            
            if (Math.abs(userInterval - targetInterval) < 400) {
                showPerfect();
            }
        } else {
            showPerfect();
        }

        userPattern.push(now);

        if (userPattern.length === kakashiPattern.length) {
            checkSuccess();
        }
    }
});

async function checkSuccess() {
    isListening = false;

    if (currentRound === 4) {
        await triggerAkatsuki();
    } else if (currentRound === 5) {
        const overlay = document.getElementById('ending-overlay');
        const gif = document.getElementById('skills-gif');

        // GIF 재생
        gif.style.display = 'block';
        console.log("시퀀스 시작: GIF 재생");

        // MP3 재생
        setTimeout(() => {
            const skillsSound = new Audio('assets/sounds/skills.mp3');
            skillsSound.play();
            console.log("시퀀스 2단계: MP3 재생 시작");
        }, 500);

        // 암전 시작
        setTimeout(() => {
            overlay.classList.add('active'); // CSS transition으로 서서히 검게 변함
            console.log("시퀀스 3단계: 암전 시작");
        }, 2000);

        setTimeout(() => {
            window.location.href = 'fire_ending.html';
        }, 4500);

    } else {
        currentRound++;
        setTimeout(playRound, 1500);
    }
}

async function triggerAkatsuki() {
    isListening = false;
    const overlay = document.getElementById('akatsuki-overlay');
    const video = document.getElementById('akatsuki-video');

    document.body.classList.add('shake');

    await new Promise(res => setTimeout(res, 1000));
    
    document.body.classList.remove('shake');
    overlay.style.display = 'flex'; 
    video.play();

    video.onended = () => {
        overlay.style.display = 'none';
        
        setTimeout(() => {
            currentRound = 5;
            playRound();
        }, 1000);
    };
}

window.onload = () => {
    startIdleTimer();
    setTimeout(playRound, 2000); 
};