const body = document.querySelector("#body")
const footer = document.querySelector('#footer')


window.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname =='/register'){
        body.classList.add('registerBg')
        footer.classList.add('bg-transparent')
    } else if (window.location.pathname == '/login'){
        body.classList.add('loginBg')
        footer.classList.add('bg-transparent')
    } else {
        console.log('')
    }
})

document.addEventListener('mousemove', function(e) {
    const moveX = (e.clientX / window.innerWidth) * 20 - 5; // -5 to 5 range
    const moveY = (e.clientY / window.innerHeight) * 20 - 5; // -5 to 5 range

    document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
});