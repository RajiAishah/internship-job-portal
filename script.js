document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.getElementById("searchBox");
  const jobCards = document.querySelectorAll(".job-card");

  if (searchBox) {
    searchBox.addEventListener("input", function () {
      const searchTerm = searchBox.value.toLowerCase();

      jobCards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});// Handle Apply form
const applyForm = document.getElementById("applyForm");
if (applyForm) {
  applyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Application submitted successfully! (This is a demo — no server connected yet.)");
    applyForm.reset();
  });
}

// Handle Login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login successful! (This is a demo — no server connected yet.)");
    loginForm.reset();
  });
}

// Handle Register form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Account created successfully! (This is a demo — no server connected yet.)");
    registerForm.reset();
  });
}