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
document.getElementById('applyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const coverNote = document.getElementById('coverNote').value;
    const fileInput = document.getElementById('cvFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const base64File = event.target.result;

            const applicationData = {
                fullName: fullName,
                email: email,
                jobTitle: jobTitle,
                cvName: file.name,
                cvData: base64File,
                coverNote: coverNote,
                date: new Date().toLocaleDateString()
            };

            // Save to localStorage
            let applications = JSON.parse(localStorage.getItem('applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('applications', JSON.stringify(applications));

            alert('Application submitted successfully!');
            document.getElementById('applyForm').reset();
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please upload your CV document.');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const applicationsList = document.getElementById('applicationsList');
    
    if (applicationsList) {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];

        if (applications.length === 0) {
            applicationsList.innerHTML = '<p>No applications submitted yet.</p>';
            return;
        }

        let html = '';
        applications.forEach((app) => {
            html += `
                <div class="application-card" style="border: 1px solid #ccc; padding: 15px; margin-top: 10px; border-radius: 5px; background: #fff;">
                    <h3>${app.fullName}</h3>
                    <p><strong>Email:</strong> ${app.email}</p>
                    <p><strong>Job Title:</strong> ${app.jobTitle}</p>
                    <p><strong>Date:</strong> ${app.date}</p>
                    <p><strong>Cover Note:</strong> ${app.coverNote}</p>
                    <p><strong>CV File:</strong> <a href="${app.cvData}" download="${app.cvName}">${app.cvName} (Download)</a></p>
                </div>
            `;
        });

        applicationsList.innerHTML = html;
    }
});
// --- HANDLE STUDENT APPLICATION SUBMISSION ---
const applyForm = document.getElementById("applyForm");
if (applyForm) {
    applyForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const jobTitle = document.getElementById("jobTitle").value;
        const coverNote = document.getElementById("coverNote").value;
        const cvFile = document.getElementById("cvFile").files[0];

        if (!fullName || !email || !jobTitle || !cvFile) {
            alert("Please fill in all required fields and upload your CV.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const cvData = event.target.result; // Base64 string of the file
            const cvName = cvFile.name;
            const date = new Date().toLocaleDateString();

            const newApplication = {
                fullName,
                email,
                jobTitle,
                coverNote,
                cvData,
                cvName,
                date
            };

            const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
            existingApplications.push(newApplication);
            localStorage.setItem("applications", JSON.stringify(existingApplications));

            alert("Application submitted successfully!");
            applyForm.reset();
            window.location.href = "index.html";
        };

        reader.readAsDataURL(cvFile);
    });
}
// --- HANDLE STUDENT APPLICATION SUBMISSION ---
document.addEventListener("DOMContentLoaded", function () {
    const applyForm = document.getElementById("applyForm");
    
    if (applyForm) {
        applyForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value;
            const email = document.getElementById("email").value;
            const jobTitle = document.getElementById("jobTitle").value;
            const coverNote = document.getElementById("coverNote").value;
            const cvFileInput = document.getElementById("cvFile");

            if (!fullName || !email || !jobTitle || cvFileInput.files.length === 0) {
                alert("Please fill in all required fields and upload your CV.");
                return;
            }

            const cvFile = cvFileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const cvData = event.target.result;
                const cvName = cvFile.name;
                const date = new Date().toLocaleDateString();

                const newApplication = {
                    fullName,
                    email,
                    jobTitle,
                    coverNote,
                    cvData,
                    cvName,
                    date
                };

                const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
                existingApplications.push(newApplication);
                localStorage.setItem("applications", JSON.stringify(existingApplications));

                alert("Application submitted successfully!");
                applyForm.reset();
                window.location.href = "admin.html"; // Redirects straight to admin dashboard to see it!
            };

            reader.readAsDataURL(cvFile);
        });
    }
});
// --- 7. RENDER STUDENT APPLICATIONS ---
document.addEventListener("DOMContentLoaded", () => {
    const applicationsList = document.getElementById("applicationsList");
    if (!applicationsList) return;

    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    if (applications.length === 0) {
        applicationsList.innerHTML = "<p>No applications submitted yet.</p>";
        return;
    }

    let html = "";
    applications.forEach((app) => {
        html += `
            <div class="job-card" style="margin-bottom: 15px; background: #fff; padding: 15px; border-radius: 5px;">
                <h3>${app.fullName || "Applicant"}</h3>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Job Title:</strong> ${app.jobTitle}</p>
                <p><strong>Cover Note:</strong> ${app.coverNote}</p>
            </div>
        `;
    });
    applicationsList.innerHTML = html;
});