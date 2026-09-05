document.addEventListener("DOMContentLoaded", () => {

  // --- 1. REGISTER FORM ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      if (!fullName || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

      if (existingUsers.some(u => u.email === email)) {
        alert("An account with this email already exists! Please log in.");
        return;
      }

      const newUser = { fullName, email, password };
      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html";
    });
  }

  // --- 2. LOGIN FORM ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = document.getElementById("email").value.trim().toLowerCase();
      const passwordInput = document.getElementById("password").value;

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

      const matchedUser = existingUsers.find(
        u => u.email === emailInput && u.password === passwordInput
      );

      if (matchedUser) {
        alert("Login successful! Welcome back, " + matchedUser.fullName + "!");
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));
        loginForm.reset();
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password.");
      }
    });
  }

  // --- 3. SESSION GREETING & LOGOUT ---
  const userGreeting = document.getElementById("userGreeting");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (userGreeting) {
    if (currentUser) {
      userGreeting.innerHTML = `
        <span>Welcome, ${currentUser.fullName}!</span>
        <button id="logoutBtn" style="margin-left: 10px; padding: 4px 8px; cursor: pointer;">Logout</button>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        alert("Logged out successfully.");
        window.location.reload();
      });
    } else {
      userGreeting.innerHTML = `<a href="login.html">Login</a> | <a href="register.html">Register</a>`;
    }
  }

  // --- 4. AUTO-FILL APPLICATION FORM ---
  const applyForm = document.getElementById("applyForm");
  if (applyForm && currentUser) {
    const nameInput = document.getElementById("applicantName");
    const emailInput = document.getElementById("applicantEmail");

    if (nameInput) nameInput.value = currentUser.fullName;
    if (emailInput) emailInput.value = currentUser.email;
  }

  // --- 5. POST A NEW JOB (admin.html) ---
  const jobPostForm = document.getElementById("jobPostForm");
  if (jobPostForm) {
    jobPostForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("jobTitle").value.trim();
      const company = document.getElementById("companyName").value.trim();
      const location = document.getElementById("jobLocation").value.trim();

      if (!title || !company || !location) {
        alert("Please fill in all fields.");
        return;
      }

      const newJob = { title, company, location };

      const storedJobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
      storedJobs.push(newJob);

      localStorage.setItem("postedJobs", JSON.stringify(storedJobs));

      alert("Job posted successfully!");
      jobPostForm.reset();
      window.location.href = "index.html";
    });
  }

  // --- 6. RENDER DYNAMIC JOBS (index.html) ---
  const jobListContainer = document.querySelector(".job-list");
  if (jobListContainer) {
    const storedJobs = JSON.parse(localStorage.getItem("postedJobs")) || [];

    storedJobs.forEach(job => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <a href="apply.html?job=${encodeURIComponent(job.title)}">Apply Now</a>
      `;
      jobListContainer.appendChild(jobCard);
    });
  }

});
// Search and Filter Jobs Functionality
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const filterValue = searchInput.value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card'); // Make sure your job cards have class="job-card"

    jobCards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      if (text.includes(filterValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
// Search & Filter Jobs Logic
document.addEventListener('DOMContentLoaded', function () {
  const searchBox = document.getElementById('searchBox');

  if (searchBox) {
    searchBox.addEventListener('input', function () {
      const filterValue = searchBox.value.toLowerCase().trim();
      const jobCards = document.querySelectorAll('.job-card');

      jobCards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        if (text.includes(filterValue)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});