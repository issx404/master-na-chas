// index.js

// document.getElementById("title").innerText = "Hello from JS!";

console.log("asdasd");
document.getElementById("burger").addEventListener("click", function () {
  this.classList.toggle("active");
  document.getElementById("menu").classList.toggle("open");
});
