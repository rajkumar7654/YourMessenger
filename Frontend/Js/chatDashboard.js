// ---------- Step 1: HTML ke elements pakdo ----------
const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

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

// ---------- Step 4: Message bhejne wala function ----------
function sendMessage() {
  const text = messageInput.value.trim(); // trim = aage-peeche ki khali space hata do

  // Agar kuch likha hi nahi, to kuch mat karo
  if (text === "") {
    return;
  }

  // Naya message ka dabba banao
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "sent");

  // Message ka text
  const textP = document.createElement("p");
  textP.textContent = text;

  // Message ka time
  const timeSpan = document.createElement("span");
  timeSpan.classList.add("time");
  timeSpan.textContent = getTime();

  // Text aur time ko dabbe ke andar daalo
  messageDiv.appendChild(textP);
  messageDiv.appendChild(timeSpan);

  // Dabba list me daalo (screen par dikhega)
  messageList.appendChild(messageDiv);

  // Input khali karo aur wapas cursor wahi rakho
  messageInput.value = "";
  messageInput.focus();

  // Naya message dikhe isliye neeche scroll karo
  scrollToBottom();
}

// ---------- Step 5: Button / Enter dabane par kya ho ----------
sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Page khulte hi bhi neeche scroll kar do
scrollToBottom();