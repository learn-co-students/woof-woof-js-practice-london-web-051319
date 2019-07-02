const URL = "http://localhost:3000/pups"


function fetchDogs()
{
    return fetch(URL)
    .then(response => response.json())
    .then(dog => renderDogs(dog))
}

function renderDogs(dogArray)
{
    const dog_bar = document.getElementById('dog-bar')
    good_dog_filter = document.getElementById('good-dog-filter');
    good_dog_filter.addEventListener("click", function(){
        if(good_dog_filter.textContent == "Filter good dogs: OFF")

        {
            dog_bar.innerHTML = '';
            dogArray.forEach(dog => {
                let span = document.createElement('span');
                span.innerText = dog.name;
                dog_bar.appendChild(span);
                span.addEventListener("click", function(){
                    showDogInfo(dog);
                })
            })
            good_dog_filter.textContent = "Filter good dogs: ON"
        }
        else if(good_dog_filter.textContent == "Filter good dogs: ON"){
            dog_bar.innerHTML = '';
            let good_dogs = dogArray.filter(dog => dog.isGoodDog)
            good_dogs.forEach(dog => {
                let span = document.createElement('span');
                span.innerText = dog.name;
                dog_bar.appendChild(span);
                span.addEventListener("click", function(){
                    showDogInfo(dog);
                })
            })
            good_dog_filter.textContent = "Filter good dogs: OFF"
        } 
    })
}

function showDogInfo(dog){
    dog_info = document.getElementById('dog-info');
    img = document.createElement('img')
    h2 = document.createElement('h2')
    button = document.createElement('button');
    if(dog.isGoodDog)
        button.innerText = 'Good Dog!'
    else
        button.innerText = 'Bad Dog!'
    img.src = dog.image
    h2.innerText = dog.name
    while(dog_info.hasChildNodes())
    {
        dog_info.removeChild(dog_info.firstChild)
    }
    dog_info.appendChild(img);    
    dog_info.appendChild(h2);
    dog_info.appendChild(button);
    button.addEventListener("click", function(){
        if(dog.isGoodDog){
            dog.isGoodDog = false
            button.innerText = 'Bad Dog!'
        }else{
            dog.isGoodDog = true
            button.innerText = 'Good Dog!'
        }
        updateDogInDB(dog);
    })
    
}

const updateDogInDB = (dog) => {
    return fetch(`${URL}/${dog.id}`,
    {
        method:'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(dog)
    })
    .then(response => response.json())
}

document.addEventListener('DOMContentLoaded', (event) => {
        fetchDogs();
})