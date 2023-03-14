//Подсветка меню

// const menu = document.querySelectorAll(".header__nav-link");

// menu.forEach((el) => {
//   let url = document.location.href;
//   if (el.href === url) {
//     el.classList.add("active");
//   }
// });

//Мобильное меню
const mobMenu = document.querySelector(".header__mobile-menu");
const burger = document.querySelector(".header__burger-icon");
const overlay = document.querySelector(".overlay");
const logo = document.querySelector(".header__logo-wrapper");
const linkToTop = document.querySelectorAll("[data-top]")


linkToTop.forEach(link => {
  link.addEventListener('click', () => {
    window.scrollTo(0, 0)
    closeMenu();
  })
})

burger.addEventListener("click", () => {
  if (burger.classList.contains("close")) {
    closeMenu();
  } else {
    openMenu();
  }
});

mobMenu.addEventListener("click", (e) => {
  if (e.target.classList.contains("header__nav-link")) {
    closeMenu();
  }
});

overlay.addEventListener("click", closeMenu);

function openMenu() {
  overlay.classList.add("active");
  document.querySelector("body").style.overflow = "hidden";
  setTimeout(() => {
    logo.classList.add("left");
    burger.classList.add("close");
    mobMenu.classList.add("active");
  }, 500);
}

function closeMenu() {
  document.querySelector("body").style.overflow = "";
  logo.classList.remove("left");
  overlay.classList.remove("active");
  burger.classList.remove("close");
  mobMenu.classList.remove("active");
}

// Пагинация

const petsWrapper = document.querySelector(".pets__wrapper");
let firstPage = document.querySelector('[data-page="firstPage"]');
let prevPage = document.querySelector('[data-page="prevPage"]');
let nextPage = document.querySelector('[data-page="nextPage"]');
let lastPage = document.querySelector('[data-page="lastPage"]');
let pageNumber = document.querySelector('[data-page="pageNumber"] span');

let allPets = [];
let petsArr = [];
let currentPage = 1;
let numOfPets = 8;
let lastPageNum;

const fetchPets = async () => {
  let res = await fetch("../../assets/pets.json")
    .then((res) => res.json())
    .then((data) => {
      changeNumOfPets();
      setLastPage();
      petsArr = getArr(data);
      console.log(petsArr)
      showPetsCard(petsArr);
    });
  return res;
};

fetchPets();

function setLastPage() {
  lastPageNum = Math.ceil(petsArr.length / numOfPets);
}

// function changePets(pets) {
//   for (let i = 0; i < 6; i++) {
//     let petsArr = shuffleArr(pets);
//     allPets.push(...petsArr);
//   }
// }

function shuffleArr(pets) {
  let arr = pets.slice(0);
  let petsVisible = [];
  for (let j = 0; j < pets.length; j++) {
    let index = Math.floor(Math.random() * arr.length);
    let pet = arr[index];
    petsVisible.push(pet);
    arr.splice(index, 1);
  }
  return petsVisible;
}

function renderPets(pets) {
  petsWrapper.innerHTML = "";
  pets.forEach((item) => {
    let petsItem = document.createElement("div");
    petsItem.classList.add("pets__item");
    petsItem.setAttribute("id", item.name);
    let pet = `
          <div class="pets__item-img">
            <img
              src="${item.img}"
              alt="${item.name}"
            />
          </div>
          <h3 class="pets__item-title">${item.name}</h3>
          <button class="btn pets__btn">Learn more</button>
          `;
    petsItem.innerHTML = pet;
    petsItem.addEventListener("click", (e) => {
      createModal(e);
    });
    petsWrapper.appendChild(petsItem);
  });
}

function getArr(arr) {
  let newArr = arr.slice(0);
  let allArr = [];

  for (let i = 0; i < 6; i++) {
    allArr.push(...newArr);
  }
  const allArrPets = getAllPets(allArr)

  return allArrPets;
}

function getAllPets(arr) {
  const temporal = [];
  for (var i = 0; i < arr.length; i += numOfPets) {
    let slice = arr.slice(i, i + numOfPets);
    temporal.push(...shuffleArr(slice));
  }

  return temporal
}

