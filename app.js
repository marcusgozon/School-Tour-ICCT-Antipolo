const roleButtons = document.querySelectorAll(".role-btn");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const signupModal = document.getElementById("signupModal");
const openSignupBtn = document.getElementById("openSignupBtn");
const closeSignupBtn = document.getElementById("closeSignupBtn");
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

let selectedRole = "student";

/* One fixed admin account */
const adminAccount = {
  name: "System Admin",
  email: "admin@icct.com",
  password: "admin123",
  role: "admin"
};

/* Save admin locally once */
function initializeAdminAccount() {
  const savedAdmin = localStorage.getItem("icctAdminAccount");
  if (!savedAdmin) {
    localStorage.setItem("icctAdminAccount", JSON.stringify(adminAccount));
  }
}

/* Get students */
function getStudents() {
  return JSON.parse(localStorage.getItem("icctStudents")) || [];
}

/* Save students */
function saveStudents(students) {
  localStorage.setItem("icctStudents", JSON.stringify(students));
}

/* Role switch */
roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedRole = button.dataset.role;

    // Optional UI change
    if (selectedRole === "admin") {
      openSignupBtn.disabled = true;
      openSignupBtn.style.opacity = "0.6";
      openSignupBtn.style.cursor = "not-allowed";
    } else {
      openSignupBtn.disabled = false;
      openSignupBtn.style.opacity = "1";
      openSignupBtn.style.cursor = "pointer";
    }
  });
});

/* Open signup */
openSignupBtn.addEventListener("click", () => {
  if (selectedRole === "admin") {
    signupMessage.textContent = "";
    message.textContent = "Admin account cannot be registered here.";
    message.className = "error";
    return;
  }

  signupModal.classList.add("show");
});

/* Close signup */
closeSignupBtn.addEventListener("click", () => {
  signupModal.classList.remove("show");
  signupForm.reset();
  signupMessage.textContent = "";
});

window.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.classList.remove("show");
    signupForm.reset();
    signupMessage.textContent = "";
  }
});

/* Student signup */
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

  if (!name || !email || !password || !confirmPassword) {
    signupMessage.textContent = "Please complete all fields.";
    signupMessage.className = "error";
    return;
  }

  if (password !== confirmPassword) {
    signupMessage.textContent = "Passwords do not match.";
    signupMessage.className = "error";
    return;
  }

  let students = getStudents();

  const existingStudent = students.find(student => student.email === email);
  const admin = JSON.parse(localStorage.getItem("icctAdminAccount"));

  if (existingStudent || (admin && admin.email === email)) {
    signupMessage.textContent = "Email is already registered.";
    signupMessage.className = "error";
    return;
  }

  const newStudent = {
    id: "student_" + Date.now(),
    name,
    email,
    password,
    role: "student"
  };

  students.push(newStudent);
  saveStudents(students);

  signupMessage.textContent = "Student account created successfully.";
  signupMessage.className = "success";

  setTimeout(() => {
    signupModal.classList.remove("show");
    signupForm.reset();
    signupMessage.textContent = "";
    document.getElementById("email").value = email;
    document.getElementById("password").value = "";
  }, 1000);
});

/* Login */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (selectedRole === "admin") {
    const admin = JSON.parse(localStorage.getItem("icctAdminAccount"));

    if (admin && admin.email === email && admin.password === password) {
      localStorage.setItem("icctCurrentUser", JSON.stringify({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isLoggedIn: true
      }));

      message.textContent = "Admin login successful. Redirecting...";
      message.className = "success";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.textContent = "Invalid admin email or password.";
      message.className = "error";
    }

    return;
  }

  const students = getStudents();
  const foundStudent = students.find(
    (student) => student.email === email && student.password === password
  );

  if (foundStudent) {
    localStorage.setItem("icctCurrentUser", JSON.stringify({
      id: foundStudent.id,
      name: foundStudent.name,
      email: foundStudent.email,
      role: foundStudent.role,
      isLoggedIn: true
    }));

    message.textContent = "Student login successful. Redirecting...";
    message.className = "success";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } else {
    message.textContent = "Invalid student email or password.";
    message.className = "error";
  }
});

initializeAdminAccount();
