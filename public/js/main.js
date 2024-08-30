const socket = io();

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const findPartner = document.getElementById("find-partner");
const disconnectPartner = document.getElementById("disconnect-partner");
const onlineUsers = document.getElementById("online-users");
const messageInput = document.getElementById("message-input");
const messageButton = document.getElementById("message-send");
const disconnectModal = document.getElementById("disconnect-modal");
const disconnectYes = document.getElementById("disconnect-yes");
const disconnectNo = document.getElementById("disconnect-no");
const disconnectText = document.getElementById("disconnect-text");

let userRoomId = null;
let isPaired = false;

// Function to create and append a message element
function appendMessage(user, message, time) {
  const messageElement = document.createElement("div");
  if (user.toLowerCase() === "stranger") {
    messageElement.innerHTML = `
    <div class="flex flex-col pb-2">
      <div class="px-4 py-3 bg-neutral-900 max-w-[80%] w-fit rounded-xl">
        <p class="text-wrap break-words">${message}</p>
        <p class="text-neutral-300 text-end">${time}</p>
      </div>
    </div>
  `;
  } else if (user.toLowerCase() === "you") {
    messageElement.innerHTML = `
        <div class="flex flex-col items-end pb-2">
            <div class="px-4 py-3 bg-purple-500 max-w-[80%] w-fit rounded-xl">
                <p class="text-wrap break-words">${message}</p>
                <p class="text-neutral-300 text-end">${time}</p>
            </div>
        </div>
      `;
  } else {
    messageElement.innerHTML = `
        <p class="text-center pb-2 text-neutral-300">${message}</p>
      `;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// UPDATE ONLINE USERS
socket.on("updateOnlineUsers", (count) => {
  onlineUsers.innerText = count;
});

// TRIGGER WHEN FOUND A PARTNER
socket.on("paired", (roomId) => {
  userRoomId = roomId;
  chatBox.innerHTML = "";
  appendMessage("System", "You are now chatting with a stranger...");
  disableButtons(false);
  isPaired = true;
});

// WHEN SENDING MESSAGE
function sendMessage(message) {
  if (message.trim()) {
    socket.emit("message", { roomId: userRoomId, message });
    appendMessage("You", message, getCurrentTime());
  }
}

// WHEN MESSAGE RECEIVED
socket.on("message", ({ message, time }) => {
  appendMessage("Stranger", message, time);
});

// WHEN PARTNER DISCONNECTED
socket.on("partnerDisconnected", () => {
  appendMessage("System", "Stranger Disconnected...");
  swapButtons();
  disableButtons(true);
  isPaired = false;
});

// LOOK FOR A PARTNER
findPartner.addEventListener("click", () => {
  appendMessage("System", "Looking for partner...");
  toggleLoading(findPartner, true);
  setTimeout(() => {
    socket.emit("findPartner");
    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);
});

// DISCONNECT PARTNER
disconnectPartner.addEventListener("click", () => {
  if(isPaired){
    disconnectText.innerText = "Are you sure you want to disconnect to your partner?";
  }else{
    disconnectText.innerText = "Are you sure you want to disconnect looking for partner?";
  }
  disconnectModal.hidden = false;
});
disconnectYes.addEventListener("click", () => {
  socket.emit("partnerDisconnect");
  appendMessage("System", "You Disconnected...");
  swapButtons();
  disableButtons(true);
  disconnectModal.hidden = true;
  isPaired = false;
});
disconnectNo.addEventListener("click", () => {
  disconnectModal.hidden = true;
});

// HANDLE MESSAGE FORM SUBMISSION
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = e.target.elements.message;
  sendMessage(messageInput.value);
  messageInput.value = "";
  messageInput.focus();
});

// TOGGLE BETWEEN FIND AND DISCONNECT BUTTONS
function swapButtons() {
  findPartner.hidden = !findPartner.hidden;
  disconnectPartner.hidden = !disconnectPartner.hidden;
}

function disableButtons(shouldDisable) {
  messageInput.disabled = shouldDisable;
  messageButton.disabled = shouldDisable;
}

function toggleLoading(element, on) {
  if (on) {
    element.disabled = true;
    element.querySelector(".text").style.display = "none";
    element.querySelector(".loading").style.display = "block";
  } else {
    element.disabled = false;
    element.querySelector(".text").style.display = "block";
    element.querySelector(".loading").style.display = "none";
  }
}

function getCurrentTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  // Format minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Construct the time string
  const timeString = `${hours}:${formattedMinutes} ${period}`;

  return timeString;
}
