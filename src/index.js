

// JSON
// ----
// 1. fetch the json files X
// 2. convert to js objectX
//
// HTML
// -----
// 1. print dogs in the dog-bar
//
// FEATURES
// --------
// 1. clicking on the dog link loads info about the dog
// 2. the info about the dog should include a 'bad dog button'
// 3. filter button to show good dogs and hide bad dogs

const url = 'http://localhost:3000/pups';
let filter = "OFF";

function getPrintDogs(dogNav) {
  fetch(url)
    .then(dogs => dogs.json())
    .then(dogs => {
      dogs.forEach(dog => {
        printDogNav(dog, dogNav);
      });
    });
}

function printDogNav(dog, dognav) {
  const span = document.createElement('span');
  span.textContent = dog.name;
  span.id = dog.id;
  span.addEventListener('click', e => showDogInfo(e, dog));
  dognav.appendChild(span);
}

function showDogInfo(e, dog_info) {
  // get values
  const display = document.querySelector("#dog-info");
  const id = parseInt(e.target.id);
  const img_url = dog_info.image;
  const dog_name = dog_info.name;

  // create elements
  const img = document.createElement('img');
  const h2 = document.createElement('h2');
  const btn = document.createElement('button');

  img.src = img_url;
  h2.textContent = dog_name;
  btn.textContent = (dog_info.isGoodDog? 'Good Dog!' : 'Bad Dog!');

  btn.id = id;
  btn.addEventListener('click', e => updateDogState(e, dog_info));

  display.textContent = '';
  display.append(img, h2, btn);
}

function updateDogState(e, dog_info) {

  if (e.target.textContent === 'Good Dog!') {
    e.target.textContent = 'Bad Dog!'
  } else {
    e.target.textContent = 'Good Dog!'
  }

  const dogState = dog_info.isGoodDog;
  const id = parseInt(e.target.id);
  const options = {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "isGoodDog": dogState
    }),
  };

  fetch(`http://localhost:3000/pups/${id}`, options)
    .then(dog_data => dog_data.json())
    .then(dog_json => {
      const dogNavbar = document.querySelector('#dog-bar');

      if (filter === 'ON') {
        if (dog_json.isGoodDog) {
          printDogNav(dog_json, dogNavbar);
          console.log('good');
        }
      }
    })
    .catch(err => console.log(err));
}

function toggleGoodDogs(dognav) {
  let navbar = document.querySelector('#good-dog-filter');
  let isOn = navbar.textContent.indexOf('ON');

  fetch(url)
    .then(dogs => dogs.json())
    .then(dogs => {
      const goodDogs = dogs.filter(dog => dog.isGoodDog);
      const children = parent.childNodes;
      dognav.textContent = "";

      if (isOn === -1) {
        filter = "ON";
        navbar.textContent = 'Filter good dogs: ON';
        goodDogs.forEach(dog => printDogNav(dog, dognav));
      } else {
        filter = "OFF";
        navbar.textContent = 'Filter good dogs: OFF';
        dogs.forEach(dog => printDogNav(dog, dognav));
      }
    });
}

// if filter is on you need to load the goodBoys onto the

document.addEventListener('DOMContentLoaded', e => {

  const dogNavbar = document.querySelector('#dog-bar');
  const dogFilter = document.querySelector('#good-dog-filter');
  const isOn = dogFilter.textContent.indexOf('ON');

  getPrintDogs(dogNavbar);

  dogFilter.addEventListener('click', (e) => {
    toggleGoodDogs(dogNavbar);
  });

});
