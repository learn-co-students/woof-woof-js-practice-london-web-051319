document.addEventListener('DOMContentLoaded', (e) => {

   function init() {
      const filterButton = document.querySelector('#good-dog-filter');
      filterButton.addEventListener('click', (e) => {
         if (filterButton.innerText.slice(-3) === 'OFF'){
            filterButton.innerText = 'Filter good dogs: ON';
            return getData();
         } else if (filterButton.innerText.slice(-3) === ' ON'){
            filterButton.innerText = 'Filter good dogs: OFF';
            return getData();
         };
      });
      return getData();
   };

   function getData() {
      fetch('http://localhost:3000/pups')
      .then(data => data.json())
      .then(results => filterData(results));
   };

   function filterData(results) {
      const filterButton = document.querySelector('#good-dog-filter');
      filterButton.innerText.slice(-3) === 'OFF' ? filter = 'all' : filter = 'filtered';
      if (filter === 'filtered'){
         results = results.filter(result => result.isGoodDog === true);
      } else {
         results;
      };
      renderPage(results);
   };

   function renderPage(results) {
      const dogBar = document.querySelector('#dog-bar');
      dogBar.innerHTML = "";
      for(const dog of results){
         let newFilter = document.createElement('span');
         newFilter.id = dog.id;
         newFilter.innerText = dog.name;
         newFilter.value = `${dog.id} ${dog.name.split(' ').join('-')} ${dog.isGoodDog} ${dog.image}`;
         newFilter.addEventListener('click', (e) => renderDog(e))
         dogBar.append(newFilter);
      };
   };

   function renderDog(event) {
      const dogInfo = document.querySelector('#dog-info');
      dogInfo.innerHTML = '';
      let [dogId, dogName, dogStatus, dogImage] = event.target.value.split(' ');
      dogId = dogId.split('-').join(' ');
      let newH2 = document.createElement('h2');
      newH2.innerText = dogName;
      let statusDiv = document.createElement('div');
      statusDiv.className = 'status-box'
      let toggleSwitchBad = document.createElement('button');
      toggleSwitchBad.id = `${dogId}_toggle_bad`;
      toggleSwitchBad.innerText = 'bad'
      toggleSwitchBad.className = 'toggle-button-bad';
      let toggleSwitchGood = document.createElement('button');
      toggleSwitchGood.id = `${dogId}_toggle_good`;
      toggleSwitchGood.innerText = 'good';
      toggleSwitchGood.className = 'toggle-button-good';
      let newH4 = document.createElement('h4');
      newH4.innerText = `Good dog? ${dogStatus}`
      statusDiv.append(newH4, toggleSwitchBad, toggleSwitchGood);
      let newImg = document.createElement('img');
      newImg.src = dogImage;
      dogInfo.append(newH2, statusDiv, newImg);
      checkToggles(dogId, dogStatus);
   };

   function checkToggles(id, status) {
      let good = document.getElementById(`${id}_toggle_good`);
      let bad = document.getElementById(`${id}_toggle_bad`);
      if (status === 'true'){
         good.style.background = 'green';
         good.style.color = 'white';
         bad.style.background = 'white'
         bad.style.color = 'red';
      } else if (status === 'false'){
         good.style.background = 'white';
         good.style.color = 'green';
         bad.style.background = 'red'
         bad.style.color = 'white';
      }
      good.addEventListener('click', (e) => changeStatus(e));
      bad.addEventListener('click', (e) => changeStatus(e));
   };

   function changeStatus(event) {
      let id = event.target.id.split('_').slice(0, 1)
      let indicator = event.target.id.split('_').slice(-1).join(' ')
      let good = document.getElementById(`${id}_toggle_good`);
      let bad = document.getElementById(`${id}_toggle_bad`);
      // debugger
      if (indicator === 'good'){
         good.style.background = 'green';
         good.style.color = 'white';
         bad.style.background = 'white'
         bad.style.color = 'red';
         updateServer(event.target.id);
      } else if (indicator === 'bad'){
         good.style.background = 'white';
         good.style.color = 'green';
         bad.style.background = 'red'
         bad.style.color = 'white';
         updateServer(event.target.id);
      }
   };

   function updateServer(id) {
      let newStatus;
      let dogsId = id.split('_').slice(0,1)[0];
      let status = id.split('_').slice(2)[0];
      status === 'good' ? newStatus = true : newStatus = false;

      let configOpt = {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify({isGoodDog: newStatus})
      }
      fetch(`http://localhost:3000/pups/${dogsId}`, configOpt)
      .then(data => data.json())
      .then(console.log)
   };

init();
});