function showPetsCard(pets) {
  setLastPage();
  checkDisableBtn();
  changePage();

  let start = (currentPage - 1) * numOfPets;
  let end = start + numOfPets;

  let petsSlice = pets.slice(start, end);

  renderPets(petsSlice);
}

function checkUniq(arr) {
  const uniqueArray = arr.filter((val, ind, arr) => arr.indexOf(val) !== ind);
  return uniqueArray.length;
}

function checkDisableBtn() {
  if (currentPage === lastPageNum) {
    lastPage.classList.add("disabled");
    nextPage.classList.add("disabled");
  } else {
    lastPage.classList.remove("disabled");
    nextPage.classList.remove("disabled");
  }

  if (currentPage === 1) {
    prevPage.classList.add("disabled");
    firstPage.classList.add("disabled");
  } else {
    prevPage.classList.remove("disabled");
    firstPage.classList.remove("disabled");
  }

  if (currentPage > lastPageNum && lastPageNum) {
    currentPage = lastPageNum;
  }
}

function getNextPage() {
  currentPage = currentPage + 1;
  showPetsCard(petsArr);
}

function getPrevPage() {
  currentPage = currentPage - 1;
  showPetsCard(petsArr);
}

function getLastPage() {
  currentPage = lastPageNum;
  showPetsCard(petsArr);
}

function getFirstPage() {
  currentPage = 1;
  showPetsCard(petsArr);
}

function changePage() {
  pageNumber.textContent = currentPage;
}

nextPage.addEventListener("click", getNextPage);
lastPage.addEventListener("click", getLastPage);
prevPage.addEventListener("click", getPrevPage);
firstPage.addEventListener("click", getFirstPage);

window.addEventListener("resize", () => {
  changeNumOfPets();
});

function changeNumOfPets() {
  if (window.innerWidth >= 1280) {
    numOfPets = 8;
    showPetsCard(petsArr);
  } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
    numOfPets = 6;
    showPetsCard(petsArr);
  } else if (window.innerWidth < 768) {
    numOfPets = 3;
    showPetsCard(petsArr);
  }
}

// Модалка

const modal = document.querySelector(".modal");
let modalContent = document.querySelector(".modal__content");
const modalBody = document.querySelector(".modal__body");

function createModal(e) {
  openModal();
  addModalContent(e.currentTarget.id);
}

modalBody.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("modal__body")) {
    document.querySelector(".modal__close").style.backgroundColor = "#FDDCC4";
  }
});

modalBody.addEventListener("mouseout", (e) => {
  if (
    !e.target.classList.contains("modal__body") &&
    !e.target.classList.contains("modal__close")
  ) {
    document.querySelector(".modal__close").style.backgroundColor =
      "transparent";
  }
});

function openModal() {
  document.querySelector("body").style.overflow = "hidden";
  modal.classList.add("active");
}

function closeModal() {
  document.querySelector("body").style.overflow = "";
  modal.classList.remove("active");
}

function addModalContent(pet) {
  petsArr.forEach((item) => {
    if (item.name === pet) {
      modalContent.innerHTML = `
      <div class="modal__close">
      <span></span>
      <span></span>
    </div>
    <div class="modal__dog-img">
      <img src="${item.img}" alt="${item.name}" />
    </div>
    <div class="modal__dog">
      <h3 class="modal__dog-title">${item.name}</h3>
      <p class="modal__dog-subtitle">${item.type} - ${item.breed}</p>
      <p class="modal__dog-descr">
      ${item.description}
      </p>
      <ul class="modal__dog-list">
        <li class="modal__dog-item"><span>Age:</span> ${item.age}</li>
        <li class="modal__dog-item"><span>Inoculations:</span> ${item.inoculations.join(
          ", "
        )}
        </li>
        <li class="modal__dog-item"><span>Diseases:</span> ${item.diseases.join(
          ", "
        )}</li>
        <li class="modal__dog-item"><span>Parasites:</span> ${item.parasites.join(
          ", "
        )}</li>
      </ul>
    </div>
  `;
    }
  });
}

window.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal__body") ||
    e.target.classList.contains("modal__close")
  ) {
    closeModal();
  }
});
