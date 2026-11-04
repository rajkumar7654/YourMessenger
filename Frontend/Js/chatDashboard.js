// ---------- Step 1: HTML ke elements pakdo ----------
const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const logoutButton = document.getElementById("logoutButton"); // NEW

// NEW: Login page ka rasta (path). Apne login page ke hisab se yahan badal lena.
const LOGIN_PAGE = "/Frontend/index.html";

// ---------- Step 2: Abhi ka time nikalne wala function ----------
function getTime() {
  const now = new Date();
  // Example output: "03:45 PM"
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ---------- Step 3: Sabse neeche scroll karne wala function ----------
function scrollToBottom() {
  messageList.scrollTop = messageList.scrollHeight;
}

// ---------- Step 3.5: Messages load karne wala function ----------
async function loadMessages() {
  try {
    const response = await fetch("http://localhost:3000/message");
    const messages = await response.json();

    // Pehle saare messages clear karo
    messageList.innerHTML = "";

    // Saare messages display karo
    messages.forEach(msg => {
      const messageDiv = document.createElement("div");
      // Agar message current user ka hai to sent, warna received
      const currentUserId = localStorage.getItem("userId");
      messageDiv.classList.add("message", msg.userId == currentUserId ? "sent" : "received");

      // Message ka text
      const textP = document.createElement("p");
      textP.textContent = msg.message;

      // Message ka time
      const timeSpan = document.createElement("span");
      timeSpan.classList.add("time");
      const date = new Date(msg.createdAt);
      timeSpan.textContent = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Text aur time ko dabbe ke andar daalo
      messageDiv.appendChild(textP);
      messageDiv.appendChild(timeSpan);

      // Dabba list me daalo
      messageList.appendChild(messageDiv);
    });

    // Neeche scroll karo
    scrollToBottom();
  } catch (error) {
    console.error("Error loading messages:", error);
  }
}

// ---------- Step 4: Message bhejne wala function ----------
async function sendMessage() {
  const text = messageInput.value.trim(); // trim = aage-peeche ki khali space hata do

  // Agar kuch likha hi nahi, to kuch mat karo
  if (text === "") {
    return;
  }

  // User ID le lo (localStorage se ya kisi aur jagah se)
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first!");
    return;
  }

  try {
    // Backend API par message bhejo
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        message: text
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Message saved to database:", data);

      // Input khali karo aur wapas cursor wahi rakho
      messageInput.value = "";
      messageInput.focus();

      // Saare messages reload karo (naya message bhi aa jayega)
      await loadMessages();
    } else {
      console.error("Error saving message:", data);
      alert("Failed to send message");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send message");
  }
}

// ---------- Step 5: Button / Enter dabane par kya ho ----------
sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// ---------- Step 6 (NEW): Logout ----------
function logout() {
  // Login ki yaad (userId) mita do
  localStorage.removeItem("userId");

  // Login page khol do
  window.location.href = LOGIN_PAGE;
}

logoutButton.addEventListener("click", logout);

// Page khulte hi saare messages load karo
loadMessages();

// Har 2 second mein messages automatically refresh karo
setInterval(loadMessages, 1000);