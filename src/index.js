document.addEventListener("DOMContentLoaded", () => {
  createSpans()
  addFilterFunctionality()

});  

let dogBar = document.getElementById("dog-bar");


function getDogs() {
  return fetch("http://localhost:3000/pups")
  .then(data => data.json())
}

function createSpans() {
  document.querySelector("#dog-bar").innerHTML = "";
  getDogs()
  .then(dogObjs => {
    dogObjs.forEach(dog => {
      addDogToDogBar(dog)});
    }
  )
}


function addDogToDogBar(dogObj) {
  const dogBar = document.getElementById("dog-bar");
  
  let span = document.createElement("span");
  span.innerText = dogObj.name
  span.id = `span-${dogObj.id}`;
  span.addEventListener("click", e => displayMoreDogInfo(e));

  dogBar.appendChild(span);

}

function displayMoreDogInfo(event) {
  const selectedDogID = event.target.id.split("span-")[1];

  fetch(`http://localhost:3000/pups/${selectedDogID}`)
  .then(data => data.json())
  .then(dogObj => showDogInfo(dogObj)
  );
}

function showDogInfo(dogObj) {
  const dogInfoContainer = document.getElementById("dog-info");
  dogInfoContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = dogObj.image;

  const h2 = document.createElement("h2");
  h2.innerText = dogObj.name;

  const button = document.createElement("button");
  button.id = dogObj.id;
  button.addEventListener("click", event => getCurrentDogStatus(event))

  if(dogObj.isGoodBoy == true){
    button.innerText = "Good Dog!"
  }
  else {
    button.innerText = "Bad Dog!"
  }
  dogInfoContainer.append(img, h2, button)
}


function changeGoodDogStatus(dogObj) {
  let data = dogObj.isGoodDog;

  fetch(`http://localhost:3000/pups/${dogObj.id}`, {
    method: "PATCH",
    headers: {
      "Content-type": 'application/',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({isGoodDog: !data}),
  })
  .then(response => response.json())
  .then(newDogObj => updateDogButton(newDogObj))
}

function updateDogButton(newDogObj) {
  let data = newDogObj.isGoodDog;
  button = document.getElementById(newDogObj.id)

  if(data === true) {
    button.innerText = "Bad Dog!"
  } 
  else if (data === false) {
    button.innerText = "Good Dog!"
  }
}

function getCurrentDogStatus(event) {
  let selectedDogID = event.target.id;
  fetch(`http://localhost:3000/pups/${selectedDogID}`)
  .then(data => data.json())
  .then(dogObj => changeGoodDogStatus(dogObj)
  );
}

function addFilterFunctionality() {
  dogFilter = document.getElementById("good-dog-filter");
  dogFilter.addEventListener("click",changeDogFilterStatus)
}

let filterStatus = "OFF"

function changeDogFilterStatus(e) {
  console.log(filterStatus)
  if (filterStatus === "OFF") {
    filterStatus = "ON";
    dogFilter.innerText = "Filter good dogs: ON"
    filterDogs();
  }
  else if (filterStatus === "ON") {
    filterStatus = "OFF";
    dogFilter.innerText = "Filter good dogs: OFF"
    createSpans();
  }
}

function filterDogs() {
  dogBar = document.querySelector('#dog-bar')
  dogBar.innerHTML = '';
  getDogs()
  .then(dogArray => {
    dogArray.forEach(dog => {
      if(dog.isGoodDog === true) {
        createSpans(dog)
      }
    })
  })
}






