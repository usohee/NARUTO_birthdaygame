# 🥷 나루토 생일 축하 미니게임 (Naruto Birthday Game)

남자친구의 생일을 축하하기 위해 제작한 **나루토 컨셉의 웹 미니게임**입니다. 
Vanilla JS를 활용하여 영화 같은 화면 전환과 픽셀 아트 감성을 구현했습니다.

## 📺 Figma 계획
> <img width="614" height="449" alt="all_navigation" src="https://github.com/user-attachments/assets/e8553961-a55a-4e12-98b1-3a705e381419" />


## 🛠 사용 기술 (Tech Stack)
- **Language:** HTML5, CSS3, Vanilla JavaScript
- **Font:** Mulmaru (웹 폰트 적용)
- **Design:** Figma, Pixel Art Assets
- **Audio/Visual:** Web Speech API (TTS), HTML5 Video/Audio

## 🎮 주요 기능 (Features)
### 1. 스토리 및 시네마틱 연출
- **Ninja ID Card:** 시작 버튼 클릭 시 닌자 등록증이 발급되는 애니메이션과 함께 주인공 독백이 Fade-in/out으로 연출
- **Cinematic Event:** 게임 4라운드 종료 후 아카츠키의 침입을 알리는 화면 흔들림, 암전 효과 및 긴박한 영상('mp4') 컷신 자동 재생
- **Visual Effects:** 화둔 술법 성공 시 화면 전체를 덮는 화염 이펙트 애니메이션과 파티클 효과 구현

### 2. 화둔 훈련 리듬 게임
- **Pattern Mimicry:** 카카시 선생님이 보여주는 랜덤 박자의 인(Hand Signs)을 기억해 똑같이 마우스로 클릭하는 방식
- **Interactive Feedback:** 인을 맺을 때마다 '슉-' 소리와 함께 픽셀 핸드 아이콘이 활성화되어 시청각적 피드백 제공
- **Akatsuki Intrusion (Phase 2):** 4라운드 종료 직후, 화면 흔들림 및 암전 효과와 함께 아카츠키 등장 영상('akatsuki.mp4') 재생
- **Progressive Difficulty:** 총 5라운드 구성, 라운드가 올라갈수록 난이도 상승

### 3. 사용자 행동 기반 멀티 엔딩 (Dual-Ending)
- **Ending A (Surprise):** 게임 시작 후 10초간 아무 조작이 없을 경우, **소희 캐릭터**가 등장하며 일락라면집에서 나루토 일행의 TTS 축하 음성 출력
- **Ending B (Perfect Clear):** 5라운드 완수 시, **Kuma 캐릭터가 소희로 변신**하는 연출과 함께 나루토 친구들의 생일 축하 메시지

## 📂 프로젝트 구조
```text
NARUTO_BIRTHDAY_GAME
├── 📂 assets                 # 모든 리소스 보관
│   ├── 📂 fonts              # 폰트 파일 (Mulmaru)
│   └── 📂 images             # 이미지 리소스
│       ├── 📂 background     # 배경 이미지 (Ramen, Intro, ID Card)
│       ├── 📂 characters     # 캐릭터 소스 (Kakashi, Injae)
│       └── 📂 ui             # UI 요소 (Book, Page, Logo, Buttons)
├── 📂 css                    # 스타일시트 (.css)
│   ├── ID.css
│   ├── main.css
│   └── minigame.css
├── 📂 js                     # 자바스크립트 (.js)
│   ├── ID.js
│   ├── main.js
│   └── minigame.js
├── 📂 docs                   # 기획 및 네비게이션 가이드 이미지
├── 📄 index.html             # 메인 인트로 화면
├── 📄 ID_card.html           # 닌자 등록증 및 독백 화면
├── 📄 minigame.html          # 미니게임 대화창 화면
├── 📄 game.html              # 본격 화둔 훈련 게임 화면
└── 📝 README.md              # 프로젝트 설명서
