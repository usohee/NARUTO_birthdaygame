let kakashiIntervals = []; // 카카시가 인을 맺는 시간 간격(ms)을 저장하는 배열
let lastActionTime = 0;    // 마지막 동작이 일어난 시간을 기록

// 무작위로 나타날 '인' 모양 이미지 경로 배열
const handSignAssets = [
    'assets/hands/Boar.png', 'assets/hands/Dog.png', 'assets/hands/Dragon.png',
    'assets/hands/Horse.png', 'assets/hands/Monkey.png', 'assets/hands/Rabbit.png',
    'assets/hands/Rooster.png', 'assets/hands/Sheep.png', 'assets/hands/Snake.png',
    'assets/hands/Tiger.png'
];

// 주요 DOM 요소 선택
const displayContainer = document.getElementById('hand-sign-display'); // 인 이미지가 나타날 컨테이너
const shukSound = document.getElementById('shuk-sound');             // 인을 맺을 때 날 효과음
const kakashiImg = document.querySelector('.kakashi');               // 카카시 캐릭터 이미지

let currentRound = 1;      // 현재 라운드 번호
let kakashiPattern = [];   // 카카시가 인을 맺은 시점(Timestamp)들을 기록
let userPattern = [];      // 유저가 클릭한 시점(Timestamp)들을 기록
let isListening = false;   // 유저의 클릭 입력을 받을지 결정하는 플래그
let idleTimer;             // 10초 무반응 체크를 위한 타이머 변수

/**
 * 1. 리소스 프리로드
 * 화면 전환 시 이미지 로딩으로 인한 끊김(깜빡임)을 방지하기 위해 브라우저 메모리에 미리 로드합니다.
 */
const preload = (urls) => urls.forEach(url => { const img = new Image(); img.src = url; });
preload([
    'assets/characters/kakashi.png', 
    'assets/characters/kakashi_skills.png', 
    'assets/ui/perfect.png'
]);

/**
 * 2. 무작위 인 출력 함수
 * 카카시나 유저가 인을 맺을 때 화면 중앙에 무작위 '인' 이미지를 띄우고 소리를 재생합니다.
 */
function showRandomHandSign() {
    displayContainer.innerHTML = ''; // 기존 이미지 제거
    const randomIndex = Math.floor(Math.random() * handSignAssets.length);
    const signImg = document.createElement('img');
    signImg.src = handSignAssets[randomIndex];
    signImg.classList.add('hand-sign-image'); // CSS 애니메이션 적용
    displayContainer.appendChild(signImg);

    // 효과음 재생 (연속 클릭 시에도 처음부터 재생되도록 초기화 후 재생)
    shukSound.currentTime = 0; 
    shukSound.play();

    // 0.5초 후 이미지를 서서히 숨기고 0.7초 후 완전히 제거
    setTimeout(() => {
        if (signImg.parentNode === displayContainer) {
            signImg.style.opacity = '0';
            setTimeout(() => displayContainer.innerHTML = '', 200);
        }
    }, 500); 
}

/**
 * [Perfect! 이미지 출력 함수]
 * 유저가 박자를 정확히 맞췄을 때 화면에 피드백 이미지를 띄웁니다.
 */
function showPerfect() {
    const perfectImg = document.createElement('img');
    perfectImg.src = 'assets/ui/perfect.png';
    perfectImg.classList.add('perfect-ui'); 
    document.querySelector('.game').appendChild(perfectImg);
    
    // 0.6초 후 DOM에서 제거 (CSS 애니메이션 시간에 맞춤)
    setTimeout(() => perfectImg.remove(), 600);
}

/**
 * 3. 이스터 에그: 10초 대기 타이머
 * 게임 시작 후 아무 조작이 없으면 남자친구(유저)를 위한 깜짝 이벤트 페이지로 이동합니다.
 */
function startIdleTimer() {
    idleTimer = setTimeout(() => {
        window.location.href = 'sohee_event.html'; 
    }, 10000);
}

/**
 * 4. 라운드 진행 로직 (카카시 시범)
 * 카카시가 랜덤한 박자로 인을 맺는 시범을 보여줍니다.
 */
async function playRound() {
    isListening = false; // 시범 중에는 유저 입력 차단
    userPattern = [];    // 이전 라운드 기록 초기화
    kakashiPattern = [];
    kakashiIntervals = [];

    // 카카시 시범 모드 전환: 이미지 변경 및 크기 확대(CSS 클래스)
    kakashiImg.src = 'assets/characters/kakashi_skills.png';
    kakashiImg.classList.add('skills-active'); 

    // 라운드 수에 따라 인을 맺는 횟수 결정
    for (let i = 0; i < 2 + currentRound; i++) {
        // 박자 랜덤화: 0.3초 ~ 1.5초 사이의 랜덤한 간격 생성
        const delay = Math.random() * 1200 + 300; 
        await new Promise(res => setTimeout(res, delay));
        
        showRandomHandSign();
        const now = Date.now();

        // 박자 간격 저장: 현재 시점과 이전 시점의 차이를 저장하여 유저와 비교함
        if (kakashiPattern.length > 0) {
            kakashiIntervals.push(now - kakashiPattern[kakashiPattern.length - 1]);
        }
        kakashiPattern.push(now);
    }

    // 시범 종료 후 유저 턴으로 전환
    setTimeout(() => {
        kakashiImg.src = 'assets/characters/kakashi.png'; // 원래 이미지로 복구
        kakashiImg.classList.remove('skills-active'); 
        
        // "가라!" 소리와 함께 유저 입력 시작
        const gosound = new Audio('assets/Sounds/kakashi_go.mp3');
        gosound.play();
        isListening = true;
    }, 800);
}

