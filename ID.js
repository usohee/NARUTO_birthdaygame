window.onload = function() {
    const overlay = document.getElementById('fade-overlay');
    const idCard = document.getElementById('id-card-img');
    const text = document.getElementById('talk-text');

    setTimeout(() => {
        overlay.style.opacity = "0";
        idCard.style.opacity = "1";
        text.style.opacity = "0";
    }, 500);

    setTimeout(() => {
        overlay.style.opacity = "1";
    }, 3500); 

    setTimeout(() => {
        idCard.style.display = "none";
    }, 4700);

    setTimeout(() => {
        overlay.style.opacity = "0";
        text.style.opacity = "1";
    }, 5500);

    setTimeout(() => {
        overlay.style.opacity = "1";
    }, 8500); // 5500 + 3000ms

    setTimeout(() => {
        window.location.href = './minigame.html';
    }, 7000);
};