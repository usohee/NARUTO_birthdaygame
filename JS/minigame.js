window.onload = function() {
    const overlay = document.getElementById('fade-overlay');
    const book = document.getElementById('book');
    const characters = document.querySelectorAll('.character');
    const page = document.getElementById('page');
    const portrait = document.getElementById('portrait');
    const text1 = document.getElementById('dialog-text');

    setTimeout(() => {
        overlay.classList.add('visible');
    }, 500);

    setTimeout(() => {
        book.classList.add('fade-in');
                characters.forEach(char => {
            char.classList.add('fade-in');
        });
    }, 1000);

    setTimeout(() => {
        page.style.opacity = "1";
        portrait.style.opacity = "1";
        text1.style.opacity = "1";
    }, 3000);

    page.addEventListener('click', function() {
        // 나갈 때도 멋있게 페이드 아웃!
        overlay.classList.remove('visible'); // 다시 검게 만들기
        
        setTimeout(() => {
            window.location.href = 'game.html';
        }); // 이동
    });

};