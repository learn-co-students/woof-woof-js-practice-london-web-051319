function addDog(dog) {
  const dog_bar = document.querySelector("#dog-bar");
  const span = makeDogSpan(dog);
  dog_bar.appendChild(span);
}

function makeDogSpan(dog) {
  let span = document.createElement("span");
  let h3 = document.createElement("h3");
  h3.textContent = dog.name;
  span.append(h3);
  span.setAttribute("id", dog.id);
  h3.setAttribute("id", dog.id);
  span.addEventListener("click", e => chooseDog(e))
  return span;
}

function makeDogCard(dog) {
  const dog_info = document.querySelector("#dog-info");

  const div = document.createElement("div");
  div.className = "card";

  const img = document.createElement("img");
  img.src = dog.image;

  const h3 = document.createElement("h3");
  h3.textContent = dog.name;

  const button = document.createElement("button");
  button.setAttribute("id", dog.id);
  if (dog.isGoodDog) {
    button.innerHTML = "Bad Dog!"
  } else {
    button.innerHTML = "Good Dog!"
  }

  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(button);

  button.addEventListener("click", e => clickSubmission(e));

  dog_info.appendChild(div);
}

function chooseDog(e) {
  const dog_info = document.querySelector("#dog-info");

  console.log(e);
  let id = e.target.id;
  dog_info.innerHTML = ""
  return fetch(`http://localhost:3000/pups/${id}`)
    .then(response => response.json())
    .then(dog => makeDogCard(dog));
}

function clickSubmission(e) {
  let id = e.target.id;

  return fetch(`http://localhost:3000/pups/${id}`)
    .then(response => response.json())
    .then(dog => toggleGoodDog(dog))
    .then();
}

function toggleGoodDog(dog) {

  return fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        'isGoodDog': !(dog.isGoodDog)
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(response => response.json())
}


function showDogs(dogArray) {
  dogArray.map(dog => {
    addDog(dog);
  });
}

const form = document.querySelector("form");

// form.addEventListener("submit", e => handleSubmission(e));

// function handleSubmission(e) {
//   e.preventDefault();
//   const [nameInputNode, imgInputNode] = e.target;
//   const dogObj = {
//     name: nameInputNode.value,
//     img: imgInputNode.value
//   };

//   createADog(dogObj).then(addDog);
// }

// function createADog(dog) {
//   return fetch(BASE_URL, {
//     method: "POST",
//     body: JSON.stringify(dog),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(dog => dog.json());
// }

// globals for fetching

const BASE_URL = "http://localhost:3000/pups";



// init
function getAllDogsAndPutThemInTheDOM() {
  fetch("http://localhost:3000/pups")
    .then(dogsData => dogsData.json())
    .then(dogsArray => showDogs(dogsArray));
}

function init() {
  getAllDogsAndPutThemInTheDOM();
}

init();