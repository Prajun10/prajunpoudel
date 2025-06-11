document.addEventListener("DOMContentLoaded", () => {
    const typewriter = document.querySelector(".typewriter");

    const words = ["Graphics Designer", "Professional Writer","Post Designer", "UI/UX Artist"];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const displayedText = currentWord.substring(0, charIndex);
        typewriter.textContent = displayedText;

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 1000);
        }
    }

    type();
});

/* banpauroti menu i guess */
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('main-menu');


if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}