/**
 * 5. 유저 클릭 이벤트 핸들러
 * 유저가 스페이스바를 누를 때마다 박자를 기록하고 판정합니다.
 */
window.addEventListener('keydown', (event) => {
    // 누른 키가 'Space'일 때만 작동 (event.code 사용)
    if (event.code === 'Space') {
        // 기본 스페이스바 동작(페이지 스크롤 등) 방지
        event.preventDefault();

        if (idleTimer) clearTimeout(idleTimer); 

        if (isListening) {
            showRandomHandSign(); 
            const now = Date.now();
            
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
    }
});

/**
 * 6. 결과 확인 및 라운드 이동
 * 라운드 성공 여부에 따라 다음 라운드, 아카츠키 이벤트, 또는 최종 엔딩을 결정합니다.
 */
async function checkSuccess() {
    isListening = false; // 판정 중 입력 방지

    if (currentRound === 4) {
        // 4라운드 성공 시 아카츠키 침입 이벤트 발생
        await triggerAkatsuki();
    } else if (currentRound === 5) {
        /**
         * [최종 5라운드 성공: 화둔 엔딩 연출]
         * GIF 재생 -> MP3 중간 재생 -> 서서히 암전 -> 페이지 이동 순서
         */
        const overlay = document.getElementById('ending-overlay');
        const gif = document.getElementById('skills-gif');

        gif.style.display = 'block'; // 화둔 GIF 노출

        // 0.5초 후 화둔 효과음 재생
        setTimeout(() => {
            const skillsSound = new Audio('assets/sounds/skills.mp3');
            skillsSound.play();
        }, 500);

        // 2초 후 화면 암전 시작 (CSS Transition 활용)
        setTimeout(() => {
            overlay.classList.add('active'); 
        }, 2000);

        // 연출 종료 후 최종 엔딩 페이지로 이동
        setTimeout(() => {
            window.location.href = 'fire_ending.html';
        }, 4500);

    } else {
        // 일반 라운드 성공 시 다음 라운드로 진행
        currentRound++;
        setTimeout(playRound, 1500);
    }
}

/**
 * 7. 아카츠키 침입 이벤트
 */
async function triggerAkatsuki() {
    isListening = false;
    const overlay = document.getElementById('akatsuki-overlay');
    const video = document.getElementById('akatsuki-video');
    const textElement = document.getElementById('akatsuki-text');
    const balloon = document.getElementById('surprise-balloon');

    // 1. 화면 흔들림 시작
    document.body.classList.add('shake');
    
    // 2. 카카시 머리 위 surprise_balloon.png 등장
    setTimeout(() => {
        balloon.style.display = 'block';
    }, 500);

    // 3. 암전 + 첫 번째 대사
    await new Promise(res => setTimeout(res, 1500));
    document.body.classList.remove('shake');
    balloon.style.display = 'none';
    
    // 오버레이를 먼저 띄우고 텍스트를 넣습니다.
    overlay.style.display = 'flex';
    textElement.innerText = "이 기운은... 아카츠키인가?!"; 
    console.log("대사 출력됨: " + textElement.innerText); // 콘솔창에서 확인용

    // 4. 대사 2초 유지 후 영상 재생
    await new Promise(res => setTimeout(res, 2000));
    textElement.innerText = ""; // 영상 재생 전 대사 지우기
    video.style.display = 'block';
    video.play();

    // 5. 영상 종료 후 로직
    video.onended = async () => {
        video.style.display = 'none';
        
        // 6. 암전 상태 유지하며 두 번째 대사 출력
        textElement.innerText = "치잇, 조심해! 마지막 훈련을 마쳐야 한다!";
        console.log("두 번째 대사 출력됨: " + textElement.innerText);
        
        await new Promise(res => setTimeout(res, 2500)); 
        
        // 7. 다시 원래 화면으로 복귀
        overlay.style.display = 'none';
        textElement.innerText = "";
        
        setTimeout(() => {
            currentRound = 5;
            playRound();
        }, 1000);
    };
}

/**
 * [게임 초기화]
 * 페이지 로드 시 10초 대기 타이머를 작동시키고, 2초 뒤 첫 라운드를 시작합니다.
 */
window.onload = () => {
    startIdleTimer();
    setTimeout(playRound, 2000); 
};