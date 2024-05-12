const hidden = document.querySelector(".hidden");
const showDiv = document.getElementById("container");
const sortButton = document.getElementById("sortButton");
function convert(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  return { hours, minutes, remainingSeconds };
}

const loadCategories = async (id = 1000) => {
  try {
    hidden.style.display = "block";
    const response = await fetch(
      ` https://openapi.programming-hero.com/api/videos/category/${id}`
    );
    const result = await response.json();
    if (result?.status == true) {
      let data = [...result?.data];

      sortButton.addEventListener("click", () => {
        const sortData = data.sort((a, b) => {
          const viewsA = parseFloat(a?.others?.views);
          const viewsB = parseFloat(b?.others?.views);
          return viewsB - viewsA;
        });
        showCategory(data);
        sortButton.classList.add("active");
      });

      showCategory(data);
      sortData.classList.remove("active");
    } else {
      hidden.style.display = "none";
      showDiv.innerHTML = "";
      const p = document.createElement("p");
      p.classList.add("error");
      p.innerText = result?.message;
      showDiv.appendChild(p);
    }
  } catch (error) {
    const p = document.createElement("p");
    p.classList.add("error");
    p.innerText = "";
    showDiv.appendChild(p);
    hidden.style.display = "none";
  }
};

const showCategory = (data) => {
  showDiv.innerHTML = "";
  for (let category of data) {
    let { hours, minutes, remainingSeconds } = convert(
      Number(category?.others?.posted_date)
    );
    const div = document.createElement("div");
    div.classList.add("singleDiv");

    div.innerHTML = `
  <div class="relative">
    <figure>
  <img class="images" src=${category?.thumbnail} alt="" />
  
</figure>
<p class="time"> ${
      category?.others?.posted_date &&
      `${hours} hours ${minutes} minutes ${remainingSeconds} ago`
    }</p>
</div>
   <div class="flex"> <figure>
   <img class="author_images" src=${
     category?.authors[0]?.profile_picture
   } alt="" />
 </figure>
   <div><h2>${category?.title}</h2> <p>${category?.authors[0]?.profile_name}</p>
   <div class="category_btn"> <button >${
     category?.others?.views
   }</button></div></div></div>
   
  `;

    showDiv.appendChild(div);
  }
  hidden.style.display = "none";
};

const categoryLoad = async () => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/categories`
    );
    const result = await response.json();
    if (result?.status == true) {
      category(result?.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const category = (data) => {
  const categoryId = document.getElementById("category_button");

  data.forEach((element) => {
    const button = document.createElement("button");
    if (element?.category == "All") {
      console.log("true");
      button.classList.add("active_button");
      sortButton.classList.remove("active");
    }
    button.addEventListener("click", () => {
      showFun(element?.category_id, element?.category, button);
      sortButton.classList.remove("active");
    });
    button.innerText = element?.category;
    categoryId.appendChild(button);
  });
};

const showFun = (id, category, button) => {
  const buttons = document.querySelectorAll("#category_button button");
  buttons.forEach((button) => {
    if (button.innerText == category) {
      button.classList.add("active");
      button.classList.remove("active_button");
    } else {
      button.classList.remove("active");
      button.classList.remove("active_button");
    }
  });

  if (id) {
    loadCategories(id);
  }
};
categoryLoad();
loadCategories();
