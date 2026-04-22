/* --- 전역 변수 설정 --- */
let kakashiIntervals = []; 
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

// [BGM 설정] 1,2,3,4,5라운드 내내 재생 (아카츠키 난입 시만 정지)
const bgm = new Audio('assets/sounds/game_bgm.mp3');
bgm.loop = true; // 노래가 짧으면 처음부터 다시 재생
bgm.volume = 0.4;

let currentRound = 1;
let kakashiPattern = [];
let userPattern = [];
let isListening = false;
let idleTimer;

// 리소스 프리로드
const preload = (urls) => urls.forEach(url => { const img = new Image(); img.src = url; });
preload(['assets/characters/kakashi.png', 'assets/characters/kakashi_skills.png', 'assets/ui/perfect.png']);

/* --- 유틸리티 함수 --- */

// 타이핑 효과 함수
function typeWriter(element, text, speed = 100) {
    element.innerText = ""; 
    let i = 0;
    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                element.innerText += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve(); 
            }
        }
        type();
    });
}

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

function showPerfect() {
    const perfectImg = document.createElement('img');
    perfectImg.src = 'assets/ui/perfect.png';
    perfectImg.classList.add('perfect-ui'); 
    document.querySelector('.game').appendChild(perfectImg);
    setTimeout(() => perfectImg.remove(), 600);
}

/* --- 게임 핵심 로직 --- */

function startIdleTimer() {
    idleTimer = setTimeout(() => {
        // 10초간 입력 없을 시 소희 이벤트로 이동
        window.location.href = 'event_sohee.html'; 
    }, 10000);
}

async function playRound() {
    isListening = false;
    userPattern = [];
    kakashiPattern = [];
    kakashiIntervals = [];

    // 5라운드 진입 시 혹은 아카츠키 이후 다시 재생
    if (bgm.paused && currentRound <= 5) {
        bgm.play().catch(e => console.log("상호작용 필요"));
    }

    kakashiImg.src = 'assets/characters/kakashi_skills.png';
    kakashiImg.classList.add('skills-active'); 

    for (let i = 0; i < 2 + currentRound; i++) {
        const delay = Math.random() * 1200 + 300; 
        await new Promise(res => setTimeout(res, delay));
        showRandomHandSign();
        const now = Date.now();
        if (kakashiPattern.length > 0) {
            kakashiIntervals.push(now - kakashiPattern[kakashiPattern.length - 1]);
        }
        kakashiPattern.push(now);
    }

    setTimeout(() => {
        kakashiImg.src = 'assets/characters/kakashi.png';
        kakashiImg.classList.remove('skills-active'); 
        const gosound = new Audio('assets/Sounds/kakashi_go.mp3');
        gosound.play();
        isListening = true;
    }, 800);
}

// 스페이스바 입력 핸들러
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (idleTimer) clearTimeout(idleTimer); 

        // 첫 클릭 시 BGM 재생 시도 (브라우저 차단 우회용)
        if (bgm.paused && currentRound < 5) bgm.play();

        if (isListening) {
            showRandomHandSign(); 
            const now = Date.now();
            if (userPattern.length > 0) {
                const userInterval = now - userPattern[userPattern.length - 1];
                const targetInterval = kakashiIntervals[userPattern.length - 1];
                if (Math.abs(userInterval - targetInterval) < 400) showPerfect();
            } else {
                showPerfect();
            }
            userPattern.push(now);
            if (userPattern.length === kakashiPattern.length) checkSuccess();
        }
    }
});

async function checkSuccess() {
    isListening = false;

    if (currentRound === 4) {
        await triggerAkatsuki();
    } else if (currentRound === 5) {
        // [5라운드 성공] BGM 정지 및 라면집 엔딩 연출
        bgm.pause();
        const overlay = document.getElementById('ending-overlay');
        const gif = document.getElementById('skills-gif');

        gif.style.display = 'block'; 

        setTimeout(() => {
            const skillsSound = new Audio('assets/sounds/skills.mp3');
            skillsSound.play();
        }, 500);

        setTimeout(() => {
            overlay.classList.add('active'); 
        }, 2000);

        setTimeout(() => {
            window.location.href = 'ramen.html'; // 최종 라면집 이동
        }, 4500);

    } else {
        currentRound++;
        setTimeout(playRound, 1500);
    }
}

async function triggerAkatsuki() {
    isListening = false;
    bgm.pause(); // 아카츠키 난입 시 노래 끔

    const gameContainer = document.querySelector('.game');
    const overlay = document.getElementById('akatsuki-overlay');
    const video = document.getElementById('akatsuki-video');
    const textElement = document.getElementById('akatsuki-text');

    gameContainer.classList.add('shake');
    
    // [수정] 효과음 재생
    const boomSound = new Audio('assets/Sounds/akatsuki_boom.mp3');
    setTimeout(() => {
        balloon.style.display = 'block';
        boomSound.play();
    }, 500);

    await new Promise(res => setTimeout(res, 1500));
    gameContainer.classList.remove('shake');
    overlay.style.display = 'flex';

    await typeWriter(textElement, "이 기운은... 아카츠키인가?!", 200);

    await new Promise(res => setTimeout(res, 1000));
    textElement.innerText = ""; 
    video.style.display = 'block';
    video.play();

    video.onended = async () => {
        video.style.display = 'none';
        await typeWriter(textElement, "치잇, 조심해! 마지막 훈련을 마쳐야 한다!", 80);
        await new Promise(res => setTimeout(res, 2500)); 
        
        overlay.style.display = 'none';
        textElement.innerText = "";
        
        setTimeout(() => {
            currentRound = 5;
            playRound(); // 여기서 다시 BGM이 켜짐 (playRound 내부 로직)
        }, 1000);
    };
}

window.onload = () => {
    bgm.play().catch(() => console.log("클릭 대기 중"));
    startIdleTimer();
    setTimeout(playRound, 2000); 
};