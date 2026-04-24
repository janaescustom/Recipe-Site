const meals = document.querySelector(".images-container");
const images = document.querySelectorAll(".image");
const formEl = document.querySelector("form");
const inputEl = document.querySelector("#ingredient");
const animation = document.querySelector(".svg-container");
let mealList = [];
let firstSixArray = [];

async function landingPage() {
  for (let i = 0; i < 6; ++i) {
    const recipe = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php",
    );
    const recipeData = await recipe.json();
    mealList.push(recipeData.meals[0]);
  }
  mealList.forEach(mealsHTML);
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
      const newArray = allDetailedMeals.map((meal) => {
        return meal.meals[0]
      })
      newArray.forEach(mealsHTML)
    },
    { once: true },
  );
});

function mealsHTML(meal) {
  meals.innerHTML += `
            <div class="landing-image image" style="background-image: url('${meal.strMealThumb}')"
            onclick="">
                <h1 class="name">${meal.strMeal}</h1>
                <h3 class="category">${meal.strArea} ${meal.strCategory}</h3>
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

const results = document.querySelector(".results__container");
let categorizedMealIds = [];
let categorizedMeals = [];
let pickedMeals = [];

async function categoryFilter(event) {
const picked = event.target.value;
results.innerHTML = "";
pickedMeals = [];

const categoryPromise = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${picked}`);
const categoryMeals = await categoryPromise.json();

categorizedMealIds = categoryMeals.meals.map((meal) => meal.idMeal);

const categorizedMealsPromise = categorizedMealIds.map(async (id) => {
  const categorizedPromise = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const catPromises = await categorizedPromise.json();
  return catPromises;
});

categorizedMeals = await Promise.all(categorizedMealsPromise);


//YAY! THIS WORKS
for (let i = 0; i < categorizedMeals.length; ++i) {
  pickedMeals.push(categorizedMeals[i].meals[0]);
};
console.log(pickedMeals[0].strMeal)
pickedMeals.forEach(loadMeals);
};
  
  function sort(){
    const order = document.getElementById('sortArea').value;

    const sorted = pickedMeals.sort((a, b) => {
      const areaA = a.strArea.toLowerCase();
      const areaB = b.strArea.toLowerCase();
      if (order === "A_TO_Z") {
        return areaA.localeCompare(areaB);
      }
      else if (order === "Z_TO_A") {
        return areaB.localeCompare(areaA);
      }
  })
  results.innerHTML = "";
  sorted.forEach(loadMeals);  
}


// loadMeals won't work until i fix the dynamic strings
function loadMeals(meal) {
  console.log(meal);
  function extractVideoId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v'); // This extracts the 'v' parameter
    }

    const videoId = meal.strYoutube ? extractVideoId(meal.strYoutube) : null; // Extract the video ID
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

   results.innerHTML += `
        <div class="filtered card on-hover" style="background-image: url('${meal.strMealThumb}')">
            <div class="inner--outer">
                <p>${meal.strArea}</p>
                <p>${meal.strMeal}</p>
            </div>
            ${videoId ? `<iframe autoplay class="video" src="${embedUrl}" referrerpolicy="strict-origin-when-cross-origin" frameBorder="0" ></iframe>` : ''}
            </div>
    `;
}

