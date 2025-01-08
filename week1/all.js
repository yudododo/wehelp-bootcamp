const menu = document.querySelector(".menu");
const ul = document.querySelector("ul");
const burger = document.querySelector(".burger");
const close = document.querySelector(".close");

menu.addEventListener("click", () => {
  ul.classList.toggle("visible");
  burger.classList.toggle("hidden");
  close.classList.toggle("show");
});