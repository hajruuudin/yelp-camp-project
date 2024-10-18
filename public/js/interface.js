const scrlButton = document.querySelector('#scroll-button');

scrlButton.addEventListener('click', () => {
    window.scrollTo({
        top: 600, 
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if(window.scrollY > 100){
        scrlButton.classList.add('d-none')
    } else {
        scrlButton.classList.remove('d-none')
    }
})