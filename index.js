const meals = document.querySelector(".images-container");
const images = document.querySelectorAll(".image");
const formEl = document.querySelector("form");
const inputEl = document.querySelector("#ingredient");
const animation = document.querySelector(".svg-container");
let mealList = [];
let firstSixArray = [];
let sixMeals = [];

async function landingPage() {
  for (let i = 0; i < 6; ++i) {
    const recipe = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php",
    );
    const recipeData = await recipe.json();
    mealList.push(recipeData.meals[0]);
  }
  mealList.forEach((meal) => {
    meals.innerHTML += `
    <div class="landing-image image" style="background: url('${meal.strMealThumb}')"
    onclick="">
    <h3 class="category">${meal.strArea} ${meal.strCategory}</h3>
    <h1 class="name">${meal.strMeal}</h1>
    </div>
    `;
  });
}

images.forEach((image) => {
  image.addEventListener("click", function () {
    image.classList += " .active";
  });
});

landingPage();

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  meals.innerHTML = "";

  const inputVal = inputEl.value.trim();

  if (!inputVal) {
    alert("Please enter an ingredient!");
    return; // Exit the function if the input is empty
  }

  chomp();

  animation.addEventListener(
    "animationend",
    async function () {
      let recipes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputVal}`,
      );
      const recipesData = await recipes.json();
      const firstSix = recipesData.meals.slice(0, 6);
      const sixIds = firstSix.map((meal) => meal.idMeal);

      const detailMealsPromises = sixIds.map(async (id) => {
        const detailMeals = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );
        const detailedMeals = await detailMeals.json();
        return detailedMeals;
      });
      const allDetailedMeals = await Promise.all(detailMealsPromises);
      meals.innerHTML = allDetailedMeals
        .map((meal) => mealsHTML(meal))
        .join("");
    },
    { once: true },
  );
});

function mealsHTML(meal) {
  return `
            <div class="landing-image image" style="background: url('${meal.meals[0].strMealThumb}')"
            onclick="">
                <h1 class="name">${meal.meals[0].strMeal}</h1>
                <h3 class="category">${meal.meals[0].strArea} ${meal.meals[0].strCategory}</h3>
            </div>
            `;
}

function chomp() {
  document.body.classList += " animate-across";

  animation.addEventListener(
    "animationend",
    function () {
      document.body.classList.remove("animate-across");
    },
    { once: true },
  );

  animation.style.left = "120vw"; // Reset position
}

let mealsCategorized = [];
let allFilteredMeals = [];
let wasCalled = false;
const results = document.querySelector('.results__container');
function categoryFilter(event) {
  wasCalled = true;
  const filterChange = event.target.value
  
  filters();
  
  async function filters() {
    const filterPromise = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${filterChange}`);
    const filter = await filterPromise.json();
    
    console.log(filter)
    const filteredIds = filter.meals.map((meal)=> meal.idMeal)
    console.log(filteredIds)
    const filteredMealsPromises = filteredIds.map(async (id) => {
        const filterMeals = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );
        const filteredMeals = await filterMeals.json();
        return filteredMeals;
      });
      allFilteredMeals = await Promise.all(filteredMealsPromises);
      console.log(allFilteredMeals);
// sortArea(allFilteredMeals)
const filterHTML = allFilteredMeals.map((meal) => {
  return `<div class="filtered card on-hover" style="background-image: url('${meal.meals[0].strMealThumb}')">
 <div class="inner--outer">
  <p>${meal.meals[0].strArea}</p>
  <p>${meal.meals[0].strMeal}</p></div>

  </div>`
}).join("");

results.innerHTML = filterHTML
    }
  }
  
  function sortArea(){
    const order = document.getElementById('sortArea').value; // Get the selected sort order
    console.log("why aren't you working")

    if (mealsCategorized.length === 0) {
      console.log('nothing to sort');
      return;
    }

  mealsCategorized.sort((a, b) => {
    const areaA = a.meals[0].strArea.toLowerCase(); // Get area in lowercase for case-insensitive comparison
    const areaB = b.meals[0].strArea.toLowerCase();
    
    if (order === 'A_TO_Z') {
      console.log(areaA.localeCompare(areaB)); // Sort A to Z
      return  
    } else {
      return areaB.localeCompare(areaA); // Sort Z to A
    }
  });
  console.log(allFilteredMeals)
}
// console.log(order)
// if (order === 'A_TO_Z') {
//   // sortArea()
//   console.log("a to z bia");
//   sortArea(allFilteredMeals)
// }