const socket = io();
let userRoomId = null;
let isPaired = false;

socket.on("updateOnlineUsers", (count) => {
  onlineUsers.innerText = count;
});

socket.on("paired", ({ roomId, username, interest }) => {
  chatBox.innerHTML = "";
  collapsibleContent.classList.toggle("hidden");
  userRoomId = roomId;
  appendMessage(
    "System",
    `You are now chatting with ${username || "a stranger"}.`
  );
  if (interest && interest.length > 0) {
    appendMessage("System", `Matched interest(s): ${interest.join(", ")}.`);
  }
  disableButtons(false);
  isPaired = true;
});

socket.on("chat", ({ message, username }) => {
  appendMessage("Stranger", message, getCurrentTime(), username);
});

socket.on("partnerDisconnect", ({ username }) => {
  collapsibleContent.classList.toggle("hidden");
  appendMessage("System", `${username || "Stranger"} Disconnected.`);
  swapButtons();
  disableButtons(true);
  isPaired = false;
  disableInputs(false);
});

function sendMessage(message) {
  const username = usernameInput.value || "";
  if (message.trim()) {
    socket.emit("chat", {
      roomId: userRoomId,
      message,
      username,
    });
    appendMessage("You", message, getCurrentTime(), username);
  }
}
