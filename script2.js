const selectedRecipie = JSON.parse(localStorage.getItem("selectedRecipie")); //getting id of the selected recipie
const rightContainer = document.querySelector(".right-container");
const productMainImg = document.querySelector(".product-main-img");
const favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
loadSelectedRecipie(selectedRecipie);

// Functions
function loadSelectedRecipie(selectedRecipie) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedRecipie}` //passing id of the selected recipie
  )
    .then((Response) => Response.json())
    .then((data) => {
      let meal = data.meals[0];
      console.log(meal);
      // Left container details
      const recipieMainImg = `<img
      src="${meal.strMealThumb}"
      alt=""
    />`;
      productMainImg.innerHTML = recipieMainImg;

      // Right container details
      let ingredientArr = []; //getting all the ingredients
      let measureArr = []; //getting all the measures
      for (let value in meal) {
        if (value.includes("strIngredient")) {
          if (meal[value] != null && meal[value] != "")
            ingredientArr.push(meal[value]);
        } else if (value.includes("strMeasure")) {
          if (meal[value] != null && meal[value].trim() != "")
            measureArr.push(meal[value]);
        }
      }
      let measureIngredientList = ``;
      ingredientArr.forEach((value, index) => {
        //populating the measure-ingredient list
        measureIngredientList += `<li>${measureArr[index]} ${value}</li>`;
      });
      const instructionsList = meal.strInstructions.split("\n");
      let instructionLi = ``;
      instructionsList.forEach((para) => {
        if (para.trim() != "") instructionLi += `<li>${para}</li>`;
      });
      const newRecipie = `<p class="product-heading">${meal.strMeal}</p>
        <p class="product-ingredient-sub-heading">Ingredients:</p>
        <ul class="product-ingredient-list">
          ${measureIngredientList}
        </ul>
        <p class="product-instructions-sub-heading">Instructions:</p>
        <ol class="product-instructions">
            ${instructionLi}
        </ol>
        <div class="product-instruction-video">
          <iframe
            width="100%"
            height="100%"
            src="${meal.strYoutube.replace("watch?v=", "embed/")}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <span class="add-to-favorites inside-p-template"
    ><i class="${
      favoritesList.includes(meal.idMeal) == true //assigning class name to the add-to-favorites icon
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart"
    }"></i
  ></span>`;
      rightContainer.innerHTML = newRecipie; //adding the selected recipie in the html
      addFavbtnEvents();
    });
}
// Event Listeners
function addFavbtnEvents() {
  const btn = document.querySelector(".add-to-favorites i");
  btn.addEventListener("click", (e) => {
    let productId = JSON.parse(localStorage.getItem("selectedRecipie")); //getting the the recipie id
    console.log(productId);
    if (e.target.classList.contains("fa-regular")) {
      favoritesList.push(productId);
      e.target.classList.add("fa-solid");
      e.target.classList.remove("fa-regular");
    } else {
      let ind = favoritesList.findIndex((value) => value == productId);
      favoritesList.splice(ind, 1);
      e.target.classList.remove("fa-solid");
      e.target.classList.add("fa-regular");
    }
    localStorage.setItem("favoritesList", JSON.stringify(favoritesList)); //updating the ids of the liked recipies in the favorites list
  });
}
