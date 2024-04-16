const card = document.querySelector(".card");

card.addEventListener('mousemove', (e) => {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = card.offsetLeft + cardWidth / 2;
    const centerY = card.offsetTop + cardHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = -1 * (mouseY / (cardHeight / 2)) * 10;
    const rotateY = (mouseX / (cardWidth / 2)) * 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
});

card.addEventListener('mouseleave', (e) => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
})

const generateSpell = document.querySelector('.generate');

generateSpell.addEventListener('click', () => {
    window.location.reload()
})
