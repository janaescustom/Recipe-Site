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

let wasCalled = false;
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
    const detailMealsPromises = filteredIds.map(async (id) => {
        const detailMeals = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );
        const detailedMeals = await detailMeals.json();
        return detailedMeals;
      });
      const allDetailedMeals = await Promise.all(detailMealsPromises);
      console.log(allDetailedMeals);

      if ( event.target.value == 'A_TO_Z') {
        sortArea(allDetailedMeals)
      }
  }
}

function sortArea(allDetailedMeals){
  console.log(`${allDetailedMeals[0].meals[0].strArea}`)
  console.log('it worked, cool')
  // meals.innerHTML = "";
  // console.log(.meals[0].idMeal)
}