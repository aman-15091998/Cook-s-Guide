const searchResults = document.querySelector(".favorite-list");
const favoriteHeading = document.querySelector(".favorite-heading");
const promiseArr = [];
// Initializing local storage variables
let favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
if (favoritesList == null) {
  favoritesList = [];
  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
}
loadFavoriteList();
// Functions
function loadFavoriteList() {
  if ((searchResults.innerHTML = ""))
    searchResults.innerHTML = `<p>No recipies are marked as favorite.</p>`;
  searchResults.innerHTML = "";
  favoritesList.forEach((id) => {
    //loading all the recipies in the favorite list
    promiseArr.push(loadRecipies(id));
  });
  Promise.all(promiseArr).then(() => {
    //Waiting for all the fetch calls to resolve
    addFavbtnEvents(); //adding event listeners to all the listed recipies
    addProductEvents();
  });
}
async function loadRecipies(value) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`) //getting recipie by id
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      addRecipies(data);
    })
    .catch((err) => {
      console.log(err.status);
    });
}
function addRecipies(data) {
  data.meals.forEach((meal, index) => {
    //adding the recipies in the frontend
    const newMeal = `<div class="product id-${meal.idMeal}">
  <div class="product-img">
  <img class="actualImg"
      src="${meal.strMealThumb}"
      alt=""
    />
  </div>
  <div class="product-details">
    <p class="product-name">${meal.strMeal}</p>
    <p class="product-ingredient">
    Ingredients:
      <ul class="product-ingredient-list">
        <li>${meal.strMeasure1} ${meal.strIngredient1}</li>
        <li>${meal.strMeasure2} ${meal.strIngredient2}</li>
        <li>${meal.strMeasure3} ${meal.strIngredient3}</li>
        <p>...</p>
      </ul>
    </p>
  </div>
  <span class="add-to-favorites"
    ><i class="${
      favoritesList.includes(meal.idMeal) == true //assigning class name to the add-to-favorites icon
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart"
    }"></i
  ></span>
</div>`;
    // fa-heart
    searchResults.insertAdjacentHTML("beforeend", newMeal); //adding the new recipie to the last
   
  });
}
function addFavbtnEvents() {
  const addToFavBtn = document.querySelectorAll(".add-to-favorites i");
  console.log(addToFavBtn);
  addToFavBtn.forEach((btn) => {
    //adding click event to all the add-to-favorites icons.
    btn.addEventListener("click", (e) => {
      let productId =
        e.target.parentElement.parentElement.classList[1].substring(3); //getting the parent element and extracting the recipie id
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
        loadFavoriteList();
      }
      localStorage.setItem("favoritesList", JSON.stringify(favoritesList)); //updating the ids of the liked recipies in the favorites list
    });
  });
}
function addProductEvents() {
  const productList = document.querySelectorAll(".product");
  console.log(productList);
  productList.forEach((product) => {
    //adding click event to all product icons.
    product.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("add-to-favorites") == false &&
        e.target.classList.contains("fa-heart") == false
      ) {
        selectedRecipie = product.classList[1].substring(3);
        localStorage.setItem(
          "selectedRecipie",
          JSON.stringify(selectedRecipie)
        );
        window.location.href = "product.html";
      }
    });
  });
}
