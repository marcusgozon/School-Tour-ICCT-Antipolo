const currentUser = JSON.parse(localStorage.getItem("icctCurrentUser"));

if (!currentUser || !currentUser.isLoggedIn) {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const registerForm = document.getElementById("registerForm");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("icctCurrentUser");
    window.location.href = "login.html";
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
  });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
    }
  });
});

/* Hero Slider */
const slides = document.querySelectorAll(".slide");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const sliderDots = document.getElementById("sliderDots");

let currentSlide = 0;
let autoSlide;

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });

    sliderDots.appendChild(dot);
  });
}

function updateDots(index) {
  const dots = document.querySelectorAll(".dot");
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  updateDots(currentSlide);
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  autoSlide = setInterval(() => {
    nextSlide();
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

if (slides.length > 0) {
  createDots();
  startAutoSlide();

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }
}

/* Fake register form submit */
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Registration submitted successfully!");
    registerForm.reset();
  });
}

/* Campus News Admin Edit with LocalStorage Persistence */
function loadNewsEdits() {
  const savedNews = JSON.parse(localStorage.getItem("icctNewsEdits")) || {};
  document.querySelectorAll(".news-card").forEach(card => {
    const id = card.dataset.id;
    if (savedNews[id]) {
      if (savedNews[id].title) card.querySelector("h3").textContent = savedNews[id].title;
      if (savedNews[id].content) card.querySelector("p").textContent = savedNews[id].content;
      if (savedNews[id].image) card.querySelector("img").src = savedNews[id].image;
    }
  });
}

if (currentUser && currentUser.role === "admin") {
  document.querySelectorAll(".edit-controls").forEach(control => {
    control.style.display = "block";
  });

  document.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const card = this.closest(".news-card");
      const id = card.dataset.id;
      const newTitle = card.querySelector(".edit-title").value;
      const newContent = card.querySelector(".edit-content").value;
      const newImage = card.querySelector(".edit-image").files[0];

      // Load existing edits
      const savedNews = JSON.parse(localStorage.getItem("icctNewsEdits")) || {};

      if (newTitle) {
        card.querySelector("h3").textContent = newTitle;
        savedNews[id] = savedNews[id] || {};
        savedNews[id].title = newTitle;
      }
      if (newContent) {
        card.querySelector("p").textContent = newContent;
        savedNews[id] = savedNews[id] || {};
        savedNews[id].content = newContent;
      }
      if (newImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
          card.querySelector("img").src = event.target.result;
          savedNews[id] = savedNews[id] || {};
          savedNews[id].image = event.target.result;
          localStorage.setItem("icctNewsEdits", JSON.stringify(savedNews));
        };
        reader.readAsDataURL(newImage);
      } else {
        localStorage.setItem("icctNewsEdits", JSON.stringify(savedNews));
      }

      alert("News updated successfully!");
    });
  });
}

// Load saved edits on page load
loadNewsEdits();
