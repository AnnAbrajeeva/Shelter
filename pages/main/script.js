//Подсветка меню

// const menu = document.querySelectorAll(".header__nav-link");

// menu.forEach((el) => {
//   let url = document.location.href;
//   if (el.href === url) {
//     el.classList.add("active");
//   }
// });

// //Мобильное меню
const mobMenu = document.querySelector(".header__mobile-menu");
const menuWrapper = document.querySelector(".header__nav-list");
const burger = document.querySelector(".header__burger-icon");
const overlay = document.querySelector(".overlay");
const logo = document.querySelector(".header__logo-wrapper");
const linkToTop = document.querySelectorAll("[data-top]")


linkToTop.forEach(link => {
  link.addEventListener('click', () => {
    window.scrollTo(top)
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

// Слайдер
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
let sliderWrapper = document.querySelector(".slider__wrapper");

let petsArr = [];
let lastPets = [];
const sliderPets = [];
let slidesNum = 3;
let animationLeft;
let animationRight;

if (document.documentElement.clientWidth >= 1280) {
  slidesNum = 3;
  animationLeft = "to-left-1280";
  animationRight = "to-right-1280";
} else if (
  document.documentElement.clientWidth < 1280 &&
  document.documentElement.clientWidth >= 768
) {
  slidesNum = 2;
  animationLeft = "to-left-768";
  animationRight = "to-right-768";
} else if (document.documentElement.clientWidth < 768) {
  slidesNum = 1;
  animationLeft = "to-left-320";
  animationRight = "to-right-320";
}

const fetchPets = async () => {
  let res = await fetch("../../assets/pets.json")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 3; i++) {
        changePets(data);
      }
      petsArr = data;
      for (let i = 0; i < 3; i++) {
        let randomArr = changePets(petsArr);
        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("slider__item-wrapper");
        randomArr.forEach((pet) => {
          const slide = renderPets(pet);
          itemWrapper.append(slide);
        });
        sliderWrapper.append(itemWrapper);
      }
    });
  return res;
};

fetchPets();

function changePets(pets) {
  let arr;
  if (lastPets.length > slidesNum) {
    lastPets.splice(0, slidesNum);
  }
  let petsVisible = [];
  arr = pets.filter((pet) => !lastPets.includes(pet));
  for (let i = 0; i < slidesNum; i++) {
    let index = Math.floor(Math.random() * arr.length);
    let pet = arr[index];

    if (!lastPets.includes(pet) && !petsVisible.includes(pet)) {
      petsVisible.push(pet);
    }
    arr.splice(index, 1);
  }
  lastPets.push(...petsVisible);
  return petsVisible;
}

function renderPets(item) {
  let sliderItem = document.createElement("div");
  sliderItem.classList.add("slider__item");

  sliderItem.setAttribute("id", item.name);
  let pet = `
        <div class="slider__item-img">
          <img
            src="${item.img}"
            alt="${item.name}"
          />
        </div>
        <h3 class="slider__item-title">${item.name}</h3>
        <button class="btn slider__btn">Learn more</button>
        `;
  sliderItem.innerHTML = pet;
  return sliderItem;
}

sliderWrapper.addEventListener("animationend", (animationEvent) => {
  let children = sliderWrapper.children;
  if (animationEvent.animationName === animationLeft) {
    sliderWrapper.classList.remove(animationLeft);

    let left = children[0];
    children[1].innerHTML = left.innerHTML;

    let randomArr = changePets(petsArr);
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("slider__item-wrapper");
    randomArr.forEach((pet) => {
      const slide = renderPets(pet);
      itemWrapper.append(slide);
    });
    left.innerHTML = itemWrapper.innerHTML;
  } else {
    sliderWrapper.classList.remove(animationRight);
    let right = children[2];
    children[1].innerHTML = right.innerHTML;

    let randomArr = changePets(petsArr);
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("slider__item-wrapper");
    randomArr.forEach((pet) => {
      const slide = renderPets(pet);
      itemWrapper.append(slide);
    });
    right.innerHTML = itemWrapper.innerHTML;
  }
  arrowLeft.addEventListener("click", moveLeft);
  arrowRight.addEventListener("click", moveRight);
});

arrowLeft.addEventListener("click", moveLeft);
arrowRight.addEventListener("click", moveRight);

function moveLeft() {
  sliderWrapper.classList.add(animationLeft);
  arrowLeft.removeEventListener("click", moveLeft);
  arrowRight.removeEventListener("click", moveRight);
}

function moveRight() {
  sliderWrapper.classList.add(animationRight);
}

sliderWrapper.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.closest(".slider__item")) {
    createModal(e);
  }
});

// Модалка

const modal = document.querySelector(".modal");
let modalContent = document.querySelector(".modal__content");
const modalBody = document.querySelector(".modal__body");

function createModal(e) {
  let slide = e.target.closest(".slider__item");
  let id = slide.getAttribute("id");
  openModal();
  addModalContent(id);
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
        <li class="modal__dog-item">
          <span>Inoculations:</span> ${item.inoculations.join(", ")}
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
