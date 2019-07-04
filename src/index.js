window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const dogBar = document.querySelector('#dog-bar')
    const dogInfo = document.querySelector('#dog-info')
    const allDogsUrl = 'http://localhost:3000/pups'
    
    function getDogs(){
        fetch(allDogsUrl)
            .then(function(response) {
              return response.json();
            })
            .then(function(allDogs) {
                renderDogs(allDogs);
            });
    }
                  

    function renderDogs(allDogs){
        // console.log(allDogs)

        for (const element in allDogs){
           const aDog = allDogs[element]
           const span = document.createElement('span')
           span.innerHTML = aDog.name
           dogBar.append(span)
           span.addEventListener("click", e => {renderADog(aDog)})
        }          
    }

    function renderADog(aDog){
        console.log(aDog)
        dogInfo.innerHTML = " "
        const img = document.createElement('img')
        img.src = aDog.image
        const h2 = document.createElement('h2')
        h2.innerHTML = aDog.name
        const button = document.createElement('button')
        button.innerHTML = dogStatus(aDog)
        button.addEventListener('click', e => {changeDogStatus(aDog)})


        dogInfo.append(img, h2, button)


    }

    function dogStatus(aDog){
        // console.log(aDog.isGoodDog)
        if (aDog.isGoodDog){
            return 'Bad Dog!'
        } else {
            return 'Good Dog!'
        }
    }

    function changeDogStatus(aDog){
        const aDogId = aDog.id
        const aDogStatus = aDog.isGoodDog
        const aNewDogStatus = !aDogStatus
        const newStatusObj = {
            "name": aDog.name,
            "isGoodDog": aNewDogStatus,
            "image": aDog.image
        }

        return fetch(`${allDogsUrl}/${aDogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatusObj)
        })
        .then(response => response.json())
        .then(getDog(aDog))

        console.log(newStatusObj)
    }

    function getDog(aDog){
        fetch(`${allDogsUrl}/${aDog.id}`)
            .then(function(response) {
              return response.json();
            })
            .then(function(aDog) {
                renderADog(aDog);
            });
    }








    getDogs()
});