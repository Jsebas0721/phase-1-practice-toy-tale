let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // When the page loads, make a 'GET' request to fetch all the toy objects. With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(toy => {
    console.log(toy);
    toy.forEach(element => addToys(element));
  });

  //When the user hit submits, sends a POST Request to upload a new Toy Card
  document.querySelector(".add-toy-form").addEventListener('submit', function(element){   
    element.preventDefault();
    const data = {
      name: "Jessie",
      image: "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
      likes: 0
    };

    const configObject = {
      method: "POST",
      headers:{
          "Content-Type": "application/json",
          "Accept": "application/json",
      },
      body: JSON.stringify(data),
    }
    //sends a POST request
    fetch("http://localhost:3000/toys", configObject)
      .then(resp => resp.json())
      .then(toy => addToys(toy));



    
      
  }); 


  //Adds cards under toy-collection
  function addToys(card){
    let toyCollection = document.getElementById("toy-collection");
    let divClassCard = document.createElement('div');
    toyCollection.appendChild(divClassCard);
    divClassCard.setAttribute('class', "card");
    //Add toy info to the card
    divClassCard.innerHTML = `
    <h2>${card.name}</h2>
    <img src="${card.image}" class="toy-avatar"/>
    <p>${card.likes} Likes</p>
    <button class="like-btn" id="${card.id}">Like ❤️</button>
    ` 
    //Store all cardLike buttons in variable
    let button = divClassCard.querySelector(".like-btn");
    button.addEventListener('click', function(){
      //Object needed to send PATCH request
      const configObject = {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          //calculate the new number of likes,
          likes: ++card.likes
        })
      };
      // send PATCH request // capture that toy's id
      fetch(`http://localhost:3000/toys/${card.id}`,configObject)
      .then(resp => resp.json())
      .then(toy => {
        //update the toy's card in the DOM based on the Response returned by the fetch request.
        divClassCard.querySelector("p").innerHTML = `${toy.likes} Likes`;
      });

    })
    
  }

});