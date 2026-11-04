
const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const logoutButton = document.getElementById("logoutButton");

const LOGIN_PAGE = "/Frontend/index.html";

const token = localStorage.getItem("token");

const socket = io("http://localhost:3000", {
    auth: {
        token: token
    }
});

function scrollToBottom() {
    messageList.scrollTop = messageList.scrollHeight;
}

function displayMessage(msg) {

    const currentUserId = localStorage.getItem("userId");

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        msg.userId == currentUserId ? "sent" : "received"
    );

    const textP = document.createElement("p");
    textP.textContent = msg.message;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");

    const date = new Date(msg.createdAt);

    timeSpan.textContent = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    messageDiv.appendChild(textP);
    messageDiv.appendChild(timeSpan);

    messageList.appendChild(messageDiv);

    scrollToBottom();
}

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("messageHistory", (messages) => {

    messageList.innerHTML = "";

    messages.forEach(msg => {
        displayMessage(msg);
    });

});

socket.on("receiveMessage", (msg) => {
    displayMessage(msg);
});

function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first!");
        return;
    }

    sendButton.disabled = true;

    socket.emit("sendMessage", {
        message: text
    }, (response) => {

        sendButton.disabled = false;

        if (response.success) {
            messageInput.value = "";
            messageInput.focus();
        } else {
            alert(response.message);
        }

    });
}

function logout() {

    localStorage.removeItem("userId");

    window.location.href = LOGIN_PAGE;
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }

});

logoutButton.addEventListener("click", logout);
