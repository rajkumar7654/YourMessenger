const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // page reload hone se rokta hai

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  message.className = "error";

  // Checks
  if (name === "" || email === "" || phone === "" || password === "") {
    message.textContent = "Please fill all the fields.";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    message.textContent = "Enter a valid email.";
    return;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    message.textContent = "Phone number must be 10 digits.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  // Pehle se saved users nikalo
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check karo email ya phone pehle se to nahi hai
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email || users[i].phone === phone) {
      message.textContent = "Email or phone already registered.";
      return;
    }
  }

  // Naya user save karo
  users.push({ name: name, email: email, phone: phone, password: password });
  localStorage.setItem("users", JSON.stringify(users));

  message.className = "success";
  message.textContent = "Sign up successful! Redirecting to login...";

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});