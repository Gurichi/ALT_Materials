const pikachu = document.getElementById('pikachu');
let isShocking = false;

function triggerThunderbolt() {
    if (isShocking) return;
    isShocking = true;
    
    pikachu.classList.add('shock');
    
    setTimeout(() => {
        pikachu.classList.remove('shock');
        isShocking = false;
    }, 500);
}

document.getElementById('gameStage').addEventListener('click', triggerThunderbolt);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        triggerThunderbolt();
    }
});
