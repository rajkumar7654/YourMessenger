const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const loginId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("password").value;

  message.className = "error";

  // Validation
  if (loginId === "" || password === "") {
    message.textContent = "Please fill all fields.";
    return;
  }

  // Backend API call
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: loginId, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Invalid email" || data.message === "Invalid password") {
        message.textContent = data.message;
      } else if (data.message === "Login successful") {
        message.className = "success";
        message.textContent = "Login successful! Redirecting...";
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        setTimeout(function () {
          window.location.href = "chatDashboard.html";
        }, 1500);
      }
    })
    .catch(error => {
      message.textContent = "Error logging in. Please try again.";
      console.error("Error:", error);
    });
});
