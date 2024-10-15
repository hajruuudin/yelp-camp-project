const navbar = document.querySelector('#navbar')

if(window.location.pathname != '/campgrounds'){
    navbar.classList.remove('fixed-top')
    navbar.classList.add('sticky-top')
}

window.addEventListener('scroll', () => {
    if(window.scrollY < 600 && window.location.pathname == '/campgrounds'){
        navbar.classList.add('bg-transparent')
        navbar.classList.remove('bg-dark')
    } else {
        navbar.classList.remove('bg-transparent')
        navbar.classList.add('bg-dark')
    }
})

