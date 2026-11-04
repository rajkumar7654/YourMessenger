const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const loginId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("password").value;

  message.className = "error";

  if (loginId === "" || password === "") {
    message.textContent = "Please fill all the fields.";
    return;
  }

  // Saved users nikalo
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let found = null;

  // Email ya phone se user dhundo
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === loginId || users[i].phone === loginId) {
      found = users[i];
      break;
    }
  }

  if (found === null) {
    message.textContent = "User not found. Please sign up first.";
    return;
  }

  if (found.password !== password) {
    message.textContent = "Wrong password.";
    return;
  }

  message.className = "success";
  message.textContent = "Login successful! Welcome, " + found.name;
});