const PUPS = "http://localhost:3000/pups";

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.querySelector("#dog-bar");
  const card = document.querySelector("#dog-info")
  const renderPups = () => {
    [...bar.children].forEach(child => child.remove());
    filter = ~~document.querySelector("#good-dog-filter").value
    fetch(PUPS)
    .then(resp => resp.json())
    .then(data => {
      filter && (data = data.filter(({isGoodDog}) => isGoodDog));
      data.forEach(({name, id}) => {
      const span = document.createElement("span");
      span.innerText = name;
      span.idNum = id;
      bar.appendChild(span);
    })})
  }
  renderPups();
  bar.addEventListener("click", ({target}) => {
    const puppyUrl = PUPS + "/" + target.idNum;
    target.tagName === "SPAN" && fetch(puppyUrl)
    .then(resp => resp.json())
    .then(({image, name, isGoodDog}) => {
      [...card.children].forEach(child => child.remove());
      const img = document.createElement("img");
      img.src = image;
      const h2 = document.createElement("h2");
      h2.innerText = name;
      const button = document.createElement("button");
      button.value = isGoodDog ? 1 : 0;
      button.innerText = isGoodDog ? "Good Dog!" : "Bad Dog!";
      button.addEventListener("click", () => {
        console.log(!button.value)
        fetch(puppyUrl, {method: "PATCH", body: JSON.stringify({isGoodDog: !~~button.value}),  headers: {"Content-Type": "application/json",
        Accept: "application/json"}})
        .then(resp => resp.json())
        .then(({isGoodDog}) => {
          button.innerText = isGoodDog ? "Good Dog!" : "Bad Dog!"
          button.value = !~~button.value
          renderPups();
        })
      })
      card.append(img,h2,button);
    })
  })

  document.querySelector("#good-dog-filter").addEventListener("click", ({target}) => {
    const turnedOn = !~~target.value
    target.value = turnedOn ? 1 : 0;
    const text = target.innerText.split(": ");
    text[1] = turnedOn ? "ON" : "OFF";
    target.innerText = text.join(": ");
    renderPups();
  })
})


const renderPupDiv = pup => {
  div = document.createElement("div");
  div.id = dog-info
}
