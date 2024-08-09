// const container = document.querySelector(".show-container");
const searchInput = document.querySelector(".search");
const searchBox = document.querySelector(".search-box");
const searchResults = document.querySelector(".search-results");

// Initializing local storage variables
let selectedRecipie = null;
let favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
if (favoritesList == null) {
  favoritesList = [];
  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
}

// Functions
function loadRecipies(value) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`) //getting recipies
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      addRecipies(data);
      addFavbtnEvents();
      addProductEvents();
    })
    .catch((err) => {
      console.log(err.status);
    });
}
function addRecipies(data) {
  searchResults.innerHTML = "";
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
      }
      localStorage.setItem("favoritesList", JSON.stringify(favoritesList)); //updating the ids of the liked recipies in the favorites list
    });
  });
}
function addProductEvents() {
  const productList = document.querySelectorAll(".product");
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
// Event Listeners
searchInput.addEventListener("focusin", () => {
  searchInput.classList.add("addEffect");
  searchBox.classList.add("search-box-move-up");
});
searchInput.addEventListener("focusout", () => {
  searchInput.classList.remove("addEffect");
  if (searchInput.value == "") {
    searchBox.classList.remove("search-box-move-up");
    searchResults.innerHTML = "";
  }
});

searchInput.addEventListener("input", (e) => {
  favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
  if (e.target.value == "") searchResults.innerHTML = "";
  else loadRecipies(e.target.value);
});
window.addEventListener("load", () => {
  if (searchInput.value.trim() != "") {
    loadRecipies(searchInput.value);
  }
});
