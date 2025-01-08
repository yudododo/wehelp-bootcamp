const menu = document.querySelector(".menu");
const ul = document.querySelector("ul");
const burger = document.querySelector(".burger");
const close = document.querySelector(".close");

menu.addEventListener("click", () => {
  // Toggle the display of the menu
  ul.style.display = ul.style.display === "flex" ? "none" : "flex";

  // Toggle the icons
  if (ul.style.display === "flex") {
    burger.style.display = "none";  // Hide hamburger icon
    close.style.display = "flex";  // Show close icon
  } else {
    burger.style.display = "flex";  // Show hamburger icon
    close.style.display = "none";  // Hide close icon
  }
});

