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

  // Backend API call
  fetch("http://localhost:3000/signup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Email already exists") {
        message.textContent = "Email already registered.";
      } else {
        message.className = "success";
        message.textContent = "Sign up successful! Redirecting to login...";
        setTimeout(function () {
          window.location.href = "login.html";
        }, 1500);
      }
    })
    .catch(error => {
      message.textContent = "Error signing up. Please try again.";
      console.error("Error:", error);
    });
});