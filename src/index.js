const BASE_URL = 'http://localhost:3000/pups'


document.addEventListener('DOMContentLoaded', function() {
    displayDogs()
    goodDogs()
});

function displayDogs() {
    fetch(BASE_URL)
        .then( dogsData => dogsData.json())
        .then( dogsArray => showDogs(dogsArray))
};

function createDogsCard(dog) {
    const span = document.createElement("span");
    span.innerHTML = `${dog.name}`;
    span.id = dog.id;
    span.addEventListener('click', event => handleClicks(event));
    return span;
};

function addDogs(dog) {
    const dogsDiv = document.querySelector("#dog-bar");
    const div = createDogsCard(dog);
    dogsDiv.appendChild(div);
};

function showDogs(dogsArray) {
    dogsArray.map(dog => {
        addDogs(dog);
    });
};

function handleClicks(event) {
    event.preventDefault();
    getDogInfo(event);
};

function getDogInfo(event) { 
    fetch(`${BASE_URL}/${event.target.id}`)
        .then( dogData => dogData.json())
        .then( dogObj => createDogInfo(dogObj))
};

function createDogInfo(dogObj) {
    const div = document.querySelector("#dog-info")
    const img = document.createElement("img")
    img.src = dogObj.image
    const h2 = document.createElement("h2")
    h2.textContent = dogObj.name
    const button = document.createElement("button")
    getState(button, dogObj)
    button.id = dogObj.id
    button.addEventListener('click', event => changeState(button, event, dogObj));
    div.append(img, h2, button)
    return div
};

function getState (button, dogObj) {
    if (dogObj.isGoodDog === false) {
        button.textContent = "Bad Dog!"
    }
    else 
        button.textContent = "Good Dog!"
};

function changeState(button, event, dogObj) {
    let state = dogObj.isGoodDog
    if (state === false) {
        state = true
        button.textContent = "Good Dog!"
    }
    else {
        state = true
        button.textContent = "Bad Dog!"
    }
    updateDatabase(event.target.id, dogObj)
};

function updateDatabase(id, dogObj) {
    event.preventDefault()
    return fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'isGoodDog': !(dogObj.isGoodDog) 
        })
    }).then(dog => dog.json());
};

function clearDogsBar(){
    const dogsDiv = document.querySelector("#dog-bar");
    while (dogsDiv.firstChild) {
        dogsDiv.removeChild(dogsDiv.firstChild);
    }
};

function goodDogs(){
    goodDogsBar = document.querySelector("#good-dog-filter")
    goodDogsBar.addEventListener('click', e => {
        clearDogsBar()
        let status = e.target.textContent === "Filter good dogs: OFF" ? true : false
        e.target.textContent = status ? "Filter good dogs: ON" : "Filter good dogs: OFF"
        toggleGoodBadDogs(status)
    })
};

function toggleGoodBadDogs(status) {
    if (status === false) {
        fetch(BASE_URL)
            .then( dogsData => dogsData.json())
            .then( dogsArray => showDogs(dogsArray))
                showDogs(dogsArray)
    }
    else {
        fetch(BASE_URL)
            .then( dogsData => dogsData.json())
            .then( function (dogsArray) {
                const filteredDogs = dogsArray.filter(dog => dog.isGoodDog === status)
                showDogs(filteredDogs)})
    };
};