const meals = document.querySelector(".images-container");
const images = document.querySelectorAll(".image");
const formEl = document.querySelector("form");
const resultsEl = document.querySelector(".searchResults");
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
                <h1 class="name">${meal.strMeal}</h1>
                <h3 class="category">${meal.strArea} ${meal.strCategory}</h3>
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
  resultsEl.innerHTML = "";
  const inputEl = document.querySelector("#ingredient");
  const inputVal = inputEl.value;
  let recipes = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputVal}`,
  );
  const recipesData = await recipes.json();

  const firstSix = recipesData.meals.slice(0, 6);

  console.log(firstSix);

  meals.innerHTML = "";

  firstSix.forEach((meal) => {
    firstSixArray.push(meal.idMeal);
  });
  console.log(firstSixArray);


  firstSixArray.forEach(async (id) => {
    const getMeal = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );
    const mealInfo = await getMeal.json();
    console.log(mealInfo);
    sixMeals.push(mealInfo.meals[0]);
  });
  
  console.log(sixMeals)
 meals.innerHTML = sixMeals.map((meal) => mealsHTML(meal)).join("");

// for (let i =0; i < 6; ++i) {
//   meals.innerHTML += `
//             <div class="landing-image image" style="background: url('${sixMeals[i].strMealThumb}')"
//             onclick="">
//                 <h1 class="name">${sixMeals[i].strMeal}</h1>
//                 <h3 class="category">${sixMeals[i].strArea} ${sixMeals[i].strCategory}</h3>
//             </div>
//             `;
function mealsHTML(meal) {
    return `
            <div class="landing-image image" style="background: url('${meal.strMealThumb}')"
            onclick="">
                <h1 class="name">${meal.strMeal}</h1>
                <h3 class="category">${meal.strArea} ${meal.strCategory}</h3>
            </div>
            `;
  };
// }
});



function chomp() {
  document.body.classList += " animate-across";

  const animation = document.querySelector(".svg-container");
  animation.addEventListener(
    "animationend",
    function () {
      document.body.classList.remove("animate-across");
    },
    { once: true },
  );

  animation.style.left = "120vw"; // Reset position
}
