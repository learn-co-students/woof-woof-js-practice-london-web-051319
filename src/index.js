// const dogContainer = document.getElementById('dog-summary-container');
//gets all dogs
function fetchDoggos() {
  fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i]);
      createDoggoBar(data[i]);
    }
  });
}

//calls to filter dogs
const filterBtn = document.getElementById('good-dog-filter');
filterBtn.addEventListener('click', event => {
  let status = false;
  if (event.target.textContent.includes('OFF')) {
    status = false;
  } else {
    status = true
  }
  filterDoggos(status);
});

//filters dogs
function filterDoggos(status) {
  const bar = document.getElementById('dog-bar');
  const dogFilter = document.getElementById('good-dog-filter');
  bar.innerHTML = " "
  if (status === false) {
    dogFilter.className = 'btn btn-success'
  dogFilter.innerHTML = 'Filter good dogs: ON';
  fetch('http://localhost:3000/pups')
    .then(res => res.json())
      .then(allDogs => allDogs.filter(doggo => doggo.isGoodDog === true))
    .then(filteredDoggos => {
      for (let i = 0; i < filteredDoggos.length; i++) {
        createDoggoBar(filteredDoggos[i]);
      }
    })
  } else {
    dogFilter.className = 'btn btn-warning'
    dogFilter.innerHTML = 'Filter good dogs: OFF';
    fetch('http://localhost:3000/pups')
      .then(res => res.json())
      .then(allDogs => {
        for (let i = 0; i < allDogs.length; i++) {
          createDoggoBar(allDogs[i])
        }
      })
  }
}

//navbar? for all dogs
function createDoggoBar(doggoData) {
  // debugger
  console.log(doggoData);
  
  const dogBar = document.getElementById('dog-bar');
  const span = document.createElement('span');
  span.id = 'doggoSpan';
  const h5 = document.createElement('h5');
  h5.className = 'toyName';
  h5.innerText = doggoData.name;

  span.appendChild(h5);
  dogBar.appendChild(span);

  span.addEventListener('click', event => {
    const cardContainer = document.getElementById('dog-info');
    cardContainer.innerHTML = ""
    console.log('button clicked!');
    doggoInfo(doggoData);
  })

}

//gets info for each dog
function doggoInfo(doggoData) {
  console.log('Function was called!');
  const hidden = document.createElement('span');
  hidden.textContent = doggoData.isGoodDog;
  console.log(hidden.innerText);
  hidden.style.display = 'none';
  const dogInfo = document.getElementById('dog-info');
  dogInfo.className = 'card';
  const dogContainer = document.getElementById('dog-summary-container');
  const h2 = document.createElement('h2');
  h2.className = 'card-title'
  const img = document.createElement('img');
  img.className = 'card-img-top';
  const buttonGood = document.createElement('button');
  buttonGood.className = 'card-text btn btn-primary';
  const buttonBad = document.createElement('button');
  buttonBad.className = 'card-text btn btn-danger';

  h2.innerText = doggoData.name;
  img.src = doggoData.image;

  buttonGood.innerHTML = 'Good Dog!';
  buttonBad.innerHTML = 'Bad Dog!'

  if (hidden.innerText === 'true') {
    buttonGood.disabled = true;
  } else {
    buttonBad.disabled = true;
  }

  dogContainer.appendChild(dogInfo);
  dogInfo.append(h2, img, buttonGood, buttonBad); 

  toggleDoggo(doggoData, buttonGood, buttonBad, hidden);
}

//toggles between buttons and calls to update the dog
function toggleDoggo(doggoData, buttonGood, buttonBad, hidden) {
    buttonBad.addEventListener('click', () => {
      // console.log('this is a good doggo!');
      doggoData.isGoodDog = false;
      updateDoggo(doggoData)
        .then(updatedBadDoggo => {
          doggoData = updatedBadDoggo
          buttonGood.disabled = false;
          buttonBad.disabled = true;
        })
    })

    buttonGood.addEventListener('click', () => {
      doggoData.isGoodDog = true;
      // debugger
      updateDoggo(doggoData)
        .then(updatedDoggo => {
          doggoData = updatedDoggo
          buttonGood.disabled = true;
          buttonBad.disabled = false;
        })
    })
 
}

//updates dog in database
function updateDoggo(doggo) {
  return fetch(`http://localhost:3000/pups/${doggo.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(doggo)
  })
  .then(res => res.json())
}

//calls to fetch all dogs when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  fetchDoggos();
})
