const NAVBAR = document.querySelector("#dog-bar")
const DOGINFO = document.querySelector("#dog-info")
const DOGFILTER = document.querySelector("#good-dog-filter")
const DATAURL = "http://localhost:3000/pups"

function init(){
fetch (DATAURL)
    .then(response => response.json())
    .then(dogs => {dogs.forEach(dogData => {createDogBox(dogData)})
    })
}



function createDogBox(dog) {
    const span = document.createElement('span')
    span.innerText = dog.name
    NAVBAR.appendChild(span)
    setUpDetails(span, dog)
}

function setUpDetails(span, dog){
    span.addEventListener('click', (e) => {        
        DOGINFO.innerHTML = ""
        const dogImg = document.createElement('img')
        dogImg.src = dog.image
        const dogHeader = document.createElement('h2')
        dogHeader.innerText = dog.name
        const goodDog = document.createElement('button')
        goodDogText(dog, goodDog)
        goodDog.addEventListener('click', (e) => {
            dog.isGoodDog = !dog.isGoodDog
            updateDog(dog).then(dog => { // update backend 
                goodDogText(dog, goodDog) // change text in box
            }).then(clickFilter) // rerender navbar
        })  
        DOGINFO.append(dogImg, dogHeader, goodDog)
    })
}

function updateDog(dog){
    return fetch(`${DATAURL}/${dog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
      })
        .then(res => res.json())
}

function goodDogText(dog, goodDog){
    if (dog.isGoodDog == true) {
        goodDog.innerText = "Good Dog!"
    } else {
        goodDog.innerText = "Bad Dog!"
    }
}


DOGFILTER.addEventListener('click', event => {
    DOGFILTER.filter = !DOGFILTER.filter
    clickFilter()
})

function clickFilter(){
    NAVBAR.innerHTML = ""
    if (DOGFILTER.filter){
        DOGFILTER.innerHTML = "Filter good dogs: ON"
        fetch (DATAURL)
        .then(response => response.json())
        .then(unfiltered => filterDogs(unfiltered))
        .then(filtered => {filtered.forEach(dogData => {createDogBox(dogData)
        })
      })
    } else {
        DOGFILTER.innerHTML = "Filter good dogs: OFF"
        fetch (DATAURL)
        .then(response => response.json())
        .then(dogs => {dogs.forEach(dogData => {createDogBox(dogData)
        })
    })
    }
}

function filterDogs(dogsArray){
    return dogsArray.filter(dog => dog.isGoodDog === true);
}

init()