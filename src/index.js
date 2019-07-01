/// ADD PUPS TO DOG BAR

const DOGS_URL = 'http://localhost:3000/pups'

// on page load - get request for info

const allDogs = () => {
  return fetch(DOGS_URL)
    .then(response => response.json())
}

// iterate over dogs and add them to page

function createSpans () {
  document.querySelector('#dog-bar').innerHTML = ''
  allDogs()
    .then(dogArray => {
      dogArray.forEach(dog => {
        addSpan(dog)
      })
    })
}

// create span with pups name (and id)

function addSpan (dog) {
  span = document.createElement('span')
  div = document.querySelector('#dog-bar')
  span.innerText = dog.name
  span.setAttribute('id', `${dog.id}`)
  span.addEventListener('click', getInfo)
  div.append(span)
}

/// SHOW MORE INFO ABOUT PUPS

function getInfo (event) {
  dogId = event.target.id
  fetch(`${DOGS_URL}/${dogId}`)
    .then(response => response.json())
    .then(showInfo)
}

// function dogInfoDiv

function showInfo (dog) {
  dogDiv = document.querySelector('#dog-info')
  dogDiv.innerHTML = ''
  img = document.createElement('img')
  img.src = dog.image
  h2 = document.createElement('h2')
  h2.innerHTML = dog.name
  button = document.createElement('button')
  button.addEventListener('click', changeDog)
  populateButton(button, dog)
  dogDiv.append(img, h2, button)
}

// add event listener

function populateButton (button, dog) {
  button.setAttribute('dog-button-id', dog.id)
  if (!dog.isGoodDog) {
    button.innerHTML = 'Bad Dog!'
  } else {
    button.innerHTML = 'Good Dog!'
  }
}

/// TOGGLE GOOD DOG

function changeGoodDog (button, dogId) {
  return fetch(`${DOGS_URL}/${dogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isGoodDog: false })
  }).then(response => response.json())
    .then(dog => populateButton(button, dog))
    .then(checkFilter())
}

function changeBadDog (button, dogId) {
  return fetch(`${DOGS_URL}/${dogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isGoodDog: true })
  }).then(response => response.json())
    .then(dog => populateButton(button, dog))
    .then(checkFilter())
}

function changeDog (event) {
  button = event.target
  dogId = event.target.attributes[0].value
  return fetch(`${DOGS_URL}/${dogId}`)
    .then(response => response.json())
    .then(dog => {
      dog.isGoodDog ? changeGoodDog(button, dogId) : changeBadDog(button, dogId)
    })
}

/// FILTER GOOD DOGS

function addFilterFunctionality () {
  button = document.querySelector('#good-dog-filter')
  button.addEventListener('click', filterDogs)
}

function filterDogs (event) {
  currentValue = event.target.innerText.split(' ').splice(-1)
  if (currentValue[0] === 'OFF') {
    filterGoodDogs()
    currentValue[0] = 'ON'
  } else {
    createSpans()
    currentValue[0] = 'OFF'
  }
  event.target.innerText = `Filter good dogs: ${currentValue[0]}`
}

function filterGoodDogs () {
  dogBar = document.querySelector('#dog-bar')
  dogBar.innerHTML = ''
  allDogs()
    .then(dogArray => {
      dogArray.forEach(dog => {
        if (dog.isGoodDog) {
          addSpan(dog)
        }
      })
    })
}

function checkFilter () {
  let currentValue = document.querySelector('#good-dog-filter').innerText.split(' ').splice(-1)
  if (currentValue[0] === 'ON') { filterGoodDogs() }
}

function init () {
  createSpans()
  addFilterFunctionality()
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})
