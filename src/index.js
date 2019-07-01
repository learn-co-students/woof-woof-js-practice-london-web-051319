const BASE_URL = "http://localhost:3000/pups";

window.addEventListener('DOMContentLoaded', (e) => {
    const dogBarDiv = document.querySelector("#dog-bar")
    const dogInfoDiv = document.querySelector("#dog-info")
    const goodDogFilter = document.querySelector("#good-dog-filter")

    createPups(false);


    //Adds click event onto the dog span to show the puppy info once clicked
    dogBarDiv.addEventListener('click', e => {
        if (e.target.nodeName === "SPAN") {
            const pupId = e.target.id.slice(7, e.target.id.length)
            getPup(pupId).then(pup => {
                showPupInfo(pup);
            })
        }
    })

    //Adds event to change the status of the dog from good to bad or vise versa
    dogInfoDiv.addEventListener('click', e => {
        if (e.target.nodeName === "BUTTON") {
            const pupId = e.target.id.slice(11, e.target.id.length)
            const pupIsGoodDog = e.target.textContent.slice(0,4) === "Good" ? true : false
            patchPup(pupId, {isGoodDog: !pupIsGoodDog}).then(pupChanged =>{
                showPupInfo(pupChanged);
            })
        }
    })

    //Adds the event for the filter to toggle it on or off
    goodDogFilter.addEventListener('click', e => {
        let status = e.target.textContent === "Filter good dogs: OFF" ? false : true
        clearDogBar();
        createPups(!status);
        e.target.textContent = !status ? "Filter good dogs: ON" : "Filter good dogs OFF"
    })
})

function getPups() {
    return fetch(BASE_URL).then(resp => resp.json())
}

function getPup(pupId){
    return fetch(`${BASE_URL}/${pupId}`).then(resp => resp.json())
}

function createPups(filter) {
    getPups().then(pups => {
        pups = filter ? pups.filter(pup => {return pup.isGoodDog}) : pups
        for (pup of pups) {
            addPup(createPupSpan(pup));
        }
        return pups
    })
}

function createPupSpan(pup) {
    const span = document.createElement('span')
    span.id = `pup-id-${pup.id}`
    span.textContent = pup.name
    return span
  }

  function addPup(pupSpan) {
    const div = document.querySelector("#dog-bar")
    div.appendChild(pupSpan)
    return pupSpan
  }

  //updates the puppys database
  function patchPup(pupId, pupDetails) {
      return fetch(`${BASE_URL}/${pupId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
          },
          body: JSON.stringify(pupDetails)
      }).then(resp => resp.json())
  }

  //clears the bar of the puppys that are bad
  function clearDogBar() {
      const div = document.querySelector("#dog-bar")
      while (div.firstChild) {
          div.removeChild(div.firstChild);
      }
  }

  //creates the puppys to be displayed
  function showPupInfo(pup) {
      const img = document.createElement('img')
      img.src = pup.image

      const h2 = document.createElement('h2')
      h2.textContent = pup.name

      const button = document.createElement('button')
      button.textContent = pup.isGoodDog? "Good Dog!" : "Bad Dog!"
      button.id = `pup-button-${pup.id}`

      const div = document.querySelector('#dog-info')

      while (div.firstChild) {
          div.removeChild(div.firstChild);
      }

      div.append(img, h2, button)
  }