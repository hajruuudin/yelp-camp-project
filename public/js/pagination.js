const loadBtn = document.querySelector('#load-more-button')
const list = document.querySelector('#campgrounds-list')
let result_message = document.querySelector('#result-message')

let array_position = 0;
const campgroundList = campgrounds.features;
const CAMPSITES_PER_CLICK = 10;

const load_campgrounds = (position) => {
    let newCamps = '';
    let counter = position
    for (let i = position; i < position + CAMPSITES_PER_CLICK && i < campgroundList.length; i++) {
        newCamps +=
        `
            <div class="card mb-3" data-bs-theme="dark">
                <div class="row">
                    <div class="col-md-4">
                        <img class="img-fluid" src="${campgroundList[i].images[0]}" alt="">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${campgroundList[i].title}</h5>
                            <p class="card-text">${campgroundList[i].description}</p>
                            <p class="card-text text-muted">
                            ${campgroundList[i].location}
                            </p>
                            <a class="btn btn-primary" href="/campgrounds/${campgroundList[i]._id}">View Campground</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        counter++
    }

    result_message.innerHTML = `Showing ${counter} out of ${campgroundList.length} results`

    list.innerHTML += newCamps
    return position + CAMPSITES_PER_CLICK
}

array_position = load_campgrounds(array_position)

loadBtn.addEventListener('click', () => {
    array_position = load_campgrounds(array_position)

    if(array_position >= campgroundList.length){
        loadBtn.classList.add('d-none')
        loadBtn.disabled = true
    }
})
